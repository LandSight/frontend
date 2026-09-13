import React, { useEffect } from 'react';
import { Box, Container, Paper, Skeleton, Typography } from '@mui/material';
import { useAtom } from '@reatom/react';

import { AnalysesFilters } from '#/features/analyses/components/AnalysesFilters';
import { AnalysesTable } from '#/features/analyses/components/AnalysesTable';
import {
  fetchAnalyses,
  filteredAnalysesAtom,
  hasActiveAnalysesAtom,
} from '#/features/analyses/models/analyses';
import { cn } from '#/shared/lib/bem';

import './AnalysesPage.scss';

const cnAnalysesPage = cn('AnalysesPage');
const POLL_INTERVAL_MS = 3000;

export const AnalysesPage: React.FC = () => {
  const [analyses] = useAtom(filteredAnalysesAtom);
  const [hasActiveAnalyses] = useAtom(hasActiveAnalysesAtom);
  const [isAnalysesLoaded] = useAtom(fetchAnalyses.ready);

  useEffect(() => {
    fetchAnalyses();
  }, []);

  useEffect(() => {
    if (!hasActiveAnalyses) return;
    const intervalId = setInterval(() => {
      fetchAnalyses();
    }, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [hasActiveAnalyses]);

  return (
    <Container maxWidth="xl" className={cnAnalysesPage()}>
      <Paper className={cnAnalysesPage('Filters')}>
        <AnalysesFilters />
      </Paper>

      <div className={cnAnalysesPage('TableContainer')}>
        {!isAnalysesLoaded && analyses.length === 0 ? (
          <Box className={cnAnalysesPage('Skeleton')}>
            <Skeleton variant="rectangular" height={200} />
          </Box>
        ) : analyses.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            align="center"
            className={cnAnalysesPage('Empty')}
          >
            No analyses found.
          </Typography>
        ) : (
          <AnalysesTable analyses={analyses} />
        )}
      </div>
    </Container>
  );
};
