import { createSlice } from '@reduxjs/toolkit';

interface ReferralDataInterface {
  id: number;
  invite_link: string;
}
interface ReferralInterface {
  referral_invites: ReferralDataInterface[];
  invite_link: string;
}
export default createSlice({
  name: 'referrals',
  initialState: {
    referral_invites: [],
    invite_link: null,
  },
  reducers: {
    setReferrals: (state: ReferralInterface, action) => {
      state.referral_invites = action.payload;
    },
    setInviteLink: (state: ReferralInterface, action) => {
      state.invite_link = action.payload;
    },
  },
});

export const referralProps = (state) => ({
  referral_invites: state.referral_invites,
  invite_link: state.invite_link,
});

export interface ReferralActionsPropsInterface {
  setReferrals: (payload: ReferralInterface) => void;
  setInviteLink: (payload: ReferralInterface) => void;
}

export interface ReferralPropsInterface
  extends ReferralInterface,
    ReferralActionsPropsInterface {}
