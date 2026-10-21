import { describe, expect, it } from "vitest";
import { calcularZonaGraham } from "../../src/services/trackerService";

describe("valuation used by the frontend", () => {
  it("applies the default 30 percent safety margin", () => {
    const result = calcularZonaGraham({ lpa: 4, vpa: 20, g: 5, yieldAAA: 4.4 });
    expect(result.fair).toBeCloseTo((Math.sqrt(1800) + 74) / 2);
    expect(result.zona).toBeCloseTo(result.fair * 0.7);
  });

  it("returns zero for invalid fundamentals", () => {
    expect(calcularZonaGraham({ lpa: 0, vpa: 0, g: 0, yieldAAA: 0 })).toEqual({
      fair: 0,
      zona: 0,
    });
  });

  it("respects an explicit zero safety margin", () => {
    const result = calcularZonaGraham({
      lpa: 4,
      vpa: 20,
      g: 5,
      yieldAAA: 4.4,
      margemSugerida: 0,
    });
    expect(result.zona).toBe(result.fair);
  });
});
