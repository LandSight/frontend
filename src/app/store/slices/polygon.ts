import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { AnalysisType } from '#/shared/types/analysis';
import type { Point } from '#/shared/types/geometry';

interface PolygonState {
  coordinates: Point[] | null;
  name: string;
  analysisType: AnalysisType | null;
  isDrawing: boolean;
}

const initialState: PolygonState = {
  coordinates: null,
  name: '',
  analysisType: 'infrastructure',
  isDrawing: false,
};

const polygonSlice = createSlice({
  name: 'polygon',
  initialState,
  reducers: {
    setPolygon: (state, action: PayloadAction<Point[]>) => {
      state.coordinates = action.payload;
    },
    clearPolygon: (state) => {
      state.coordinates = null;
    },
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setAnalysisType: (state, action: PayloadAction<PolygonState['analysisType']>) => {
      state.analysisType = action.payload;
    },
    setIsDrawing: (state, action: PayloadAction<boolean>) => {
      state.isDrawing = action.payload;
    },
  },
});

export const { setPolygon, clearPolygon, setName, setAnalysisType, setIsDrawing } =
  polygonSlice.actions;
export default polygonSlice.reducer;
