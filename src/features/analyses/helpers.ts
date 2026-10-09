export const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

export const formatPercent = (share: number | null): string =>
  share == null ? '—' : `${Math.round(share * 100)}%`;
