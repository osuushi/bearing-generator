import { Triangle } from "./types";

export interface Bearing {
  validate(): unknown;
  fileName: string;
  getTriangles(): Triangle[];
  drawPreview(canvas: HTMLCanvasElement): void;
}
