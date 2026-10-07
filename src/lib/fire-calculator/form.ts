import { GROUPS, type RateSet } from '#lib/fire-calculator/data.ts';

export type Amount = number | null;
export type AmountMap = Record<string, Amount>;

export interface CalculatorForm {
  rateSet: RateSet;
  spend: AmountMap;
  rates: Record<RateSet, AmountMap>;
  bankRate: Amount;
  margin: Amount;
  monthlyExpense: Amount;
}

const STORAGE_KEY = 'fire-calculator-v1';
const NATIONAL_BASKET_MONTHLY_TOTAL = 50;

function roundTo3Decimals(value: number): number {
  return Math.round(value * 1000) / 1000;
}

export function nationalSpend(): AmountMap {
  return Object.fromEntries(
    GROUPS.map(group => [group.id, roundTo3Decimals((group.weight / 100) * NATIONAL_BASKET_MONTHLY_TOTAL)])
  );
}

function ratesFor(rateSet: RateSet): AmountMap {
  return Object.fromEntries(GROUPS.map(group => [group.id, group.rates[rateSet]]));
}

export function officialRates(): Record<RateSet, AmountMap> {
  return { average: ratesFor('average'), september: ratesFor('september') };
}

export function defaultForm(): CalculatorForm {
  return {
    rateSet: 'average',
    spend: nationalSpend(),
    rates: officialRates(),
    bankRate: 7.4,
    margin: 0,
    monthlyExpense: 50
  };
}

export function loadForm(): CalculatorForm | null {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (!saved?.spend || !saved?.rates) return null;
    return { ...defaultForm(), ...saved };
  } catch {
    return null;
  }
}

export function saveForm(form: CalculatorForm): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  } catch {
    // Storage can be blocked, for example in private browsing.
  }
}
