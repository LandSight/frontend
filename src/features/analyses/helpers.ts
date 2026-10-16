import { restrictionKindLabels } from './constants';

export const formatNumber = (value: number): string =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

export const formatPercent = (share: number | null): string =>
  share == null ? '—' : `${Math.round(share * 100)}%`;

export const getRestrictionKindLabel = (kind: string): string => {
  const label = restrictionKindLabels[kind];
  if (label) return label;
  const text = kind.replaceAll('_', ' ');
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/** Area in m² below one hectare, in hectares above. */
export const formatArea = (squareMeters: number): string =>
  squareMeters < 10_000
    ? `${Math.round(squareMeters).toLocaleString('en-US')} m²`
    : `${(squareMeters / 10_000).toFixed(2)} ha`;

/** Like `formatPercent`, but a sliver that rounds to 0% is shown as "<1%". */
export const formatShare = (share: number): string =>
  share > 0 && share < 0.005 ? '<1%' : formatPercent(share);
