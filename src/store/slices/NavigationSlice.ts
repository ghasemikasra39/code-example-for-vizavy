import {createSlice} from '@reduxjs/toolkit';

export default createSlice({
  name: 'navigation',
  initialState: {
    tree: {},
    currentRoute: {},
    options: {},
    previousRoute: {}
  },
  reducers: {
    setNavigationInformation: (state, action) => {
      const {tree, currentRoute, options, previousRoute} = action.payload;
      state.tree = tree;
      state.currentRoute = currentRoute;
      state.options = options;
      state.previousRoute = previousRoute;
    },
    clearNavigationInformation: (state, action) => {
      state.tree = {};
      state.currentRoute = {};
      state.options = {};
      state.previousRoute = {};
    },
  },
});

export const NavigationProps = (state) => state.navigation;

export interface NavigationStatePropsInterface {
  tree: Object;
  currentRoute: Object;
  options: Object;
  previousRoute: Object;
}

export interface NavigationActionsPropsInterface {
  setNavigationInformation: (payload) => void;
  clearNavigationInformation: () => void
}

export interface NavigationPropsInterface
  extends NavigationStatePropsInterface,
    NavigationActionsPropsInterface {
}
