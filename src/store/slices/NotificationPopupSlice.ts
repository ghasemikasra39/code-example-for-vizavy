import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NotificationPopupDataInterface } from '../../component-library/NotificationPopup';

interface NotificationPopupState {
  current: NotificationPopupDataInterface;
  visible: boolean;
}

export default createSlice({
  name: 'notificationPopup',
  initialState: {
    current: null,
    visible: false,
  },
  reducers: {
    setCurrent: (
      state: NotificationPopupState,
      action: PayloadAction<NotificationPopupDataInterface>,
    ) => {
      state.current = action.payload;
    },
    show: (state: NotificationPopupState) => {
      state.visible = true;
    },
    hide: (state: NotificationPopupState) => {
      state.visible = false;
    },
  },
});

export const notificationPopupProps = state => ({
  notificationPopup: state.notificationPopup,
});

export interface NotificationPopupStatePropsInterface {
  notificationPopup: NotificationPopupState;
}

export interface NotificationPopupActionPropsInterface {
  setCurrent: (current: NotificationPopupDataInterface) => void;
  show: () => void;
  hide: () => void;
}

export interface NotificationPopupPropsInterface
  extends NotificationPopupStatePropsInterface,
    NotificationPopupActionPropsInterface {}
