import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppMetricsState {
  counters: Counter[];
  keyValue: KeyValue[];
}

interface Counter {
  key: string;
  count: number;
}

interface KeyValue {
  key: string;
  value: string;
}

export default createSlice({
  name: 'appMetrics',
  initialState: {
    counters: [],
    keyValue: [],
  },
  reducers: {
    increment: (state: AppMetricsState, action: PayloadAction<string>) => {
      const match = state.counters.filter(counter => {
        return counter.key === action.payload;
      });
      if (match.length === 0) {
        state.counters.push({
          key: action.payload,
          count: 1,
        });
      } else {
        match[0].count += 1;
      }
    },
    keyValue: (state: AppMetricsState, action: PayloadAction<KeyValue>) => {
      state.keyValue.push({
        key: action.payload.key,
        value: action.payload.value,
      });
    },
  },
});
