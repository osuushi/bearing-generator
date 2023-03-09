import { Polygon } from "./polygon";
import { revolve } from "./revolve";
import { newXZPoint, Point, Triangle } from "./types";

const retentionRadiusOffset = 1;
const retentionVerticalOffset = .5;
const retentionTiltOffset = 2;

export class Bearing {
  outerDiameter: number;
  boreDiameter: number;
  width: number;
  clearance: number;

  constructor({ outerDiameter, boreDiameter, width, clearance }: {
    outerDiameter: number, boreDiameter: number, width: number, clearance: number
  }) {
    this.outerDiameter = outerDiameter;
    this.boreDiameter = boreDiameter;
    this.width = width;
    this.clearance = clearance;
  }

  get sliderInnerDiameter(): number {
    return this.boreDiameter + (this.outerDiameter - this.boreDiameter) / 3;
  }

  get sliderOuterDiameter(): number {
    return this.boreDiameter + 2 * (this.outerDiameter - this.boreDiameter) / 3;
  }

  getTriangles(): Triangle[] {
    return [
      ...this.getTrianglesForInnerRing(),
      ...this.getTrianglesForSlider(),
      ...this.getTrianglesForOuterRing(),
    ]
  }

  trianglesWithMirroredBottom(bottomTriangles: Triangle[]): Triangle[] {
    const topTriangles = bottomTriangles.map(t => {
      t = t.flip();
      t.a.z = this.width - t.a.z;
      t.b.z = this.width - t.b.z;
      t.c.z = this.width - t.c.z;
      return t;
    })
    return [...bottomTriangles, ...topTriangles];
  }

  getTrianglesForInnerRing(): Triangle[] {
    return revolve(this.innerRingPolygon);
  }

  get innerRingPolygon(): Polygon {
    let innerRadius = this.boreDiameter / 2;
    let outerMax = this.sliderInnerDiameter / 2 - this.clearance;
    let outerMin = outerMax - retentionRadiusOffset;
    return new Polygon([
      // Bottom
      newXZPoint(innerRadius, 0),
      newXZPoint(outerMax, 0),
      // Rise up to the top of the bottom tilt
      newXZPoint(outerMax, retentionVerticalOffset),
      // Tilt in
      newXZPoint(outerMin, retentionVerticalOffset + retentionTiltOffset),
      // Rise to the top tilt
      newXZPoint(outerMin, this.width - retentionVerticalOffset - retentionTiltOffset),
      // Tilt out
      newXZPoint(outerMax, this.width - retentionVerticalOffset),
      // Rise to the top
      newXZPoint(outerMax, this.width),
      // Top
      newXZPoint(innerRadius, this.width),
      // Polygon closed implicitly
    ])
  }

  getTrianglesForSlider(): Triangle[] {
    return revolve(this.sliderPolygon);
  }

  get sliderPolygon(): Polygon {
    const innerMax = this.sliderInnerDiameter / 2;
    const innerMin = innerMax - retentionRadiusOffset;
    const outerMin = this.sliderOuterDiameter / 2;
    const outerMax = outerMin + retentionRadiusOffset;

    return new Polygon([
      // Bottom
      newXZPoint(innerMax, 0),
      newXZPoint(outerMin, 0),
      // Rise up to the top of the bottom tilt
      newXZPoint(outerMin, retentionVerticalOffset),
      // Tilt out
      newXZPoint(outerMax, retentionVerticalOffset + retentionTiltOffset),
      // Rise to the top tilt
      newXZPoint(outerMax, this.width - retentionVerticalOffset - retentionTiltOffset),
      // Tilt in
      newXZPoint(outerMin, this.width - retentionVerticalOffset),
      // Rise to the top
      newXZPoint(outerMin, this.width),
      // Top
      newXZPoint(innerMax, this.width),
      // Drop to the top tilt
      newXZPoint(innerMax, this.width - retentionVerticalOffset),
      // Tilt in
      newXZPoint(innerMin, this.width - retentionVerticalOffset - retentionTiltOffset),
      // Drop to the bottom tilt
      newXZPoint(innerMin, retentionVerticalOffset + retentionTiltOffset),
      // Tilt out
      newXZPoint(innerMax, retentionVerticalOffset),
      // Polygon closed implicitly
    ])
  }

  getTrianglesForOuterRing(): Triangle[] {
    return revolve(this.outerRingPolygon);
  }

