import { createSlice } from '@reduxjs/toolkit';

export default createSlice({
  name: 'netInfo',
  initialState: {
    type: '',
    isConnected: true,
    details: {},
    isInternetReachable: true,
  },
  reducers: {
    setNetInfo: (state, actions) => {
      state.type = actions.payload.type;
      state.isConnected = actions.payload.isConnected;
      state.details = actions.payload.details;
      state.isInternetReachable = actions.payload.isInternetReachable;
    },
  },
});

export const netInfoProps = state => ({
  type: state.type,
  isConnected: state.isConnected,
  details: state.details,
  isInternetReachable: state.isInternetReachable,
});
