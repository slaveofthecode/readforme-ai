import { describe, test, expect } from "bun:test";
import { formatFileSize } from "./format";

describe("formatFileSize", () => {
  test("formats 0 bytes", () => {
    expect(formatFileSize(0)).toBe("0 B");
  });

  test("formats bytes", () => {
    expect(formatFileSize(500)).toBe("500 B");
  });

  test("formats kilobytes", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(10240)).toBe("10 KB");
  });

  test("formats megabytes", () => {
    expect(formatFileSize(1048576)).toBe("1.0 MB");
    expect(formatFileSize(2621440)).toBe("2.5 MB");
    expect(formatFileSize(10485760)).toBe("10 MB");
  });

  test("formats gigabytes", () => {
    expect(formatFileSize(1073741824)).toBe("1.0 GB");
    expect(formatFileSize(5368709120)).toBe("5.0 GB");
  });

  test("formats fractional values below 10 with one decimal", () => {
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(2048)).toBe("2.0 KB");
  });

  test("formats values 10 and above as whole numbers", () => {
    expect(formatFileSize(10240)).toBe("10 KB");
    expect(formatFileSize(102400)).toBe("100 KB");
  });
});
