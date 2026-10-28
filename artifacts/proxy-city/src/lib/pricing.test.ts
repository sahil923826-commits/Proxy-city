import { describe, expect, it } from "vitest";
import { calcSubtotal, getNextTierSuggestion, getTier, isContactSales } from "./pricing";

describe("pricing", () => {
  it("2 GB costs $0.90/GB = $1.80", () => {
    expect(getTier(2)?.pricePerGb).toBe(0.9);
    expect(calcSubtotal(2)).toBe(1.8);
  });
  it("2 GB suggests adding 9 GB for 11 × $0.87 = $9.57", () => {
    const s = getNextTierSuggestion(2)!;
    expect(s.addGb).toBe(9);
    expect(s.nextTier.pricePerGb).toBe(0.87);
    expect(s.nextTotal).toBe(9.57);
  });
  it("tier boundaries", () => {
    expect(getTier(10)?.pricePerGb).toBe(0.9);
    expect(getTier(50)?.pricePerGb).toBe(0.87);
    expect(getTier(51)?.pricePerGb).toBe(0.85);
    expect(getTier(101)?.pricePerGb).toBe(0.8);
    expect(getTier(201)?.pricePerGb).toBe(0.75);
    expect(getTier(1000)?.pricePerGb).toBe(0.7);
  });
  it("above 1,000 GB is contact sales", () => {
    expect(getTier(1001)).toBeNull();
    expect(isContactSales(1001)).toBe(true);
    expect(isContactSales(1000)).toBe(false);
  });
  it("top tier has no next suggestion", () => {
    expect(getNextTierSuggestion(600)).toBeNull();
  });
});
