export const PLANS: Record<
  string,
  { label: string; days: number; priceBDT: number; priceUSD: number }
> = {
  weekly: { label: 'Weekly', days: 7, priceBDT: 199, priceUSD: 2.99 },
  monthly: { label: 'Monthly', days: 30, priceBDT: 499, priceUSD: 6.99 },
  annual: { label: 'Annual', days: 365, priceBDT: 2999, priceUSD: 39.99 },
};

export function getPlanDurationDays(planId: string): number {
  return PLANS[planId]?.days ?? 30;
}

export function getPlanPrice(planId: string, currency: string): number {
  const plan = PLANS[planId] ?? PLANS.monthly;
  return currency === 'USD' ? plan.priceUSD : plan.priceBDT;
}

export function effectiveExpiry(
  current: Date | null | undefined,
  durationDays: number
): Date {
  const base = current && current.getTime() > Date.now() ? current : new Date();
  return new Date(base.getTime() + durationDays * 24 * 60 * 60 * 1000);
}