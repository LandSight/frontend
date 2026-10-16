import { LOSS_SEVERE_SHARE } from './constants';

export type LossSeverity = 'moderate' | 'severe';

export const formatPoints = (value: number): string => value.toFixed(2);

export const formatPercent = (share: number): string => `${Math.round(share * 100)}%`;

/** Like `formatPercent`, but a sliver that rounds to 0% is shown as "<1%". */
export const formatShare = (share: number): string =>
  share > 0 && share < 0.005 ? '<1%' : formatPercent(share);

/** Share of `value` in `max` as a percentage clamped to [0, 100]. */
export const toPercent = (value: number, max: number): number =>
  max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

export const capitalize = (value: string): string => value.charAt(0).toUpperCase() + value.slice(1);

export const getLossSeverity = (lossShare: number): LossSeverity =>
  lossShare >= LOSS_SEVERE_SHARE ? 'severe' : 'moderate';
