import { PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { Box, Button, LinearProgress, List, Typography } from '@mui/material';
import { wrap } from '@reatom/core';
import { reatomComponent } from '@reatom/react';

import { AnalysesFilters } from '#/features/analyses/components/AnalysesFilters';
import { AnalysisRow } from '#/features/analyses/components/AnalysisRow';
import {
  fetchAnalyses,
  openAnalysisDialog,
  requestDeleteAnalysis,
} from '#/features/analyses/models';
import { analysesListAtom, filteredAnalysesAtom } from '#/features/analyses/models/analyses';
import { parcelsListAtom } from '#/features/parcels/models';
import { cn } from '#/shared/lib/bem';

import { selectAnalysis, selectedAnalysisIdAtom } from '../../models';

import './AnalysesPanel.scss';

const cnAnalysesPanel = cn('AnalysesPanel');

export const AnalysesPanel = reatomComponent(() => {
  const allAnalyses = analysesListAtom();
  const analyses = filteredAnalysesAtom();
  const selectedAnalysisId = selectedAnalysisIdAtom();
  const isLoading = fetchAnalyses.status().isPending;
  const hasParcels = parcelsListAtom().length > 0;
  const hasAnalyses = allAnalyses.length > 0;

  return (
    <Box className={cnAnalysesPanel()}>
      {hasAnalyses && <AnalysesFilters />}

      <Box className={cnAnalysesPanel('Scroll')}>
        {isLoading && <LinearProgress />}

        {!hasAnalyses ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            No analyses yet.
          </Typography>
        ) : analyses.length === 0 ? (
          <Typography variant="body2" sx={{ p: 2 }}>
            No analyses found.
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
      </Box>

      <Box className={cnAnalysesPanel('Footer')}>
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
    </Box>
  );
}, 'AnalysesPanel');
