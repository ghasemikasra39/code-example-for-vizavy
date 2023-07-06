import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  PaperPlaneCommentDataInterface,
  PaperPlaneCommentInterface,
} from '../../services/api/PaperPlaneReplyManager';
interface RepliesInterface {
  data: PaperPlaneCommentDataInterface[];
  current_page: number;
  pages_count: number;
  uploadingNewReply: boolean;
  replyPreloaderStatus: boolean;
  deleting: boolean;
}

export default createSlice({
  name: 'replies',
  initialState: {
    data: [],
    current_page: 0,
    pages_count: 1,
    uploadingNewReply: false,
    replyPreloaderStatus: false,
    deleting: false
  },
  reducers: {
    setReplies: (
      state: RepliesInterface,
      actions: PayloadAction<PaperPlaneCommentInterface>,
    ) => {
      state.data = actions.payload.data;
      state.current_page = actions.payload.current_page;
      state.pages_count = actions.payload.pages_count;
    },
    setUploadingNewReplyStatus: (
      state: RepliesInterface,
      actions: PayloadAction<boolean>,
    ) => {
      state.uploadingNewReply = actions.payload;
    },
    setNewReplyPreloaderStatus: (
      state: RepliesInterface,
      actions: PayloadAction<boolean>,
    ) => {
      state.replyPreloaderStatus = actions.payload;
    },
    setDeletingStatus: (
      state: RepliesInterface,
      actions: PayloadAction<boolean>,
    ) => {
      state.deleting = actions.payload;
    },
  },
});

export const repliesProps = state => ({
  data: state.replies.data,
  replyPreloaderStatus: state.replies.replyPreloaderStatus,
  uploadingNewReply: state.replies.uploadingNewReply,
  current_page: state.replies.current_page,
  pages_count: state.replies.pages_count,
  deleting: state.replies.deleting,
});

export interface RepliesStatePropsInterface extends RepliesInterface { }

export interface RepliesActionsPropsInterface {
  setReplies: (payload: PaperPlaneCommentInterface) => void;
  setUploadingNewReplyStatus: (payload: boolean) => void;
  setNewReplyPreloaderStatus: (payload: boolean) => void;
  setDeletingStatus: (payload: boolean) => void;
}

export interface RepliesPropsInterface
  extends RepliesStatePropsInterface,
  RepliesActionsPropsInterface { }
