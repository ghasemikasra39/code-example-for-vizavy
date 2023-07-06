import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PaperPlaneResponseInterface } from '../../services/api/PaperPlaneManager';
interface MyProfileInterface {
  paperPlanes: PaperPlaneResponseInterface;
  failedPPs;
}

export default createSlice({
  name: 'myProfile',
  initialState: {
    paperPlanes: {
      data: [],
      current_page: 0,
      pages_count: 2,
      total_count: 0,
    },
    failedPPs: null,
  },
  reducers: {
    setPaperPlanes: (
      state: MyProfileInterface,
      action: PayloadAction<PaperPlaneResponseInterface>,
    ) => {
      try {
        state.paperPlanes = action.payload;
      } catch (error) {
        console.log('error setPaperPlanes: ', error);
      }
    },
    appendPaperPlanes: (state: MyProfileInterface, action) => {
      try {
        const { data, current_page, pages_count, total_count } = action.payload;
        const newPaperPlanes = {
          data: [...state.paperPlanes.data, ...data],
          current_page: current_page,
          pages_count: pages_count,
          total_count: total_count,
        }
        state.paperPlanes = newPaperPlanes;
      } catch (error) {
        console.log('error appendPaperPlanes: ', error);
      }
    },
    setFailedPPs: (state: MyProfileInterface, action) => {
      state.failedPPs = action.payload;
    },
    deletePaperPlane: (
      state: MyProfileInterface,
      action: PayloadAction<string>,
    ) => {
      const { data } = state.paperPlanes;
      const newPaperPlanes = [...data];
      const paperPlaneID = action.payload;
      try {
        const index = newPaperPlanes.findIndex(
          (paperPlane) => paperPlane.id === paperPlaneID,
        );
        newPaperPlanes.splice(index, 1);
        state.paperPlanes.data = newPaperPlanes;
      } catch (error) {
        console.log('error deletePaperPlane: ', error);
      }
    }
  },
});

export const MyProfileProps = (state) => state.myProfile;

export interface MyProfileStatePropsInterface {
  paperPlanes: PaperPlaneResponseInterface;
  failedPPs: PaperPlaneResponseInterface;
}

export interface MyProfileActionsPropsInterface {
  setPaperPlanes: (payload: PaperPlaneResponseInterface) => void;
  deletePaperPlane: (payload: string) => void;
  setFailedPPs: (payload) => void;
}

export interface MyProfilePropsInterface
  extends MyProfileStatePropsInterface,
  MyProfileActionsPropsInterface { }
