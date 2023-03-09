import { Triangle } from "./types";

export function makeAsciiSTL(triangles: Triangle[]): string {
  const header = `solid bearing`;
  const footer = `endsolid bearing`;
  const body = triangles.map(triangle => {
    const normal = triangle.computeNormal();
    const a = triangle.a;
    const b = triangle.b;
    const c = triangle.c;
    return `facet normal ${normal.x} ${normal.y} ${normal.z}
  outer loop
    vertex ${a.x} ${a.y} ${a.z}
    vertex ${b.x} ${b.y} ${b.z}
    vertex ${c.x} ${c.y} ${c.z}
  endloop
endfacet`;
  }).join("\n");
  return `${header}\n${body}\n${footer}`;
}