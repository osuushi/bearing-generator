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

export function makeBinarySTL(triangles: Triangle[]): Uint8Array {
  // Create the output buffer
  const headerSize = 80;
  const triangleCountSize = 4;
  const triangleSize = 50;
  const outputSize = headerSize + triangleCountSize + triangles.length * triangleSize;
  const output = new Uint8Array(outputSize);

  const view = new DataView(output.buffer);
  // Write the header, which is just 80 bytes of zeros
  for (let i = 0; i < headerSize; i++) {
    output[i] = 0;
  }

  // Write the triangle count
  const triangleCount = triangles.length;
  view.setInt32(headerSize, triangleCount, true);

  // Write the triangles
  for (let i = 0; i < triangles.length; i++) {
    // Each triangle is 50 bytes, like this (from wikipedia):
    // REAL32[3] - Normal vector             - 12 bytes
    // REAL32[3] - Vertex 1                  - 12 bytes
    // REAL32[3] - Vertex 2                  - 12 bytes
    // REAL32[3] - Vertex 3                  - 12 bytes
    // UINT16    - Attribute byte count      -  2 bytes
    const triangle = triangles[i];
    const normal = triangle.computeNormal();
    const a = triangle.a;
    const b = triangle.b;
    const c = triangle.c;
    const offset = headerSize + triangleCountSize + i * triangleSize;
    const values = [
      normal.x, normal.y, normal.z,
      a.x, a.y, a.z,
      b.x, b.y, b.z,
      c.x, c.y, c.z,
    ];
    for (let j = 0; j < values.length; j++) {
      view.setFloat32(offset + j * 4, values[j], true);
    }
    // Attribute byte count is always 0, so we don't need to write it
  }

  return output;
}
