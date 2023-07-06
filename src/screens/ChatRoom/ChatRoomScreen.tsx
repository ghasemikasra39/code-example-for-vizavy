import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  View,
  Text,
  TextInput,
  Image,
  AppState,
  Alert,
  ScrollView,
} from 'react-native';
import {
  useNavigation,
  useRoute,
  useNavigationState,
} from '@react-navigation/native';
import moment from 'moment';
import Globals from '../../component-library/Globals';
import { noMore } from '../../component-library/graphics/Images';
import MembersModal from '../../modals/MembersModal';
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import InviteFriendModal from '../../modals/InviteFriendModal';
import ChatRoomManager, {
  MessageInterface,
} from '../../services/api/ChatRoomManager';
import { actionCreators } from '../../store/actions';
import SendMessageBar from '../../component-library/ChatRoom/SendMessageBar';
import MixPanelClient, {
  SHARE_LINK_ROOM,
  WELCOME_ROOM,
  MUTE_ROOM,
  UNMUTE_ROOM,
} from '../../services/utility/MixPanelClient';
import {
  mapStateToProps,
  CommentListNavigationProp,
  CommentListRouteProp,
  handleFailedMessageReUpload,
  scrollToIndex,
  clearTextInput,
  findParentId,
  getRepliesList,
  scrollToEnd,
} from './ChatroomUtils';
import { styles } from './ChatRoomStyles';
import MessageLoadingIndicator from '../../component-library/LoadingIndicator/MessageLoadingIndicator';
import InviteIcon from '../../component-library/ChatRoom/InviteIcon';
import NavigationHelperButton from '../../component-library/ChatRoom/NavigationHelperButton';
import ConfirmCancelModal from '../../modals/ConfirmCancelModal';
import Message from '../../component-library/ChatRoom/Message';
import ListHeaderSection from '../../component-library/ChatRoom/ListHeaderSection';
import PollModal from '../../modals/PollModal';
import BlockReportModal from '../../modals/BlockReportModal';
import ReportBlockManager from '../../services/api/ReportBlockManager';
import { Bugtracker } from '../../services/utility/BugTrackerService';
import OptionsBottomBar from '../../component-library/ChatRoom/OptionsBottomBar';
import { store } from '../../store';
import ReactionsModal from '../../modals/ReactionsModal';
import VibrationPattern from '../../services/utility/VibrationPattern';
import RoomExtension from '../../component-library/ChatRoom/RoomExtension';
import { SafeAreaView } from 'react-native-safe-area-context';
import MuteIcon from '../../component-library/icons/MuteIcon';
import UnmuteIcon from '../../component-library/icons/UnmuteIcon';
import HapticFeedBackWrapper from '../../component-library/HapticFeedBackWrapper';

