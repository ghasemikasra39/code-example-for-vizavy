import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaperPlaneInterface } from '../../services/api/PaperPlaneManager';

interface PaperPlanesInterface {
  paperPlanes: PaperPlaneInterface[];
  focusIndex: number;
}

export default createSlice({
  name: 'paperPlanes',
  initialState: {
    paperPlanes: [],
    focusIndex: 0,
  },
  reducers: {
    set: (
      state: PaperPlanesInterface,
      action: PayloadAction<PaperPlaneInterface[]>,
    ) => {
      try {
        const { paperPlanes, focusIndex } = state;
        const newPaperPlanes = [...paperPlanes];
        const lastUnseenPaperPlanes = newPaperPlanes.slice(focusIndex + 1);
        state.paperPlanes = [...lastUnseenPaperPlanes];
        state.focusIndex = 0;
      } catch (error) {
        console.log('error: ', error);
      }
    },
    prepend: (state: PaperPlanesInterface, action) => {
      const paperPlanes = action.payload;
      state.paperPlanes = [...state.paperPlanes, ...paperPlanes];
    },
    setFocusIndex: (state: PaperPlanesInterface, action) => {
      state.focusIndex = action.payload;
    },
    reset: (state: PaperPlanesInterface) => {
      const { paperPlanes, focusIndex } = state;
      try {
        const lastPaperPlaneSeen = paperPlanes[focusIndex];
        if (lastPaperPlaneSeen) {
          state.paperPlanes = [lastPaperPlaneSeen];
          state.focusIndex = 0;
        }
      } catch (error) {
        console.log('error reset: ', error);
      }
    },
  },
});

export const paperPlanesProps = (state) => ({
  paperPlanes: state.paperPlanes,
  focusIndex: state.focusIndex,
});

export interface PaperPlaneStatePropsInterface {
  paperPlanes: PaperPlaneInterface[];
}

export interface PaperPlaneActionsPropsInterface {
  setPaperPlanes: () => void;
  setFocusIndex: () => void;
}

export interface PaperPlanePropsInterface
  extends PaperPlaneStatePropsInterface,
  PaperPlaneActionsPropsInterface { }
