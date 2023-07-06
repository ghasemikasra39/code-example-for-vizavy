import { createSlice } from '@reduxjs/toolkit';

export const PP_UPLOAD_SUCCESSFUL = 'PP_UPLOAD_SUCCESSFUL';
export const PP_UPLOAD_FAILED = 'PP_UPLOAD_FAILED';
export const PP_UPLOAD_LOADING = 'PP_UPLOAD_LOADING';
export const CATCH_PP_FAILED = 'CATCH_PP_FAILED';

export default createSlice({
  name: 'popup',
  initialState: {
    enable: false,
    state: '',
    message: '',
  },
  reducers: {
    setPopup: (state, actions) => {
      state.enable = actions.payload.enable;
      state.state = actions.payload.state;
      state.message = actions.payload.message;
    },
  },
});

export const popupProps = state => ({
  enable: state.popup.enable,
  state: state.popup.state,
  message: state.popup.message,
});
