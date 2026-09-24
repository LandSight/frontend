import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Box, Button, LinearProgress, List, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysisRow } from '#/features/analyses/components/AnalysisRow';
import {
  fetchAnalyses,
  openAnalysisDialog,
  requestDeleteAnalysis,
} from '#/features/analyses/models';
import { analysesListAtom } from '#/features/analyses/models/analyses';
import { parcelsListAtom } from '#/features/parcels/models';

import { selectAnalysis, selectedAnalysisIdAtom } from '../../models';

export const AnalysesPanel = reatomComponent(() => {
  const analyses = analysesListAtom();
  const selectedAnalysisId = selectedAnalysisIdAtom();
  const isLoading = fetchAnalyses.status().isPending;
  const hasParcels = parcelsListAtom().length > 0;

  return (
    <>
      <Box sx={{ p: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PlayArrowIcon />}
          disabled={!hasParcels}
          onClick={() => wrap(openAnalysisDialog())}
        >
          Start analysis
        </Button>
      </Box>

      {isLoading && <LinearProgress />}

      {analyses.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2 }}>
          No analyses yet.
        </Typography>
      ) : (
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
      )}
    </>
  );
}, 'AnalysesPanel');
