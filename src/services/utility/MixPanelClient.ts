import { Mixpanel } from 'mixpanel-react-native';
import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {env} from '../../config';

//-----------Mixpanel Token ---------------------------
const MIXPANEL_USER_ID_TOKEN_KEY = 'MIXPANEL_USER_ID';

//-----------Mixpanel Super properties-----------------------
export const SUPER_NAME = 'Name';
export const SUPER_DATE_OF_BIRTH = 'Age';
export const SUPER_GENDER = 'Gender';
export const JOINED_VIA_INVITE_LINK = 'Joined Via Invite Link';
export const PHONE = 'Phone';
export const INVITED_BY_USER = 'Invited By User';
//---------- Mixpanle Event Constants ------------------------
export const FOLLOW_USER = 'Follow User';
export const FIRST_CLICK_RECORD_BUTTON = 'First Click On Record Button';
export const FIRST_CLICK_TAKE_PAPER_PLANE = 'First Click Take Paper Plane';
export const TAKE_PAPER_PLANE = 'Take Paper Plane';
export const TAKE_PAPER_PLANE_VIDEO_COMPLETED =
  'Take Paper Plane Video Completed';
export const FIRST_PAPER_PLANE_SENT = 'First Paper Plane Sent';
export const FIRST_PAPER_PLANE_OPENED = 'First Paper Plane Opened';
export const FIRST_PAPER_PLANE_SWIPED = 'First Paper Plane Swiped';
export const FIRST_PAPER_PLANE_RECEIVED = 'First Paper Plane Received';
export const LAST_PAPER_PLANE_SENT = 'Last Paper Plane Sent';
export const LAST_PAPER_PLANE_OPENED = 'Last Paper Plane Opened';
export const LAST_PAPER_PLANE_RECEIVED = 'Last Paper Plane Received';
export const LIFETIME_PAPER_PLANES_SENT = 'Lifetime Paper Plane Sent';
export const LIFETIME_PAPER_PLANES_OPENED = 'Lifetime Paper Plane Opened';
export const LIFETIME_PAPER_PLANES_RECEIVED = 'Lifetime Paper Planes Received';
export const SELECT_PAPER_PLANE_SENT = 'Select Paper Plane Sent';
export const LOGIN_SUCCESS = 'Login success';
export const LOGIN_FAILED = 'Login failed';
export const OPEN_SELECT_INSPIRATION = 'Open Select Inspiration';
export const APP_OPENED = 'App opened';
export const CONFIRM_PROFILE = 'Confirm Profile';
export const SIGN_UP = 'Sign Up';
export const COMMENT_PAPER_PLANE = 'Comment Paper Plane';
export const TAP_TO_CATCH_PAPER_PLANE = 'Tap to catch Paper Plane';
export const OPEN_PAPER_PLANE = 'Open Paper Plane';
export const UPVOTE_PAPER_PLANE = 'Upvote Paper Plane';
export const REJECT_PAPER_PLANE = 'Reject Paper Plane';
export const COMPLETE_REGISTRATION = 'Complete Registration';
export const SEND_PAPER_PLANE = 'Send Paper Plane';
export const REGISTRATION_DATE = 'Registration Date';
export const REGISTRATION_METHOD = 'Registration Method';
export const ENABLE_MICROPHONE = 'Enable Microphone';
export const ENABLE_CAMERA = 'Enable Camera';
export const ENABLE_LOCATION = 'Enable Location';
export const ENABLE_PUSH_NOTIFICATIONS = 'Enable Push Notifications';
export const REPLY_PAPER_PLANE = 'Reply Paper Plane';
export const SEARCH_FOR_USER_OR_LOCATIONS = 'Search for user or locations';
export const SHARE_FB_MESSENGER = 'Share_Facebook_Messenger';
export const SHARE_WHATSAPP = 'Share_Whatsapp';
export const SHARE_SMS = 'Share_SmS';
export const SHARE_MORE = 'Share_More';
export const SHARE_Copied_LINK = 'Share_Copied_Link';
export const SHARE_LINK_ROOM = 'Share_Link_Room';
export const JOIN_ROOM = 'Join_Room';
export const MESSAGE_SENT = 'Message_Sent';
export const CREATE_ROOM = 'Create_Room';
export const SIGN_UP_VIA_ROOM_INVITE = 'Sign_Up_Via_Room_Invite';
export const SIGN_UP_ADD_NAME = 'Sign_Up_Add_Name';
export const SIGN_UP_ADD_IMAGE = 'Sign_Up_Add_Image';
export const SIGN_UP_ADD_AGE_GENDER = 'Sign_Up_Add_Age_Gender';
export const SIGN_UP_ENABLE_PUSH = 'SIGN_UP_ENABLE_PUSH';
export const SIGN_UP_CONTINUE_ENABLED_PERMISSIONS =
  'Sign_Up_Continued_Enabled_Permissions';
