export interface PricingTier {
  id: string;
  label: string;
  minGb: number;
  maxGb: number;
  pricePerGb: number;
}

/** 1 TB is treated as 1,000 GB. Above MAX_SELF_SERVE_GB = Contact Sales. */
export const MAX_SELF_SERVE_GB = 1000;

export const PRICING_TIERS: readonly PricingTier[] = [
  { id: "t1", label: "1–10 GB", minGb: 1, maxGb: 10, pricePerGb: 0.9 },
  { id: "t2", label: "11–50 GB", minGb: 11, maxGb: 50, pricePerGb: 0.87 },
  { id: "t3", label: "51–100 GB", minGb: 51, maxGb: 100, pricePerGb: 0.85 },
  { id: "t4", label: "101–200 GB", minGb: 101, maxGb: 200, pricePerGb: 0.8 },
  { id: "t5", label: "201–500 GB", minGb: 201, maxGb: 500, pricePerGb: 0.75 },
  { id: "t6", label: "501–1,000 GB", minGb: 501, maxGb: 1000, pricePerGb: 0.7 },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

export function getTier(gb: number): PricingTier | null {
  if (!Number.isFinite(gb) || gb < 1 || gb > MAX_SELF_SERVE_GB) return null;
  return PRICING_TIERS.find((t) => gb >= t.minGb && gb <= t.maxGb) ?? null;
}

export function isContactSales(gb: number): boolean {
  return Number.isFinite(gb) && gb > MAX_SELF_SERVE_GB;
}

export function calcSubtotal(gb: number): number | null {
  const tier = getTier(gb);
  return tier ? round2(gb * tier.pricePerGb) : null;
}

export interface NextTierSuggestion {
  addGb: number;
  nextGb: number;
  nextTier: PricingTier;
  nextTotal: number;
}

export function getNextTierSuggestion(gb: number): NextTierSuggestion | null {
  const tier = getTier(gb);
  if (!tier) return null;
  const idx = PRICING_TIERS.indexOf(tier);
  const nextTier = PRICING_TIERS[idx + 1];
  if (!nextTier) return null;
  const nextGb = nextTier.minGb;
  return { addGb: nextGb - gb, nextGb, nextTier, nextTotal: round2(nextGb * nextTier.pricePerGb) };
}

export const formatUsd = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
