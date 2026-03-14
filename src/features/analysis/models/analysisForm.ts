import { atom } from '@reatom/core';

import type { AnalysisType } from '#/features/analysis/types';
import { defaultAnalysisType } from '#/features/analysis/types';

export const analysisTypeAtom = atom<AnalysisType>(defaultAnalysisType);
export const isFormOpenAtom = atom(false);
