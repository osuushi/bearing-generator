export class Point {
  x: number;
  y: number;
  z: number;
  constructor({ x, y, z }: { x: number, y: number, z: number }) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  clone(): Point {
    return new Point({ x: this.x, y: this.y, z: this.z });
  }
}

export class Triangle {
  a: Point;
  b: Point;
  c: Point;

  constructor({ a, b, c }: { a: Point, b: Point, c: Point }) {
    this.a = a;
    this.b = b;
    this.c = c;
  }

  computeNormal(): Point {
    const ab = new Point({ x: this.b.x - this.a.x, y: this.b.y - this.a.y, z: this.b.z - this.a.z });
    const ac = new Point({ x: this.c.x - this.a.x, y: this.c.y - this.a.y, z: this.c.z - this.a.z });
    const normal = new Point({
      x: ab.y * ac.z - ab.z * ac.y,
      y: ab.z * ac.x - ab.x * ac.z,
      z: ab.x * ac.y - ab.y * ac.x
    });
    // Normalize
    const magnitude = Math.sqrt(normal.x * normal.x + normal.y * normal.y + normal.z * normal.z);
    normal.x /= magnitude;
    normal.y /= magnitude;
    normal.z /= magnitude;
    return normal;
  }

  flip(): Triangle {
    return new Triangle({ a: this.a.clone(), b: this.c.clone(), c: this.b.clone() });
  }
}

export function newPoint3D(x: number, y: number, z: number): Point {
  return new Point({ x, y, z });
}

// One type of 2D point is one that lies on the XZ plane
export function newXZPoint(x: number, z: number): Point {
  return new Point({ x, y: 0, z });
}