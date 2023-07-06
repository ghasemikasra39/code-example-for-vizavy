import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import collect from 'collect.js';

export interface UserProfileState {
  id: string;
  profilePictureUrl?: string;
  name: string;
  internal_id: number;
  friendships: object[];
  location: {
    country: string;
    city: string;
  };
  gender: string;
  dayOfBirth: string;
  roles: [string];
  loading: boolean;
  profilePictureBase64: string;
  bio_text: string;
  bio_color: any;
  instagram_link: string;
  prompts: Array<Object>;
  promptsDescription: Array<string>;
}

export default createSlice({
  name: 'userProfile',
  initialState: {},
  reducers: {
    setUserProfileDetails: (
      state: UserProfileState,
      action: PayloadAction<UserProfileState>,
    ) => {
      const {
        id,
        name,
        profilePicture,
        internal_id,
        friendships,
        gender,
        dayOfBirth,
        roles,
        location,
        bio_text,
        bio_color,
        instagram_link,
        prompts,
      } = action.payload;
      state.id = id;
      state.name = name;
      state.internal_id = internal_id;
      state.friendships = friendships;
      if (profilePicture) {
        state.profilePictureUrl = profilePicture;
      }
      state.gender = gender;
      state.dayOfBirth = dayOfBirth;
      state.roles = roles;
      state.location = location;
      state.bio_text = bio_text;
      state.bio_color = bio_color;
      state.instagram_link = instagram_link;
      state.prompts = prompts;
    },
    setPrompts: (state: UserProfileState, action) => {
      state.promptsDescription = action.payload;
    },
    updateRoles: (state: UserProfileState, action) => {
      state.roles = action.payload.roles;
    },
    setLoading: (state: UserProfileState, action) => {
      state.loading = action.payload;
    },
    updateProfileImage: (state: UserProfileState, action) => {
      state.profilePictureBase64 = action.payload;
    },
    updateFriendships: (state: UserProfileState, action) => {
      state.friendships = action.payload;
    },
    deleteFriendship: (state: UserProfileState, action) => {
      const { id, type } = action.payload;
      let deleteIndex;
      if (!type) {
        deleteIndex = state.friendships.findIndex(
          (element) => element.id === id,
        );
      } else {
        deleteIndex = state.friendships.findIndex(
          (element) => element.user.internal_id === id,
        );
      }

      if (deleteIndex < 0) return;
      const collection = collect(state.friendships);
      collection.splice(deleteIndex, 1);
      state.friendships = [...collection.all()];
    }
  },
});

export const userProfileProps = (state) => ({
  userProfile: {
    id: state.userProfile.id,
    name: state.userProfile.name,
    profilePictureUrl: state.userProfile.profilePicture,
    internal_id: state.userProfile.internal_id,
    followers: state.userProfile.followers,
    following: state.userProfile.following,
    roles: state.userProfile.roles,
    loading: state.userProfile.loading,
    profilePictureBase64: state.userProfile.profilePictureBase64,
    friendships: state.userProfile.friendships,
    prompts: state.userProfile.prompts,
    promptsDescription: state.userProfile.promptsDescription,
  },
});

export interface UserProfileStatePropsInterface {
  userProfile: UserProfileState;
}

export interface UserProfileActionsPropsInterface {
  setUserProfilePictureUrl: () => void;
  setUserName: () => void;
  setUserProfile: () => void;
  setPrompts: () => void;
}

export interface UserProfilePropsInterface
  extends UserProfileStatePropsInterface,
  UserProfileActionsPropsInterface {
  // navigation: NavigationStackProp;
}