export function UnconnectedChatRoomScreen(props) {
  const PAGE_SIZE = 31;
  const INITIAL_RENDER_SIZE = 100;
  const KeyboardAvoidingViewRef = useRef();
  const flatListRef = useRef();
  const textInput = useRef();
  const textInputScrollViewRef = useRef();
  const navigation = useNavigation<CommentListNavigationProp>();
  const route = useRoute<CommentListRouteProp>();
  const navigationState = useNavigationState((state) => state);
  const { room, today } = route.params;
  const { roomData, inactiveRooms } = props.chatRoom;
  const expiredRoom =
    today === false
      ? inactiveRooms.find((element) => element.id === room?.id)
      : null;
  const activeRoom = roomData.find((element) => element.id === room?.id);
  const currentRoom = expiredRoom ? expiredRoom : activeRoom;

  // control appearance of the scroll down button
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showInviteFriendsModal, setShowInviteFriendsModal] = useState(false);
  // if true the textInput will avoid the selected message when new line added/removed
  const [handleHeightEnable, setHandleHeightEnable] = useState(false);
  // flattened version of the messages ready to be consumed by the FlatList
  const [messages, setMessages] = useState([]);
  // the message on which the user has tapped on and want to reply to it
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [parentMessageIndex, setParentMessageIndex] = useState(null);
  const [replyIndex, setReplyIndex] = useState(null);
  // the last child of `selectedMessage` if there is any
  const [selectedMessageLastChild, setSelectedMessageLastChild] = useState(
    null,
  );
  const [repliesList, setRepliesList] = useState([]);
  const [nextReplyAbove, setNextReplyAbove] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  // 'true' if the height of the textInput has been changed after sending a message, 'false' otherwise
  const [causedBySubmit, setCausedBySubmit] = useState(false);
  const [viewability, setViewability] = useState([]);
  const onViewRef = useRef((viewableItems) => setViewability(viewableItems));
  const [textIsFocused, setTextIsFocused] = useState(false);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  // the text message value of the TextInput
  const [textInputMessage, setTextInputMessage] = useState('');
  // used as a debouncer to avoid sending duplicate messages when clicked multiple time
  const [sendMessageAllowed, setSendMessageAllowed] = useState(true);
  const [showReUploadModal, setShowReUploadModal] = useState(false);
  // used to store the failed message for latter reupload
  const [messageForReupload, setMessageForReupload] = useState(null);
  // used to track if the end of the FlatList is reached
  const [previousLastMessage, setPreviousLastMessage] = useState(null);
  const [showPollModal, setShowPollModal] = useState(false);
  const [failedScrolledIndex, setFailedScrolledIndex] = useState(false);
  const [hasPreviousMessages, setHasPreviousMessages] = useState(false);
  const [appWasLocked, setAppWasLocked] = useState(false);

  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showReportMemberModal, setShowReportMemberModal] = useState(false);
  const [showMuteModal, setShowMuteModal] = useState(false);
  const [showUnmuteModal, setShowUnmuteModal] = useState(false);
  const [removeMember, setRemoveMember] = useState(null);
  const [reportingMember, setReportingMember] = useState(false);
  const [reportSuccessTitle, setReportSuccessTitle] = useState('');
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [reactionMessage, setReactionMessage] = useState(null);
  const [showRoomExtensionModal, setShowRoomExtensionModal] = useState(false);
  const [extendingRoom, setExtendingRoom] = useState(false);
  const [extendingRoomSuccessTitle, setExtendingRoomSuccessTitle] = useState(
    '',
  );
  const [isFocused, setIsFocused] = useState(true);
  const [memberModalBlur, setMembersModalBlur] = useState(false);
  const [currentMessagePlayingSound, setCurrentMessagePlayingSound] = useState(
    null,
  );
  const [textInputScrollPosition, setTextInputScrollPosition] = useState(0);
  const [enabledTextInputEditing, setEnabledTextInputEditing] = useState(true);
  const [mutingRoom, setMutingRoom] = useState(false);
  const [unmutingRoom, setUnmutingRoom] = useState(false);
  const [muteSuccessTitle, setMuteSuccessTitle] = useState('');
  const [unmuteSuccessTitle, setUnmuteSuccessTitle] = useState('');
  const { userProfile, chatRoom } = props;

  // these referencing are used to avoid old values when used inside setTimeout
  const messagesRef = useRef(props.chatRoom.roomsMessages[currentRoom?.id]);
  messagesRef.current = messages;

  const selectedMessageLastChildRef = useRef(selectedMessageLastChild);
  selectedMessageLastChildRef.current = selectedMessageLastChild;

  const textInputScrollRef = useRef(textInputScrollPosition);
  textInputScrollRef.current = textInputScrollPosition;

  useEffect(() => {
    function isFirstEntrance() {
      // if this is the first time that the user enters this chatroom
      return !currentRoom?.is_loaded || route.params?.scrollDown;
    }

    try {
      if (!currentRoom) return;
      if (isFirstEntrance()) joinAndFetchMessages();

      AppState.addEventListener('change', onAppActive);

      return () => AppState.removeEventListener('change', onAppActive);
    } catch (e) {
      Bugtracker.captureException(e, { scope: 'useEffect' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentRoom) return;
    const { chatRoom, userProfile } = props;
    const roomsMessages = chatRoom.roomsMessages[currentRoom?.id];

    if (roomsMessages) {
      const repliesList = getRepliesList(
        roomsMessages,
        userProfile,
        INITIAL_RENDER_SIZE,
      );
      setRepliesList(repliesList);
      getViewPosition();
    }
  }, [props.chatRoom]);

  useEffect(() => {
    if (!currentRoom) return;

    function handlePollModal() {
      //Open the PollModal
      if (
        !currentRoom?.is_voted &&
        currentRoom?.votes?.length > 0 &&
        props.userProfile?.id !== currentRoom?.app_user?.id &&
        today !== false
      ) {
        tooglePollModal();
      }
    }

    function handleAdmin() {
      //Add admin to onboarding room when user enters it
      const member = {
        app_user: currentRoom?.app_user,
        is_room_muted: false,
      };
      const action = actionCreators.chatRoom.addRoomMember({
        roomId: currentRoom?.id,
        member,
      });
      store.dispatch(action);
    }

    handlePollModal();

    if (currentRoom?.is_onboarding && currentRoom?.members?.length < 2)
      handleAdmin();
  }, []);

  useEffect(() => {
    if (!currentRoom) return;
    if (!textIsFocused) return;
    handleScrollToMessages();
  }, [textIsFocused, parentMessageIndex, props.chatRoom]);

  useEffect(() => {
    const { welcomeRoomVisited } = props.appStatus;
    resetNewMessageCount();
    // tell Mixpanel when user visited the welcome room, but only the first time
    if (currentRoom?.is_onboarding && !welcomeRoomVisited) {
      MixPanelClient.trackEvent(WELCOME_ROOM);
      const action = actionCreators.appStatus.markWelcomeRoomVisited(true);
      store.dispatch(action);
    }
  }, []);

  useEffect(() => {
    addEventListener();
    return () => removeEventListener();
  }, [showMembersModal]);

  function addEventListener() {
    navigation.addListener('focus', onDidFocus);
    navigation.addListener('blur', onDidBlur);
  }

  function removeEventListener() {
    navigation.removeListener('focus', onDidFocus);
    navigation.removeListener('blur', onDidBlur);
  }

  function onDidFocus() {
    setIsFocused(true);
    if (memberModalBlur) {
      setShowMembersModal(true);
    }
  }

  function onDidBlur() {
    setIsFocused(false);
    if (showMembersModal) {
      setMembersModalBlur(true);
      setShowMembersModal(false);
    }
  }

  /**
   * Join room and fetch messages
   * @function joinAndFetchMessages
   * @param {appLocked: boolean} - indicate wheather the app was opened from a background state
   */
  async function joinAndFetchMessages(appLocked?: boolean) {
    function joinRoom() {
      ChatRoomManager.joinRoom(currentRoom, props.userProfile);
    }

    function handleAppLocked() {
      setLoadingMessages(false);
      try {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({
            offset: 0,
            animated: false,
          });
        }, 400);
      } catch (error) {
        console.log('error: ', error);
      }
    }

    function findScrollIndex(promise, roomsMessages) {
      //Get the difference between the old messages from redux and the new updated messages from redux
      const newMessagesLength = promise.length - roomsMessages.length;

      //Get the last message that I have seen so that
      const lastMessageSeen = promise[newMessagesLength - 1];
      setPreviousLastMessage(lastMessageSeen);

      const beginningRoomsMessages = roomsMessages[0];

      return promise.findIndex((e) => e.id === beginningRoomsMessages?.id);
    }

    function handleScrollToIndex(scrollIndex) {
      try {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: scrollIndex,
            animated: false,
            viewPosition: 0,
            viewOffset: 100,
          });
        }, 400);
      } catch (error) {
        console.log('error: ', error);
      }
    }

    function handleRepliesList(roomsMessages) {
      setRepliesList(
        getRepliesList(roomsMessages, props.userProfile, INITIAL_RENDER_SIZE),
      );
    }

    try {
      const roomsMessages = props.chatRoom.roomsMessages[currentRoom?.id];

      //Fetch messages
      setLoadingMessages(true);

      //Join the room if it is not an onBoarding room
      if (!currentRoom?.is_onboarding) joinRoom();

      const promise = await ChatRoomManager.fetchRoomMessages(room.id);

      if (appLocked) {
        handleAppLocked();
        return;
      }

      if (!promise) {
        setLoadingMessages(false);
        return;
      }

      if (roomsMessages === undefined) {
        setLoadingMessages(false);
        return;
      }

      handleRepliesList(roomsMessages);
      getViewPosition();

      const scrollIndex = findScrollIndex(promise, roomsMessages);
      if (scrollIndex < 0) {
        setLoadingMessages(false);
        return;
      }

      handleScrollToIndex(scrollIndex);
      setTimeout(() => {
        setLoadingMessages(false);
      }, 300);
    } catch (e) {
      Bugtracker.captureException(e, { scope: 'joinAndFetchMessages' });
    }
  }

  function onAppActive(status) {
    function handleAppActivation() {
      setAppWasLocked(true);
      joinAndFetchMessages(true);
    }

    const appState = store.getState()?.appStatus?.appState;
    if (appState?.prev === 'background' && status === 'active') {
      handleAppActivation();
      try {
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
        });
      } catch (error) {
        console.log('error: ', error);
      }
      return;
    }
    setAppWasLocked(false);
  }

  /**
   * Reset Notification count
   * @function resetNewMessageCount
   */
  function resetNewMessageCount() {
    const action = actionCreators.chatRoom.resetNewMessageCount({
      roomId: currentRoom?.id,
    });
    store.dispatch(action);
  }

  /**
   * Decide if the logged-in user is the owner of the new message
   * @function amImessageOwner
   * @param {Message Object} newMessage
   * @returns {Boolean}
   */
  function amImessageOwner(newMessage) {
    const userId = props.userProfile.id;
    if (newMessage.app_user.id === userId) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Scroll to the target message when a message is selected
   * @function handleMessageSelected
   * @param {Message Object} item - the message that is selected by the user
   */
  function handleMessageSelected(
    item: Object,
    conversationIndex: number,
    replyIndex: number,
  ) {
    if (textIsFocused) {
      textInput.current?.blur();
      return;
    }

    if (!currentRoom?.is_writable) return;
    setParentMessageIndex(conversationIndex);
    setReplyIndex(replyIndex);
    setMessageForReupload(item);

    setSelectedMessage(item);
    textInput.current?.focus();

    if (item.sent !== undefined) {
      // if the user has pressed on a failed message
      //  setShowReUploadModal(true);
      return;
    }
  }

  /**
   * Set the state of the current message playing an audio file
   * @function handleMessagePlayingSound
   * @param {Message Object} item - the message that is currently playing an audio file
   */
  function handleMessagePlayingSound(item: MessageInterface) {
    setCurrentMessagePlayingSound(item);
  }

  /**
   * Handle navigation to the user profile or my profile
   * @function goToUserProfile
   * @param {Message Object} item - the message on its avatar the user has pressed
   */
  function goToUserProfile(item) {
    const {userProfile} = props;
    if (userProfile.id === item.app_user.id) {
      navigation.push('MyProfileScreen', {
        userProfile,
      });
    } else {
      navigation.push('UsersProfileScreen', {
        paperPlane: { author: { id: item.app_user.id } },
        relatedUser: item.app_user,
      });
    }
  }

  /**
   * Handle back navigation
   * @function navigateBack
   */
  function navigateBack() {
    navigation.navigate('PaperPlane', {
      screen: 'Rooms',
    });
    // resetNewMessageCount();
  }

  /**
   * Update the text input placeholder to the target user username to which
   * the logged-in user want to reply
   * @function compilePlaceHolder
   * @returns {String} the placeholder text to be used
   */
  function compilePlaceHolder() {
    return selectedMessage
      ? '⇦ Reply to ' + selectedMessage.app_user.name
      : 'New Conversation';
  }

  /**
   * Perform side effects when the text input is focused: scroll to end if no message is selected
   * @function handleScrollToMessages
   */
  function handleScrollToMessages() {
    if (parentMessageIndex === null) {
      scrollToEnd(flatListRef);
      return;
    }
    scrollToIndex(parentMessageIndex, flatListRef);
  }

  function handleOnFocus() {
    setTextIsFocused(true);
    VibrationPattern.doHapticFeedback();
  }

  function handleOnBlur() {
    if (currentRoom?.is_writable) {
      textInput.current?.blur();
    }
    setParentMessageIndex(null);
    setReplyIndex(null);
    setSelectedMessage(null);
    setTextIsFocused(false);
  }

  /**
   * Called when the scrolling fails
   * @function onScrollToIndexFailedHandler
   * @param info
   */
  function onScrollToIndexFailedHandler(info) {
    if (failedScrolledIndex) return;
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      try {
        flatListRef.current?.scrollToIndex({
          index: info.index,
          animated: true,
        });
      } catch (error) {
        console.log('error: ', error);
      }
    });
    setFailedScrolledIndex(true);
  }

  /**
   * Handle Avoidance of the target message when new line is added/removed to/from the textInput
   * @function handleOnLayout
   * @param {onLayout Event} e
   */
  function handleOnLayout(e) {
    const newHeight = e.nativeEvent.layout.height;
    if (!newHeight || parentMessageIndex === null) return;
    setTimeout(() => scrollToIndex(parentMessageIndex, flatListRef), 100);
  }

  /**
   * Toggle the member modal
   * @function toggleMembersModal
   */
  function toggleMembersModal(close?: boolean) {
    if (close) {
      setShowMembersModal(false);
    } else {
      setShowMembersModal(!showMembersModal);
    }
  }

  /**
   * toggle invite friend modal
   * @function toggleInviteFriendsModal
   */
  function toggleInviteFriendsModal(close?: boolean) {
    if (close) {
      setShowInviteFriendsModal(false);
    } else {
      setShowInviteFriendsModal(!showInviteFriendsModal);
    }
    if (showInviteFriendsModal) {
      MixPanelClient.trackEvent(SHARE_LINK_ROOM);
    }
  }

  /**
   * Toggle the poll modal
   * @function tooglePollModal
   */
  function tooglePollModal(close?: boolean) {
    if (close) {
      setShowPollModal(false);
    } else {
      setShowPollModal(!showPollModal);
    }
  }

  /**
   * Toggle the remove member modal
   * @function toggleRemoveMemberModal
   */
  function toggleRemoveMemberModal() {
    const isAdmin = !!props.userProfile.roles.includes('ROLE_ADMIN');
    //check if user is host of room or admin
    if (currentRoom?.app_user?.id === props.userProfile.id || isAdmin) {
      setShowRemoveMemberModal(!showRemoveMemberModal);
    } else {
      setShowReportMemberModal(!showReportMemberModal);
    }
    setReportSuccessTitle('');
  }

  /**
   * Toggle the option bottom bar
   * @function toggleOptionsBottomBar
   */
  function toggleOptionsBottomBar(message?) {
    if (message) {
      setRemoveMember(message);
      VibrationPattern.doHapticFeedback();
    } else {
      setRemoveMember(null);
    }
  }

  /**
   * Toogle toggleReaction modal
   * @function toggleReactionModal
   */
  function toggleReactionModal(message?: any, close?: boolean) {
    if (close) {
      setShowReactionsModal(false);
    } else {
      setShowReactionsModal(!showReactionsModal);
    }
    if (message) {
      setReactionMessage(message);
    } else {
      setReactionMessage(null);
    }
  }

  /**
   * Toogle RoomExtension modal
   * @function toggleRoomExtensionModal
   */
  function toggleRoomExtensionModal() {
    setShowRoomExtensionModal(!showRoomExtensionModal);
  }

  /**
   * Extend the room for another 24hrs
   * @function extendRoom
   */
  async function extendRoom() {
    setExtendingRoom(true);
    const response = await ChatRoomManager.extendRoom(currentRoom?.id);
    if (response.success) {
      setExtendingRoomSuccessTitle('Room got extended 😊');
    } else {
      setExtendingRoomSuccessTitle('Failed to extend your room 😕');
    }
    setExtendingRoom(false);
    setTimeout(toggleRoomExtensionModal, 1000);
  }

  /**
   * Block user from room. Only the host is allowed to do that.
   * @function removeMemberFromRoom
   */
  async function removeMemberFromRoom() {
    //Search for the member ID of the removed member
    const member = currentRoom?.members.find(
      (element) => element.app_user.id === removeMember.app_user.id,
    );
    if (member === undefined) return;
    if (!removeMember) return;

    //Check if the host is not blocking him/herself
    // if (removeMember.app_user.id !== currentRoom.app_user.id) {
    ChatRoomManager.removeMemberFromRoom(member?.id);
    // }
    //Toogle the RemoveMember modal
    toggleRemoveMemberModal();
  }

  /**
   * Members can report each other.
   * The report will be sent to the admin panel and if the admins decide to block a member,
   * all his message will be deleted.
   * @function reportMember
   */
  async function reportMember(reasons: Array<string>) {
    setReportSuccessTitle('');
    setReportingMember(true);
    //Search for the member ID of the removed member
    const member = currentRoom?.members.find(
      (element) => element.app_user.id === removeMember.app_user.id,
    );
    if (member === undefined) {
      setReportingMember(false);
      return;
    }

    const userId = removeMember.app_user.internal_id;
    const memberId = member?.id;

    //post report to BE
    const result = await ReportBlockManager.reportUserFromChatroom(
      userId,
      memberId,
      reasons,
    );

    if (result.success) {
      setReportSuccessTitle('Report successful 👍');
    } else {
      setReportSuccessTitle('Report failed 😕');
    }

    setReportingMember(false);
    setTimeout(toggleRemoveMemberModal, 1000);
  }

  /**
   * Perform all actions, side effects of submitting a message
   * @function handleSubmitAsync
   */
  async function handleSubmitAsync(recordingUri: string) {
    const triggerAlert = (message) => {
      Alert.alert('🤖 Moderation Alert 🤖', message, [{ text: 'OK' }], {
        cancelable: true,
      });
    };

    function uuidv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
        c,
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }

    const uuid = uuidv4();

    /**
     * Perform side effects Before a message is sent
     * @function sideEffectsBeforeSend
     */
    function sideEffectsBeforeSend() {
      clearTextInput(textInput);
      setSendMessageAllowed(false);
      setCausedBySubmit(true);
      setHandleHeightEnable(false);
    }

    /**
     * Perform side effects after a message is sent
     * @function sideEffectsAfterSend
     * @param {Message Object} newMessage - the message object
     */
    function sideEffectsAfterSend(newMessage) {
      clearTextInput(textInput);
      setTextInputMessage('');
      setTimeout(() => {
        handleScrollToMessages();
      });
    }

    /**
     * compile the message when it fails, this message body is NOT used for BE
     * @function compileNewMessage
     * @return {Object} - the message object
     */
    function compileNewMessageForFailedCase(parent_message_id) {
      const { location } = props.userProfile;

      return {
        type: 'message',
        app_user: { ...props.userProfile, location },
        id: uuid,
        chat_room: currentRoom?.id,
        message: textInputMessage,
        media_url: recordingUri ? recordingUri : null,
        media_type: recordingUri ? 1 : null,
        parent_message: parent_message_id ? parent_message_id : null,
        replies: [],
        sent: false,
        created_at: moment().format(),
      };
    }

    /**
     * compile the message when it succeeds, this message body is used for BE
     * @function compileNewMessage
     * @return {Object} - the message object
     */
    function compileNewMessageForInstantSending(parent_message_id) {
      const { location } = props.userProfile;
      return {
        type: 'message',
        app_user: { ...props.userProfile, location },
        id: uuid,
        ref: uuid,
        chat_room: currentRoom?.id,
        message: textInputMessage,
        media_url: recordingUri ? recordingUri : null,
        media_type: recordingUri ? 1 : null,
        parent_message: parent_message_id ? parent_message_id : null,
        replies: [],
        flatten_reactions: [],
        total_users_reacted: 0,
        sent: true,
        created_at: moment().format(),
        // this is set to true because message should get posted instantly even if will get flagged as suggestive latter
        is_approved: true,
      };
    }

    function compileNewMessageForHttp(parent_message_id) {
      return {
        ref: uuid,
        chat_room: currentRoom?.id,
        message: textInputMessage,
        parent_message:
          parent_message_id === null ? null : { id: parent_message_id },
        sent: true,
        media_file: recordingUri ? recordingUri : null,
        media_type: recordingUri ? 1 : null,
        directChatroom: false,
      };
    }

    function addMessageToList(parent_message_id) {
      const messageForInstantSending = compileNewMessageForInstantSending(
        parent_message_id,
      );
      const navigation = store.getState().navigation;
      const action = actionCreators.chatRoom.addNewMessage({
        newMessage: messageForInstantSending,
        sentViaLoggedInUser: true,
        navigation,
      });
      store.dispatch(action);
      sideEffectsAfterSend(messageForInstantSending);
    }

    function sendMessageToBE(parent_message_id) {
      let messageObjHttp = compileNewMessageForHttp(parent_message_id);
      ChatRoomManager.sendMessage(messageObjHttp);
    }

    try {
      const parent_message_id = findParentId(selectedMessage);

      sideEffectsBeforeSend();
      if (!props.netInfo.isConnected || !props.netInfo.isInternetReachable) {
        const failedMessageObj = compileNewMessageForFailedCase(
          parent_message_id,
        );
        const navigation = store.getState().navigation;
        const action = actionCreators.chatRoom.addNewMessage({
          newMessage: failedMessageObj,
          sentViaLoggedInUser: true,
          navigation,
        });
        store.dispatch(action);
        sideEffectsAfterSend(failedMessageObj);
        return;
      }
      addMessageToList(parent_message_id);
      sendMessageToBE(parent_message_id);
    } catch (e) {
      Bugtracker.captureException(e, { scope: 'handleSubmitAsync' });
    }
  }

  /**
   * Handle re-upload process
   * @function handleConfirmation
   */
  function handleConfirmation() {
    handleFailedMessageReUpload(messageForReupload);
    setShowReUploadModal(false);
  }

  /**
   * Dismiss the re-upload modal
   * @function handleRejection
   */
  function handleRejection() {
    setShowReUploadModal(false);
    setSelectedMessage(null);
  }

  /**
   * The failed messages does not have id, the ref is used instead
   * @function keyExtractor
   * @param {Message Object} message
   * @return {String} - the unique id to be used as key
   */
  function keyExtractor(message) {
    if (message.ref === undefined || message.ref === null) {
      return message.id.toString();
    } else {
      return message.ref;
    }
  }

  /**
   * Toggle InviteFriends modal
   * @function CustomHeaderBarOnPressHandler
   */
  function CustomHeaderBarOnPressHandler() {
    props.userProfile.id === currentRoom?.app_user?.id
      ? toggleInviteFriendsModal()
      : null;
  }

  /**
   * Navigate the user to each reply that he received or scroll him to the bottom of the page
   * @function goToIndex
   */
  function goToIndex(roomsMessages) {
    if (repliesList.length) {
      const replyIndex = roomsMessages.findIndex(
        (element) => element.id === repliesList[0],
      );

      if (replyIndex < 0) return;
      scrollToIndex(replyIndex, flatListRef);
      updateRepliesList(roomsMessages);
      setFailedScrolledIndex(false);
      return;
    }
    scrollToEnd(flatListRef);
  }

  /**
   * Update the unseenRepliesList when a new reply arrives or a reply has been seen
   * @function updateUnSeenRepliesList
   * @param {Message Object} roomsMessages
   */
  function updateRepliesList(roomsMessages) {
    const conversationIndex = roomsMessages.findIndex(
      (element) => element.id === repliesList[0],
    );

    function updateRepliesList() {
      //Mark reply as seen in redux
      if (conversationIndex < 0) return;
      const action = actionCreators.chatRoom.updateRepliesList({
        room_Id: currentRoom?.id,
        conversationIndex: conversationIndex,
      });
      store.dispatch(action);
    }

    function markReplyAsSeen() {
      const newRepliesList = [...repliesList];
      const replies = roomsMessages[conversationIndex]?.replies;

      newRepliesList.shift();
      setRepliesList(newRepliesList);

      if (!replies) return;

      const lastReplyId = replies[replies.length - 1].id;
      if (lastReplyId < 0) return;

      //mark reply as seen on BE
      ChatRoomManager.markReplyAsSeen(lastReplyId);
    }

    updateRepliesList();
    markReplyAsSeen();
  }

  /**
   * Update the membersList after sending a friendrequest
   * @function updateMembersList
   * @param {user Object} - New member object after creating a friend request
   */
  function updateMembersList(user: Object) {
    const action = actionCreators.chatRoom.updateRoomMemberAppUser({
      memberAppUser: user,
      roomId: currentRoom?.id,
      inactive: today === false,
    });
    store.dispatch(action);
  }

  /**
   * Animate NavigationHelperArrow into the direction of the next reply
   * @function getNextReplyPosition
   */
  function getViewPosition(e?) {
    const roomMessages = props.chatRoom.roomsMessages[currentRoom?.id];

    function handlePreviousMessages() {
      const endViewableItems =
        viewability.viewableItems[viewability.viewableItems.length - 1];
      if (roomMessages.length > PAGE_SIZE) {
        if (endViewableItems?.index > roomMessages.length - 6) {
          setHasPreviousMessages(false);
        } else {
          setHasPreviousMessages(true);
        }
      }
    }

    function handleScrollDownButton() {
      if (e !== undefined) {
        if (e.nativeEvent.contentOffset.y > 300) {
          setShowScrollDownButton(true);
        } else {
          setShowScrollDownButton(false);
        }
      }
    }

    function handleNextReply() {
      const parentMessageIndex = roomMessages.findIndex(
        (element) => element.id === repliesList[0],
      );
      const viewableItems = viewability.viewableItems[0];

      if (parentMessageIndex < 0) return;
      if (parentMessageIndex > viewableItems?.index) {
        setNextReplyAbove(true);
      } else {
        setNextReplyAbove(false);
      }
    }

    if (!roomMessages || !viewability.viewableItems) return;

    handlePreviousMessages();
    handleScrollDownButton();
    handleNextReply();
  }

  function onEndReached(e) {
    setShowScrollDownButton(false);
  }

  const renderMembersModal = useMemo(() => {
    return (
      <MembersModal
        openModal={showMembersModal}
        toogleModal={toggleMembersModal}
        onClose={() => toggleMembersModal(true)}
        members={currentRoom?.members}
        host={currentRoom?.app_user}
        userProfile={userProfile}
        updateMembersList={updateMembersList}
      />
    );
  }, [showMembersModal, currentRoom, userProfile, updateMembersList]);

  const renderInviteFriendsModal = useMemo(() => {
    return (
      <InviteFriendModal
        openModal={showInviteFriendsModal}
        toogleModal={toggleInviteFriendsModal}
        onClose={() => toggleInviteFriendsModal(true)}
        link={currentRoom?.invite_link}
        roomMessage={currentRoom?.message}
        colors={[currentRoom?.color_1, currentRoom?.color_2]}
      />
    );
  }, [showInviteFriendsModal, currentRoom]);

  const renderOptionsBottomBar = useMemo(
    () => (
      <OptionsBottomBar
        currentRoom={currentRoom}
        selectedMessage={removeMember}
        userProfile={props.userProfile}
        toggleOptionsBottomBar={toggleOptionsBottomBar}
        onPress={toggleRemoveMemberModal}
        directChatroom={false}
      />
    ),
    [removeMember, showReportMemberModal],
  );

  const renderReactionsModal = useMemo(() => {
    return (
      <ReactionsModal
        openModal={showReactionsModal}
        toogleModal={toggleReactionModal}
        onClose={() => toggleReactionModal(null, true)}
        userProfile={userProfile}
        selectedMessage={reactionMessage}
      />
    );
  }, [showReactionsModal, userProfile, reactionMessage]);

  const renderPoll = useMemo(() => {
    return (
      <PollModal
        openModal={showPollModal}
        currentRoom={currentRoom}
        toogleModal={tooglePollModal}
        onClose={() => tooglePollModal(true)}
      />
    );
  }, [showPollModal, currentRoom]);

  const renderReuploadModal = useMemo(() => {
    return (
      <ConfirmCancelModal
        key={'ReuploadModal'}
        showConfirmCancelModal={showReUploadModal}
        confirmText={'Yes'}
        cancelText={'No, cancel'}
        onConfirm={handleConfirmation}
        toggleConfirmCancelModal={handleRejection}
      />
    );
  }, [showReUploadModal]);

  const renderRemoveMemberModal = useMemo(() => {
    return (
      <ConfirmCancelModal
        key={'RemoveMemberModal'}
        showConfirmCancelModal={showRemoveMemberModal}
        confirmText={'Yes, remove'}
        cancelText={'Cancel'}
        title={'Remove from room'}
        text={`Are you sure you want to remove ${removeMember?.app_user?.name}?`}
        toggleConfirmCancelModal={removeMemberFromRoom}
        onConfirm={toggleRemoveMemberModal}
      />
    );
  }, [
    showRemoveMemberModal,
    removeMember,
    removeMemberFromRoom,
    toggleRemoveMemberModal,
  ]);

  const renderRoomExtensionModal = useMemo(() => {
    return (
      <ConfirmCancelModal
        key={'RoomExtensionModal'}
        showConfirmCancelModal={showRoomExtensionModal}
        confirmText={'Extend'}
        cancelText={'Cancel'}
        title={'Extend Your Room'}
        text={`Do you want to add another 24hrs to your room?`}
        toggleConfirmCancelModal={toggleRoomExtensionModal}
        onConfirm={extendRoom}
        icon={
          <RoomExtension
            colors={[currentRoom?.color_1, currentRoom?.color_2]}
          />
        }
        loading={extendingRoom}
        successTitle={extendingRoomSuccessTitle}
      />
    );
  }, [
    showRoomExtensionModal,
    extendingRoom,
    currentRoom,
    extendingRoomSuccessTitle,
  ]);

  const renderBlockReportModal = useMemo(() => {
    return (
      <BlockReportModal
        showBlockReportModal={showReportMemberModal}
        onConfirm={reportMember}
        onCancel={toggleRemoveMemberModal}
        loading={reportingMember}
        loadingFinishedTitle={reportSuccessTitle}
      />
    );
  }, [showReportMemberModal, reportingMember, reportSuccessTitle]);

  const renderMuteModal = useMemo(() => {
    return (
      <ConfirmCancelModal
        showConfirmCancelModal={showMuteModal}
        confirmText={'Mute'}
        cancelText={'Cancel'}
        title={'Mute Notifications'}
        text={
          'Stop receiving new messages from this room as notifications (You’ll still receive replies to your messages).'
        }
        toggleConfirmCancelModal={() => setShowMuteModal(false)}
        onConfirm={() => muteUnmuteModalConfirmHandler(true)}
        loading={mutingRoom}
        successTitle={muteSuccessTitle}
      />
    );
  }, [showMuteModal, mutingRoom, muteSuccessTitle]);

  const renderUnmuteModal = useMemo(() => {
    return (
      <ConfirmCancelModal
        showConfirmCancelModal={showUnmuteModal}
        confirmText={'Unmute'}
        cancelText={'Cancel'}
        title={'Unmute Notifications'}
        text={'Unmute notifications for new messages from this room.'}
        toggleConfirmCancelModal={() => setShowUnmuteModal(false)}
        onConfirm={() => muteUnmuteModalConfirmHandler(false)}
        loading={unmutingRoom}
        successTitle={unmuteSuccessTitle}
      />
    );
  }, [showUnmuteModal, unmutingRoom, unmuteSuccessTitle]);

  const navigationHelperButton = useMemo(() => {
    let roomMessages = props.chatRoom.roomsMessages[currentRoom?.id];
    return currentRoom && !loadingMessages ? (
      <NavigationHelperButton
        colors={[currentRoom?.color_1, currentRoom?.color_2]}
        scrollToIndex={() => goToIndex(roomMessages)}
        replies={repliesList}
        show={
          (repliesList?.length > 0 || showScrollDownButton) && !textIsFocused
        }
        nextReplyAbove={nextReplyAbove}
      />
    ) : null;
  }, [
    showScrollDownButton,
    repliesList,
    nextReplyAbove,
    textIsFocused,
    loadingMessages,
  ]);

  const renderListEmptyComponent = useMemo(() => {
    return currentRoom?.is_onboarding ? (
      <MessageLoadingIndicator visible={true} />
    ) : null;
  }, []);

  const renderListFooterComponent = useMemo(() => {
    const previousRoute =
      navigationState?.routes[navigationState?.routes?.length - 2]?.name;
    return (
      <ListHeaderSection
        currentRoom={currentRoom}
        userProfile={props.userProfile}
        hasPreviousMessages={hasPreviousMessages && !loadingMessages}
        previousRoute={previousRoute}
        expiredRoom={today === false}
        link={currentRoom?.invite_link}
        onPress={toggleInviteFriendsModal}
        directChatroom={false}
      />
    );
  }, [currentRoom, hasPreviousMessages, props.userProfile, loadingMessages]);

  const renderListHeaderComponent = useMemo(() => {
    let roomMessages = props.chatRoom.roomsMessages[currentRoom?.id];
    if (currentRoom) {
      return !currentRoom?.is_onboarding ? (
        <View style={styles.footerContainer}>
          {roomMessages?.length < 2 ||
          !roomMessages?.length ||
          today === false ? (
            <MessageLoadingIndicator
              visible={loadingMessages || props.chatRoom.loadingRemovingMember}
            />
          ) : null}
        </View>
      ) : null;
    }
  }, [currentRoom, loadingMessages, props.chatRoom.loadingRemovingMember]);

  function renderItemSeperator({ leadingItem }) {
    return previousLastMessage?.id === leadingItem?.id &&
      !appWasLocked &&
      !loadingMessages &&
      currentRoom?.new_message_count > 0 ? (
      <View style={styles.footerContainer}>
        <Text style={styles.newMessages}>
          ----------------------- {currentRoom?.new_message_count}{' '}
          {currentRoom?.new_message_count === 1
            ? 'New Message'
            : 'New Messages'}{' '}
          -----------------------
        </Text>
      </View>
    ) : null;
  }

  /**
   * Item renderer for the FlatList
   * @function renderItem
   * @param {Message Object} item
   * @returns {React.JSX}
   */
  function renderItem({ item, index }) {
    return (
      <Message
        message={item}
        currentRoom={currentRoom}
        conversationIndex={index}
        userProfile={props.userProfile}
        goToUserProfile={(message) => goToUserProfile(message)}
        handleMessageSelected={(message, index, replyIndex) =>
          handleMessageSelected(message, index, replyIndex)
        }
        openOptions={(message) => toggleOptionsBottomBar(message)}
        keyBoardIsOpen={textIsFocused}
        loadingMessages={
          loadingMessages || props.chatRoom.loadingRemovingMember
        }
        toggleReactionModal={toggleReactionModal}
        disabled={
          currentRoom?.is_onboarding ||
          !currentRoom?.is_writable ||
          today === false
        }
        isFocused={isFocused}
        onSoundPlayingItem={handleMessagePlayingSound}
        currentPlayingItem={currentMessagePlayingSound}
      />
    );
  }

  const renderTextInput = useMemo(() => {
    //When scrolling though the textinput, it will save the current scroll position
    function updateScrollPosition(e) {
      setTextInputScrollPosition(e.nativeEvent.contentOffset.y);
    }

    //When clicking on a letter, it will scroll to the last updated scrollPosition
    function scrollToSelectedLetter() {
      if (!enabledTextInputEditing) return;
      textInputScrollViewRef.current?.scrollTo({
        x: 0,
        y: textInputScrollRef.current + 0.1,
      });
    }

    return (
      <SendMessageBar
        data-test={'button-submit'}
        sendMessage={handleSubmitAsync}
        show={textInputMessage.length > 0}
        colors={[currentRoom?.color_1, currentRoom?.color_2]}
        contentContainerStyle={{ paddingVertical: 10 }}
        expiredRoom={today === false}
        loadingMessages={
          loadingMessages ||
          props.chatRoom.loadingRemovingMember ||
          !currentRoom?.is_writable
        }>
        {!loadingMessages ? (
          <ScrollView
            ref={textInputScrollViewRef}
            scrollEventThrottle={50}
            onScrollBeginDrag={() => setEnabledTextInputEditing(false)}
            onScrollEndDrag={() => setEnabledTextInputEditing(true)}
            onScroll={updateScrollPosition}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.textInput}
                placeholder={compilePlaceHolder()}
                placeholderTextColor={Globals.color.text.grey}
                multiline={true}
                defaultValue={textInputMessage}
                onChangeText={(message) => setTextInputMessage(message)}
                returnKeyType="done"
                ref={textInput}
                onFocus={handleOnFocus}
                onBlur={handleOnBlur}
                onLayout={handleOnLayout}
                keyboardAppearance={'light'}
                scrollEnabled={false}
                onTouchEnd={scrollToSelectedLetter}
                editable={
                  (currentRoom?.is_writable && today !== false) ||
                  enabledTextInputEditing
                }
              />
            </View>
          </ScrollView>
        ) : null}
      </SendMessageBar>
    );
  }, [
    textInputMessage,
    textIsFocused,
    selectedMessage,
    loadingMessages,
    props.chatRoom.loadingRemovingMember,
    textInputScrollRef.current,
    enabledTextInputEditing,
  ]);

  const muteUnmuteHandler = (muteNotification, currentRoom, loggedInMember) => {
    function successHandler(res) {
      const { success } = res;
      if (!success) {
        resetModals();
        return;
      }
      if (muteNotification) {
        setMutingRoom(false);
        setMuteSuccessTitle('Successfully muted 😊');
        MixPanelClient.trackEvent(MUTE_ROOM);
        hideMuteModal();
      } else {
        setUnmutingRoom(false);
        setUnmuteSuccessTitle('Successfully unmuted 😊');
        MixPanelClient.trackEvent(UNMUTE_ROOM);
        hideUnmuteModal();
      }
    }

    function failureHandler() {
      if (muteNotification) {
        setMutingRoom(false);
        setMuteSuccessTitle('Failed to mute 😕');
        hideMuteModal();
      } else {
        setUnmutingRoom(false);
        setUnmuteSuccessTitle('Failed to unmute 😕');
        hideUnmuteModal();
      }
    }

    function hideMuteModal() {
      setTimeout(() => {
        setShowMuteModal(false);
        setMuteSuccessTitle('');
      }, 1000);
    }

    function hideUnmuteModal() {
      setTimeout(() => {
        setShowUnmuteModal(false);
        setUnmuteSuccessTitle('');
      }, 1000);
    }

    function resetModals() {
      setUnmutingRoom(false);
      setMutingRoom(false);
      setMuteSuccessTitle('');
      setUnmuteSuccessTitle('');
    }

    ChatRoomManager.muteUnmuteNotification(
      muteNotification,
      currentRoom,
      loggedInMember,
    ).then(successHandler, failureHandler);
  };

  const findLoggedInMemberInMemberList = (currentRoom) => {
    return currentRoom?.members.find(
      (member) => member.app_user.id == props.userProfile.id,
    );
  };

  const muteUnmuteModalConfirmHandler = (mute) => {
    const loggedInMember = findLoggedInMemberInMemberList(currentRoom);
    if (mute) {
      muteUnmuteHandler(true, currentRoom, loggedInMember);
      setMutingRoom(true);
    } else {
      muteUnmuteHandler(false, currentRoom, loggedInMember);
      setUnmutingRoom(true);
    }
  };

  const customHeaderBarIcon = useMemo(() => {
    const amITheOwner = (currentRoom) => {
      return props.userProfile.id === currentRoom?.app_user?.id;
    };

    if (currentRoom) {
      const amIRoomOwner = amITheOwner(currentRoom);
      let MuteUnmuteIcon = null;

      if (!amIRoomOwner) {
        const loggedInMember = findLoggedInMemberInMemberList(currentRoom);
        const shouldDisplayMuteIcon =
          loggedInMember === undefined || !loggedInMember.is_room_muted;
        const MuteButton = (
          <HapticFeedBackWrapper
            onPress={() => setShowMuteModal(true)}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <MuteIcon />
          </HapticFeedBackWrapper>
        );
        const UnmuteButton = (
          <HapticFeedBackWrapper
            onPress={() => setShowUnmuteModal(true)}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <UnmuteIcon />
          </HapticFeedBackWrapper>
        );

        MuteUnmuteIcon = shouldDisplayMuteIcon ? MuteButton : UnmuteButton;
      }

      const RoomExtensionComponent = (
        <RoomExtension
          colors={[currentRoom?.color_1, currentRoom?.color_2]}
          onPress={toggleRoomExtensionModal}
          style={{ marginRight: Globals.dimension.margin.tiny }}
          currentRoom={currentRoom}
        />
      );

      const InviteIconComponent = (
        <InviteIcon
          colors={[currentRoom?.color_1, currentRoom?.color_2]}
          onPress={toggleRoomExtensionModal}
          style={{ marginRight: Globals.dimension.margin.tiny }}
          currentRoom={currentRoom}
        />
      );

      return amIRoomOwner ? (
        <View style={styles.headerRightContainer}>
          {today ? RoomExtensionComponent : null}
          {InviteIconComponent}
        </View>
      ) : (
        MuteUnmuteIcon
      );
    }
    return null;
  }, [props.userProfile, currentRoom, showInviteFriendsModal]);

  const renderCustomeHeaderBar = useMemo(() => {
    return (
      <CustomHeaderBar
        members={currentRoom?.members}
        toogleMember={toggleMembersModal}
        onDismiss={navigateBack}
        customIcon={!currentRoom?.is_onboarding ? customHeaderBarIcon : null}
        onPress={CustomHeaderBarOnPressHandler}
        loading={loadingMessages}
        directChatroom={false}
      />
    );
  }, [loadingMessages, currentRoom]);

  function renderExpiredRoom() {
    return (
      <SafeAreaView style={styles.expiredContainer}>
        <CustomHeaderBar onDismiss={navigateBack} avoidSafeArea={true} />
        <View style={styles.expiredWrapper}>
          <Text style={styles.expiredTitle}>Time’s up! </Text>
          <Text style={styles.expiredDescription}>
            Rooms automatically self-delete after 24 hours. Um… you wouldn’t
            want your conversations to be recorded in real-life, would you?
          </Text>
          <Image source={noMore} style={styles.noMore} />
        </View>
      </SafeAreaView>
    );
  }

  function renderChatScreen() {
    let roomMessages = props.chatRoom.roomsMessages[currentRoom?.id];
    return currentRoom ? (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          /* eslint-disable-next-line no-shadow */
          ref={KeyboardAvoidingViewRef}
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          data-test={'component-ChatRoomScreen'}>
          {renderCustomeHeaderBar}
          <FlatList
            ref={flatListRef}
            ListHeaderComponent={renderListHeaderComponent}
            ListFooterComponent={renderListFooterComponent}
            ListEmptyComponent={renderListEmptyComponent}
            ItemSeparatorComponent={renderItemSeperator}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            data={roomMessages ? roomMessages : []}
            initialNumToRender={INITIAL_RENDER_SIZE}
            onViewableItemsChanged={onViewRef.current}
            viewabilityConfig={viewConfigRef.current}
            contentContainerStyle={styles.flatListContentContainerStyle}
            maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
            onEndReachedThreshold={0.3}
            onScroll={getViewPosition}
            onEndReached={onEndReached}
            inverted={true}
            onScrollToIndexFailed={onScrollToIndexFailedHandler}
            maxToRenderPerBatch={(PAGE_SIZE - 1) / 2}
            windowSize={PAGE_SIZE}
            keyboardShouldPersistTaps={'handled'}
          />
          {renderTextInput}
          {navigationHelperButton}
          {renderOptionsBottomBar}
          {renderMembersModal}
          {renderInviteFriendsModal}
          {renderReactionsModal}
          {renderPoll}
          {renderReuploadModal}
          {renderRemoveMemberModal}
          {renderRoomExtensionModal}
          {renderBlockReportModal}
          {renderMuteModal}
          {renderUnmuteModal}
        </KeyboardAvoidingView>
      </SafeAreaView>
    ) : (
      renderExpiredRoom()
    );
  }

  return currentRoom !== undefined ? renderChatScreen() : renderExpiredRoom();
}

export default connect(mapStateToProps)(UnconnectedChatRoomScreen);
