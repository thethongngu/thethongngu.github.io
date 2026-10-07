export function percent(value: number): string {
  return `${value.toFixed(2)}%`;
}

export function billion(millions: number, digits: number): string {
  return `${(millions / 1000).toFixed(digits)} billion`;
}
