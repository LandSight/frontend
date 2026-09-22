import { LinearProgress, List, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysisRow } from '#/features/analyses/components/AnalysisRow';
import { fetchAnalyses, requestDeleteAnalysis } from '#/features/analyses/models';
import { analysesListAtom } from '#/features/analyses/models/analyses';

import { selectAnalysis, selectedAnalysisIdAtom } from '../../models';

export const AnalysesPanel = reatomComponent(() => {
  const analyses = analysesListAtom();
  const selectedAnalysisId = selectedAnalysisIdAtom();
  const isLoading = fetchAnalyses.status().isPending;

  if (analyses.length === 0) {
    return (
      <Typography variant="body2" sx={{ p: 2 }}>
        No analyses yet.
      </Typography>
    );
  }

  return (
    <>
      {isLoading && <LinearProgress />}
      <List dense disablePadding sx={{ py: 1 }}>
        {analyses.map((analysis) => (
          <AnalysisRow
            key={analysis.id}
            analysis={analysis}
            selected={selectedAnalysisId === analysis.id}
            showParcel
            canDelete={analysis.status === 'completed' || analysis.status === 'failed'}
            onSelect={wrap(selectAnalysis)}
            onDelete={wrap(requestDeleteAnalysis)}
          />
        ))}
      </List>
    </>
  );
}, 'AnalysesPanel');