  get outerRingPolygon(): Polygon {
    const innerMin = this.sliderOuterDiameter / 2 + this.clearance;
    const innerMax = innerMin + retentionRadiusOffset;

    return new Polygon([
      // Outer edge
      newXZPoint(this.outerDiameter / 2, 0),
      newXZPoint(this.outerDiameter / 2, this.width),
      // Top
      newXZPoint(innerMin, this.width),
      // Drop down by the vertical offset
      newXZPoint(innerMin, this.width - retentionVerticalOffset),
      // Tilt in by the tilt offset
      newXZPoint(innerMax, this.width - retentionVerticalOffset - retentionTiltOffset),
      // Drop down to the top of the bottom tilt
      newXZPoint(innerMax, retentionVerticalOffset + retentionTiltOffset),
      // Tilt out
      newXZPoint(innerMin, retentionVerticalOffset),
      // Drop to X axis
      newXZPoint(innerMin, 0),
      // Bottom is implied by closing the polygon
    ])
  }

  drawPreview(canvas: HTMLCanvasElement) {
    // Get all the polygons
    // Get the extents of the points in the polygons
    // Get the bounds of the canvas
    // Compute the scale factor so that the largest ratio of polygon dimension to canvas dimension is 0.8
    // Compute the translation so that the center of the polygons is at the center of the canvas
    // Transform the polygons
    // Clear the canvas
    // Draw a rectangle of the polygon bounds to fake the insides of the bearing rings
    // Draw the polygons
    // Mirror the polygons over the Y axis and draw them again.

    let innerRing = this.innerRingPolygon;
    let slider = this.sliderPolygon;
    let outerRing = this.outerRingPolygon;
    const polygons = [
      innerRing,
      slider,
      outerRing,
    ];

    const maxX = Math.max(...polygons.map(p => p.points.reduce((max, p) => Math.max(max, p.x), -Infinity)));
    const minX = -maxX;
    const minY = Math.min(...polygons.map(p => p.points.reduce((min, p) => Math.min(min, p.z), Infinity)));
    const maxY = Math.max(...polygons.map(p => p.points.reduce((max, p) => Math.max(max, p.z), -Infinity)));

    console.log({ minX, maxX, minY, maxY });

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    const scaleX = canvasWidth / (maxX - minX);
    const scaleY = canvasHeight / (maxY - minY);
    const scale = Math.min(scaleX, scaleY) * 0.8;
    console.log({ scale })
    const translateX = canvasWidth / 2 - (maxX + minX) / 2 * scale;
    const translateY = canvasHeight / 2 - (maxY + minY) / 2 * scale;

    const transform = (p: Point) => {
      return newXZPoint(
        p.x * scale + translateX,
        p.z * scale + translateY,
      )
    }

    console.log(transform(newXZPoint(11, 8)));

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    const upperLeftCorner = transform(newXZPoint(minX, minY));
    const lowerRightCorner = transform(newXZPoint(maxX, maxY));

    const bgGradient = ctx.createLinearGradient(upperLeftCorner.x, 0, lowerRightCorner.x, 0);
    bgGradient.addColorStop(0, 'rgba(130, 147, 212, 1)')
    bgGradient.addColorStop(1, 'rgba(39, 72, 198, 1)');
    ctx.fillStyle = bgGradient;
    // Draw the background rectangle
    ctx.fillRect(
      transform(newXZPoint(minX, minY)).x,
      transform(newXZPoint(minX, minY)).z,
      transform(newXZPoint(maxX, maxY)).x - transform(newXZPoint(minX, minY)).x,
      transform(newXZPoint(maxX, maxY)).z - transform(newXZPoint(minX, minY)).z,
    );

    const fgGradient = ctx.createLinearGradient(upperLeftCorner.x, upperLeftCorner.z, lowerRightCorner.x, lowerRightCorner.z);
    fgGradient.addColorStop(0, 'rgba(253, 203, 128, 1)');
    fgGradient.addColorStop(0.5, 'rgba(255, 166, 0, 1)')
    fgGradient.addColorStop(1, 'rgba(183, 119, 0, 1)')
    ctx.fillStyle = fgGradient;

    for (const polygon of polygons) {
      const points = polygon.points.map(transform);
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].z);
      for (const point of points.slice(1)) {
        ctx.lineTo(point.x, point.z);
      }
      ctx.closePath();
      ctx.fill();
    }

    for (const polygon of polygons) {
      const points = polygon.points.map(p => {
        const transformed = transform(p);
        return newXZPoint(
          canvasWidth - transformed.x,
          transformed.z,
        )
      });
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].z);
      for (const point of points.slice(1)) {
        ctx.lineTo(point.x, point.z);
      }
      ctx.closePath();
      ctx.fill();
    }
  }
}