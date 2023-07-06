export type AppStackParamList = {
  EditProfile: EditProfileInterface;
  UpdateProfile: EditProfileInterface;
  Introduction: undefined;
  SinglePaperPlaneDetails: undefined;
  Logout: undefined;
  DebugScreen: undefined;
  PaperPlane: undefined;
  FollowersScreen: undefined;
  FriendsScreen: undefined;
  UsersProfileScreen: undefined;
  SettingsScreen: undefined;
  CommentsScreen: undefined;
  ReplyToPaperPlaneScreen: undefined;
  ReplyScreen: undefined;
  CreateRoom: undefined;
  ChatRoomNavigator: ChatRoomTabNavigatorParamList;
  ChatRoom: undefined;
  TakePaperPlaneScreen: undefined;
  Search: undefined;
  DirectChatRoomScreen: undefined;
  NewsScreen: undefined;
  Invite: undefined;
  PaperPlaneDetailsScreen: undefined;
  ExplainerSequenceScreen: undefined;
  TestScreen: undefined;
  SendOutPaperPlaneScreen: undefined;
};

export type PaperPlaneBottomTabNavigatorParamList = {
  DirectRoomsScreen: undefined;
  DiscoverScreen: undefined;
  Rooms: undefined;
  MyProfileScreen: undefined;
};

export type ChatRoomTabNavigatorParamList = {
  ReceivePaperPlaneScreen: undefined;
  Rooms: undefined;
};

export type AuthorizationStackParamList = {
  Login: undefined;
  EnterNumberScreen: undefined;
  EnterOTPScreen: undefined;
  LoginOtherOptions: undefined;
};

interface EditProfileInterface {
  returnRoute: string;
}
