import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface InspirationInterface {
  id: number;
  text: string;
}

interface InspirationsState {
  inspirations: InspirationInterface[];
}

export default createSlice({
  name: 'inspirations',
  initialState: {
    inspirations: [],
  },
  reducers: {
    setInspirations: (
      state: InspirationsState,
      action: PayloadAction<InspirationInterface[]>,
    ) => {
      state.inspirations = action.payload;
    },
    addInspiration: (
      state: InspirationsState,
      action: PayloadAction<InspirationInterface>,
    ) => {
      state.inspirations.push(action.payload);
    },
    deleteInspiration: (
      state: InspirationsState,
      action: PayloadAction<InspirationInterface>,
    ) => {
      state.inspirations = state.inspirations.filter(function(obj) {
        return obj.id !== action.payload.id;
      });
    },
    reorderInspiration: (
      state: InspirationsState,
      action: PayloadAction<Object>,
    ) => {
      state.inspirations = mapOrder(
        state.inspirations,
        action.payload.order,
        'id',
      );
    },
  },
});

export const inspirationsProps = state => state.inspirations;

/**
 * Reorder an object array based on an index array
 * @function mapOrder
 * @param {object array} source - the array to be sorted
 * @param {array} order - an array containing the index order
 * @param {string} key - the key based on which the source array is sorted
 * @return {object array} - the sorted array
 */
function mapOrder(source, order, key) {
  const map = order.reduce((r, v, i) => ((r[v] = i), r), {});
  return source.sort((a, b) => map[a[key]] - map[b[key]]);
}

export interface InspirationsStatePropsInterface {
  inspirations: InspirationInterface[];
}

export interface InspirationsActionsPropsInterface {
  setInspirations: () => void;
}

export interface InspirationsPropsInterface
  extends InspirationsStatePropsInterface,
    InspirationsActionsPropsInterface {}
