import { atom } from '@reatom/core';

import type { AnalysisType } from '#/features/analyses/types';
import { defaultAnalysisType } from '#/features/analyses/types';

export const analysisTypeAtom = atom<AnalysisType>(defaultAnalysisType);
export const isFormOpenAtom = atom(false);
