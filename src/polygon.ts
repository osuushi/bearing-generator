// A polygon as a list of points. By convention, this should be in

import { Point } from "./types";

// counterclockwise order.
export class Polygon {
  points: any[];
  constructor(points: Point[]) {
    this.points = points.map(p => p.clone());
  }
}