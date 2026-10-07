import type { SpendingGroup } from '#lib/fire-calculator/data.ts';
import type { Amount, AmountMap } from '#lib/fire-calculator/form.ts';

export interface Inflation {
  totalSpend: number;
  personal: number;
  national: number;
  contributions: Record<string, number>;
}

interface RealRate {
  bankRate: number;
  usedRate: number;
  realRate: number;
}

export type Deposit =
  | { kind: 'empty' }
  | ({ kind: 'negative' } & RealRate)
  | ({ kind: 'ok'; yearlySpend: number; amount: number; interest: number; kept: number } & RealRate);

function toNumber(value: Amount | undefined): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : 0;
}

function nonNegative(value: Amount | undefined): number {
  return Math.max(0, toNumber(value));
}

export function computeInflation(groups: SpendingGroup[], spend: AmountMap, rates: AmountMap): Inflation {
  const totalSpend = groups.reduce((sum, group) => sum + nonNegative(spend[group.id]), 0);
  const contributions: Record<string, number> = {};
  let personal = 0;
  let national = 0;

  for (const group of groups) {
    const rate = toNumber(rates[group.id]);
    const share = totalSpend > 0 ? nonNegative(spend[group.id]) / totalSpend : 0;
    contributions[group.id] = share * rate;
    personal += share * rate;
    national += (group.weight / 100) * rate;
  }

  return { totalSpend, personal, national, contributions };
}

export function computeDeposit(inflation: Inflation, bankRateInput: Amount, marginInput: Amount, monthlyExpenseInput: Amount): Deposit {
  if (inflation.totalSpend <= 0) return { kind: 'empty' };

  const bankRate = toNumber(bankRateInput);
  const usedRate = inflation.personal + nonNegative(marginInput);
  const realRate = bankRate - usedRate;
  if (realRate <= 0) return { kind: 'negative', bankRate, usedRate, realRate };

  const yearlySpend = nonNegative(monthlyExpenseInput) * 12;
  const amount = yearlySpend / (realRate / 100);
  const interest = (amount * bankRate) / 100;
  return { kind: 'ok', bankRate, usedRate, realRate, yearlySpend, amount, interest, kept: interest - yearlySpend };
}
