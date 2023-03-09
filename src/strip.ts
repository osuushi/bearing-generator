import { Point, Triangle } from "./types";

export class Strip {
  innerDiameter: number;
  innerZ: number;
  outerDiameter: number;
  outerZ: number;
  direction: boolean;
  constructor({ innerDiameter, innerZ, outerDiameter, outerZ, direction }: {
    innerDiameter: number, innerZ: number, outerDiameter: number, outerZ: number, direction: boolean
  }) {
    this.innerDiameter = innerDiameter;
    this.innerZ = innerZ;
    this.outerDiameter = outerDiameter;
    this.outerZ = outerZ;
    this.direction = direction;
  }

  getTriangles(): Triangle[] {
    let circleA = standardCircle(this.innerDiameter, this.innerZ);
    let circleB = standardCircle(this.outerDiameter, this.outerZ);
    // Swap the circles if we're going the other way
    if (this.direction) {
      [circleA, circleB] = [circleB, circleA];
    }
    const triangles: Triangle[] = [];
    for (let i = 0; i < circlePointCount; i++) {
      // Create two triangles describing the rectangle between each pair of corresponding points on the circles
      const points = [
        circleA[i],
        circleA[(i + 1) % circlePointCount],
        circleB[i],
        circleB[(i + 1) % circlePointCount]
      ];
      triangles.push(new Triangle({ a: points[0], b: points[1], c: points[2] }));
      triangles.push(new Triangle({ a: points[1], b: points[3], c: points[2] }));
    }
    return triangles;
  }
}

// By making all circles the same number of points, we can simply draw triangles
// between concentric circles to get a smooth surface.
const circlePointCount = 300;

// Set up the unit circle
const unitCirclePoints: Point[] = [];
for (let i = 0; i < circlePointCount; i++) {
  const angle = i * 2 * Math.PI / circlePointCount;
  unitCirclePoints.push(new Point({
    x: Math.cos(angle),
    y: Math.sin(angle),
    z: 0
  }));
}

function standardCircle(diameter: number, z: number): Point[] {
  // Transform the unit circle to the desired diameter and z
  return unitCirclePoints.map(p => new Point({
    x: p.x * diameter / 2,
    y: p.y * diameter / 2,
    z: z
  }));
}