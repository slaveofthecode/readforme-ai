if (typeof globalThis.DOMMatrix === "undefined") {
  (globalThis as Record<string, unknown>).DOMMatrix = class DOMMatrix {
    static fromMatrix(): DOMMatrix {
      return new DOMMatrix();
    }
    static fromFloat32Array(): DOMMatrix {
      return new DOMMatrix();
    }
    static fromFloat64Array(): DOMMatrix {
      return new DOMMatrix();
    }
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;
    m11 = 1;
    m12 = 0;
    m13 = 0;
    m14 = 0;
    m21 = 0;
    m22 = 1;
    m23 = 0;
    m24 = 0;
    m31 = 0;
    m32 = 0;
    m33 = 1;
    m34 = 0;
    m41 = 0;
    m42 = 0;
    m43 = 0;
    m44 = 1;
    is2D = true;
    isIdentity = true;
    translate(): DOMMatrix {
      return new DOMMatrix();
    }
    translateSelf(): DOMMatrix {
      return this;
    }
    scale(): DOMMatrix {
      return new DOMMatrix();
    }
    scaleSelf(): DOMMatrix {
      return this;
    }
    multiply(): DOMMatrix {
      return new DOMMatrix();
    }
    multiplySelf(): DOMMatrix {
      return this;
    }
    inverse(): DOMMatrix {
      return new DOMMatrix();
    }
    invertSelf(): DOMMatrix {
      return this;
    }
    rotate(): DOMMatrix {
      return new DOMMatrix();
    }
    rotateSelf(): DOMMatrix {
      return this;
    }
    rotateAxisAngle(): DOMMatrix {
      return new DOMMatrix();
    }
    rotateAxisAngleSelf(): DOMMatrix {
      return this;
    }
    skewX(): DOMMatrix {
      return new DOMMatrix();
    }
    skewXSelf(): DOMMatrix {
      return this;
    }
    skewY(): DOMMatrix {
      return new DOMMatrix();
    }
    skewYSelf(): DOMMatrix {
      return this;
    }
    toString(): string {
      return "matrix(1, 0, 0, 1, 0, 0)";
    }
    toFloat32Array(): Float32Array {
      return new Float32Array([1, 0, 0, 1, 0, 0]);
    }
    toFloat64Array(): Float64Array {
      return new Float64Array([1, 0, 0, 1, 0, 0]);
    }
    transformPoint(): DOMPoint {
      return new DOMPoint();
    }
    setMatrixValue(): DOMMatrix {
      return this;
    }
  };
}

if (typeof globalThis.Path2D === "undefined") {
  (globalThis as Record<string, unknown>).Path2D = class Path2D {
    addPath(): void {}
    closePath(): void {}
    moveTo(): void {}
    lineTo(): void {}
    bezierCurveTo(): void {}
    quadraticCurveTo(): void {}
    arc(): void {}
    arcTo(): void {}
    ellipse(): void {}
    rect(): void {}
    roundRect(): void {}
    toString(): string {
      return "";
    }
  };
}

if (typeof globalThis.DOMPoint === "undefined") {
  (globalThis as Record<string, unknown>).DOMPoint = class DOMPoint {
    x = 0;
    y = 0;
    z = 0;
    w = 1;
  };
}
