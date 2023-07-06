import { createSlice } from '@reduxjs/toolkit';

interface bottomTabBarState {
  visibility: boolean;
}

const bottomTabBar = createSlice({
  name: 'bottomTabBar',
  initialState: {
    visibility: true,
  },
  reducers: {
    setVisibility: (state, action) => {
      state.visibility = action.payload;
    },
  },
});

export const { setVisibility } = bottomTabBar.actions;

export const bottomTabBarProps = state => ({
  bottomTabBar: {
    visibility: state.bottomTabBar.visibility,
  },
});

export interface bottomTabBarStatePropsInterface {
  bottomTabBar: bottomTabBarState;
}

export interface bottomTabBarActionPropsInterface {
  setVisibility: () => void;
}

export default bottomTabBar;
