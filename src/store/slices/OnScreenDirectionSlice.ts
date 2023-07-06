import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { OnScreenDirectionDataInterface } from '../../component-library/OnScreenDirection';

interface OnScreenDirectionState {
  current: OnScreenDirectionDataInterface;
  visible: boolean;
  tapToReceiveDirectionSeen: boolean;
  mainButtonDirectionSeen: boolean;
  answerButtonDirectionSeen: boolean;
}

export default createSlice({
  name: 'onScreenDirection',
  initialState: {
    current: null,
    visible: false,
    tapToReceiveDirectionSeen: false,
    mainButtonDirectionSeen: false,
    answerButtonDirectionSeen: false,
  },
  reducers: {
    setCurrent: (
      state: OnScreenDirectionState,
      action: PayloadAction<OnScreenDirectionDataInterface>,
    ) => {
      state.current = action.payload;
    },
    setVisible: (
      state: OnScreenDirectionState,
      action: PayloadAction<boolean>,
    ) => {
      state.visible = action.payload;
    },
    markTapToReceiveDirectionAsSeen: (state: OnScreenDirectionState) => {
      state.tapToReceiveDirectionSeen = true;
    },
    markMainButtonDirectionAsSeen: (state: OnScreenDirectionState) => {
      state.mainButtonDirectionSeen = true;
    },
    markAnswerButtonDirectionAsSeen: (state: OnScreenDirectionState) => {
      state.answerButtonDirectionSeen = true;
    },
  },
});

export const onScreenDirectionProps = state => ({
  onScreenDirection: {
    current: state.onScreenDirection.current,
    visible: state.onScreenDirection.visible,
    tapToReceiveDirectionSeen:
      state.onScreenDirection.tapToReceiveDirectionSeen,
    mainButtonDirectionSeen: state.onScreenDirection.mainButtonDirectionSeen,
    answerButtonDirectionSeen:
      state.onScreenDirection.answerButtonDirectionSeen,
  },
});

export interface OnScreenDirectionStatePropsInterface {
  onScreenDirection: OnScreenDirectionState;
}

export interface OnScreenDirectionsActionPropsInterface {
  setCurrent: (current: OnScreenDirectionDataInterface) => void;
  setVisible: (visible: boolean) => void;
  markTapToReceiveDirectionAsSeen: () => void;
  markMainButtonDirectionAsSeen: () => void;
  markAnswerButtonDirectionAsSeen: () => void;
}

export interface OnScreenDirectionPropsInterface
  extends OnScreenDirectionStatePropsInterface,
    OnScreenDirectionsActionPropsInterface {}