export const SIGN_UP_SKIP_PERMISSION = 'Sign_Up_Skip_Permission';
export const SIGN_UP_OPEN_SYSTEM_PERMISSIONS =
  'Sign_Up_Open_System_Permissions';
export const SIGN_UP_I_PROMIS = 'Sign_Up_I_Promise';
export const WELCOME_ROOM = 'Welcome_Room';
export const CREATE_PRIVATE_ROOM = 'Create_Private_Room';
export const CREATE_PUBLIC_ROOM = 'Create_Public_Room';
export const VISIT_THIS_WEEK = 'Visit_ThisWeek';
export const BLOCK_USER_FROM_BLACKLISTED_COUNTRY =
  'Block_User_From_Blacklisted_Country';
export const REJECT_LOGIN = 'Reject_Login';
export const MUTE_ROOM = 'Mute_Room';
export const UNMUTE_ROOM = 'Unmute_Room';
export const SIGN_UP_WITH_PHONE_NUMBER = 'Sign_Up_With_Phone_Number';
export const ENTER_PHONE_NUMBER = 'Enter_Phone_Number';
export const LOGIN_ENTER_NUMBER_FAILED = 'Login_Enter_Number_Failed';
export const OTP_ENTER_CODE = 'OTP_Enter_Code';
export const OTP_ENTER_CODE_FAILED = 'OTP_Enter_Code_Failed';
export const SEND_INVITE = 'Send_Invite';
export const CLICK_INVITE = 'Click_Invite';
export const WELCOME_REFERRAL_SCREEN = 'Welcome_Referral_Screen';
export const DIRECT_MESSAGE_SENT = 'Direct_Message_Sent';
export const DIRECT_CHAT_ACCEPTED = 'Direct_Chat_Accepted';
export const DIRECT_CHAT_REJECTED = 'Direct_Chat_Rejected';
export const DIRECT_CHAT_PROPOSED = 'Direct_Chat_Proposed';

class MixPanelClient extends React.Component{
  constructor(props) {
    super(props)
    if (process.env.JEST_WORKER_ID == undefined) {
      this.configMixpanel();
      // Mixpanel.default.sharedInstanceWithToken(this.getProjectToken(), false, true);
    }
  }

  configMixpanel = async () => {
    this.mixpanel = await Mixpanel.init(this.getProjectToken());
  }

  /**
   * Tries to load user data from stored values
   */
  autoIdentifyAsync = async () => {
    const userId = await AsyncStorage.getItem(MIXPANEL_USER_ID_TOKEN_KEY);
    if (userId) {
      this.identify(userId, false);
    }
  };

  reset = () => {
    this.mixpanel.reset();
  }

  /**
   * Sets the user's id which will be passed to MixPanel
   * Should be called before tracking
   */
  identify = (userId: string, storeId: boolean = true) => {
    this.mixpanel.identify(userId);
    if (storeId) {
      AsyncStorage.setItem(MIXPANEL_USER_ID_TOKEN_KEY, userId);
    }
  };

  /**
   * Tracks an event
   * The events payload may contain arbitrary data which will be tracked
   */
  trackEvent = (eventName: string, eventProperties?: object) => {
    this.mixpanel.track(eventName, eventProperties || {});
  }

  /**
   * Registers super properties which will be submitted with every request until changed.
   * Registering a super property will NOT emit an event tracking, so the property will only be submitted on the next actual event tracking event.
   */
  registerSuperProperty = (key: string, value: any) => {
    this.mixpanel.registerSuperProperties({[key]: value});
  }


  /**
   * Tracks user information, should get the users details (like user id, email address, auth provider) and profile information (like display name, profile picture, etc)
   */
  trackUserInformation = (userProperties: object) => {
    this.mixpanel.getPeople().set(userProperties);
  }

  /**
   * Tracks user information, should get the users details (like user id, email address, auth provider) and profile information (like display name, profile picture, etc)
   */
  trackUserInformationOnce = (userProperties: object) => {
    this.mixpanel.getPeople().set(userProperties);
  }

  getProjectToken = () => env.MIXPANEL_TOKEN;
}

export default new MixPanelClient();
