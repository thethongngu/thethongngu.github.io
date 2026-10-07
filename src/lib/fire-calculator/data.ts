export type RateSet = 'average' | 'september';

export interface SpendingGroup {
  id: string;
  name: string;
  vietnameseName: string;
  weight: number;
  rates: Record<RateSet, number>;
  calculated?: boolean;
}

export const RATE_SETS: { id: RateSet; label: string }[] = [
  { id: 'average', label: 'Jan to Sep 2026 average' },
  { id: 'september', label: 'Sep 2026 vs Sep 2025' }
];

export const OFFICIAL_CPI: Record<RateSet, number> = { average: 4.52, september: 5.08 };

export const GROUPS: SpendingGroup[] = [
  { id: 'groceries', name: 'Groceries', vietnameseName: 'Lương thực, thực phẩm', weight: 26.47, rates: { average: 3.87, september: 3.41 }, calculated: true },
  { id: 'eatout', name: 'Eating out', vietnameseName: 'Ăn uống ngoài gia đình', weight: 9.35, rates: { average: 7.14, september: 7.4 } },
  { id: 'drinks', name: 'Drinks and tobacco', vietnameseName: 'Đồ uống và thuốc lá', weight: 1.75, rates: { average: 3.74, september: 4.33 } },
  { id: 'clothes', name: 'Clothing and shoes', vietnameseName: 'May mặc, mũ nón, giày dép', weight: 3.52, rates: { average: 2.05, september: 2.19 } },
  { id: 'housing', name: 'Housing, electricity, water, gas', vietnameseName: 'Nhà ở, điện, nước, chất đốt, VLXD', weight: 22.7, rates: { average: 6.68, september: 6.47 } },
  { id: 'household', name: 'Household goods', vietnameseName: 'Thiết bị và đồ dùng gia đình', weight: 5.14, rates: { average: 2.84, september: 3.27 } },
  { id: 'health', name: 'Medicine and health', vietnameseName: 'Thuốc và dịch vụ y tế', weight: 4.66, rates: { average: 1.12, september: 1.47 } },
  { id: 'transport', name: 'Transport and fuel', vietnameseName: 'Giao thông', weight: 9.98, rates: { average: 6.06, september: 11.67 } },
  { id: 'comm', name: 'Phone and internet', vietnameseName: 'Thông tin và truyền thông', weight: 3.74, rates: { average: 0.12, september: 0.33 } },
  { id: 'edu', name: 'Education', vietnameseName: 'Giáo dục', weight: 5.97, rates: { average: 3.35, september: 2.93 } },
  { id: 'culture', name: 'Entertainment and travel', vietnameseName: 'Văn hóa, giải trí, du lịch', weight: 3.14, rates: { average: 2.78, september: 3.42 } },
  { id: 'other', name: 'Other goods and services', vietnameseName: 'Hàng hóa và dịch vụ khác', weight: 3.58, rates: { average: 4.61, september: 5.82 } }
];
