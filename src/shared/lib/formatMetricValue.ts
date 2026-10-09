// Display symbols of the unit codes used by the backend metric modules.
const unitSymbols: Record<string, string> = {
  deg: '°',
  degC: '°C',
  m2: 'm²',
  'km/km2': 'km/km²',
};

const formatAmount = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

/**
 * Format a raw metric value with a readable unit: `135.20 m`, `6.20°`, `2.58%`.
 * Ratios are shown as percentages; a missing value renders as an em dash.
 */
export const formatMetricValue = (value: number | null | undefined, unit: string): string => {
  if (value == null) {
    return '—';
  }
  if (unit === 'ratio') {
    return `${formatAmount(value * 100)}%`;
  }
  const symbol = unitSymbols[unit] ?? unit;
  if (!symbol) {
    return formatAmount(value);
  }
  const separator = symbol.startsWith('°') || symbol === '%' ? '' : ' ';
  return `${formatAmount(value)}${separator}${symbol}`;
};
