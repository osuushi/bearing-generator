import { Polygon } from "./polygon";
import { Strip } from "./strip";
import { Triangle } from "./types";

// Revolve a polygon around the Z axis. The Y coordinate is ignored, so the
// polygon is projected onto the XZ plane.
export function revolve(polygon: Polygon): Triangle[] {
  // We produce the revolution by creating a strip for each pair of points in
  // the polygon. We ignore the Y axis, since we're rotating around the Z axis.
  let strips: Strip[] = [];
  for (let i = 0; i < polygon.points.length; i++) {
    const a = polygon.points[i];
    const b = polygon.points[(i + 1) % polygon.points.length];
    strips.push(new Strip({
      innerDiameter: a.x * 2,
      innerZ: a.z,
      outerDiameter: b.x * 2,
      outerZ: b.z,
      direction: false,
    }));
  }

  let triangles: Triangle[] = [];
  // Add triangles from all strips
  for (let i = 0; i < strips.length; i++) {
    triangles = triangles.concat(strips[i].getTriangles());
  }
  return triangles;
}