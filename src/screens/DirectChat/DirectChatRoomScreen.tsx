import React, { useState, useEffect, useRef, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  KeyboardAvoidingView,
  Platform,
  FlatList,
  View,
  Text,
  TextInput,
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
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import ChatRoomManager, {
  MessageInterface,
} from '../../services/api/ChatRoomManager';
import { actionCreators } from '../../store/actions';

import SendMessageBar from '../../component-library/ChatRoom/SendMessageBar';
import MixPanelClient, {
  DIRECT_CHAT_ACCEPTED,
  DIRECT_CHAT_REJECTED,
  DIRECT_MESSAGE_SENT,
} from '../../services/utility/MixPanelClient';
import {
  mapStateToProps,
  CommentListNavigationProp,
  CommentListRouteProp,
  handleFailedMessageReUpload,
  scrollToIndex,
  clearTextInput,
  findParentId,
  scrollToEnd,
} from '../ChatRoom/ChatroomUtils';
import { styles } from './DirectChatRoomStyles';
import MessageLoadingIndicator from '../../component-library/LoadingIndicator/MessageLoadingIndicator';
import NavigationHelperButton from '../../component-library/ChatRoom/NavigationHelperButton';
import ConfirmCancelModal from '../../modals/ConfirmCancelModal';
import ListHeaderSection from '../../component-library/ChatRoom/ListHeaderSection';
import { Bugtracker } from '../../services/utility/BugTrackerService';
import OptionsBottomBar from '../../component-library/ChatRoom/OptionsBottomBar';
import { store } from '../../store';
import ReactionsModal from '../../modals/ReactionsModal';
import VibrationPattern from '../../services/utility/VibrationPattern';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReportIcon from '../../component-library/graphics/Icons/ReportIcon';
import UserAvatar from '../../component-library/UserAvatar';
import DirectChatsManager from '../../services/api/DirectChatsManager';
import ReportBlockManager from '../../services/api/ReportBlockManager';
import AcceptBlockComponent from '../../component-library/ChatRoom/AcceptBlockComponent';
import DirectMessage from '../../component-library/ChatRoom/DirectMessage';

export function UnconnectedDirectChatRoomScreen(props) {
  const PAGE_SIZE = 31;
  const INITIAL_RENDER_SIZE = 100;
  const KeyboardAvoidingViewRef = useRef();
  const flatListRef = useRef();
  const textInput = useRef();
  const textInputScrollViewRef = useRef();
  const navigation = useNavigation<CommentListNavigationProp>();
  const route = useRoute<CommentListRouteProp>();
  const navigationState = useNavigationState((state) => state);
  const { room } = route.params;
  const { directChatList } = props.directChat;
  const currentRoom = directChatList.find((element) => element.id === room?.id);

  // control appearance of the scroll down button
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);
  // flattened version of the messages ready to be consumed by the FlatList
  // the message on which the user has tapped on and want to reply to it
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [parentMessageIndex, setParentMessageIndex] = useState(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [viewability, setViewability] = useState([]);
  const onViewRef = useRef((viewableItems) => setViewability(viewableItems));
  const [textIsFocused, setTextIsFocused] = useState(false);
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  // the text message value of the TextInput
  const [textInputMessage, setTextInputMessage] = useState('');
  const [showReUploadModal, setShowReUploadModal] = useState(false);
  // used to store the failed message for latter reupload
  const [messageForReupload, setMessageForReupload] = useState(null);
  // used to track if the end of the FlatList is reached
  const [previousLastMessage] = useState(null);
  const [failedScrolledIndex, setFailedScrolledIndex] = useState(false);
  const [hasPreviousMessages, setHasPreviousMessages] = useState(false);
  const [appWasLocked, setAppWasLocked] = useState(false);

  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [showReportMemberModal, setShowReportMemberModal] = useState(false);
  const [removeMember, setRemoveMember] = useState(null);
  const [showReactionsModal, setShowReactionsModal] = useState(false);
  const [reactionMessage, setReactionMessage] = useState(null);
  const [] = useState(false);
  const [isFocused] = useState(true);
  const [currentMessagePlayingSound, setCurrentMessagePlayingSound] = useState(
    null,
  );
  const [textInputScrollPosition, setTextInputScrollPosition] = useState(0);
  const [enabledTextInputEditing, setEnabledTextInputEditing] = useState(true);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [showRejectDirectChatModal, setShowRejectDirectChatModal] = useState(
    false,
  );
  const [blocking, setBlocking] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [acceptingUser, setAcceptingUser] = useState(false);
  const [acceptUserSuccessTitle, setAcceptUserSuccessTitle] = useState('');
  const [
    showAcceptBlockPermissionRequest,
    setShowAcceptBlockPermissionRequest,
  ] = useState(false);
  const { userProfile, directChat } = props;

  const textInputScrollRef = useRef(textInputScrollPosition);
  textInputScrollRef.current = textInputScrollPosition;

  useEffect(() => {
    function isFirstEntrance() {
      // if this is the first time that the user enters this chatroom
      return !currentRoom?.is_loaded || route.params?.scrollDown;
    }
    try {
      if (!currentRoom) return;
      if (isFirstEntrance()) fetchMessages();
      AppState.addEventListener('change', onAppActive);

      return () => AppState.removeEventListener('change', onAppActive);
    } catch (e) {
      Bugtracker.captureException(e, { scope: 'useEffect' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    resetNewMessageCount();
    onSetCurrentActiveRoomRedux(currentRoom);
    return () => onSetCurrentActiveRoomRedux(null);
  },[]);

  useEffect(() => {
    if (!currentRoom) return;
    if (!textIsFocused && currentRoom?.is_writable) {
      textInput.current?.clear();
      return;
    }
    handleScrollToMessages();
  }, [textIsFocused, parentMessageIndex]);

  useEffect(() => {
    const amINotCreatorOfChat = !haveICreatedTheDirect();
    const gavePermission = amINotCreatorOfChat && currentRoom?.status === 0;
    const granted = amINotCreatorOfChat && gavePermission;
    setShowAcceptBlockPermissionRequest(granted);
  }, [currentRoom]);


  /**
   * Reset Notification count
   * @function resetNewMessageCount
   */
  function resetNewMessageCount() {
    const { id, new_message_count } = currentRoom;
    if (new_message_count === 0) return;
    const action = actionCreators.directChat.resetNewMessageCount({
      roomId: id,
    });
    store.dispatch(action);
  }

  /**
   * Save in what room the user is currently in
   * @function onSetCurrentActiveRoomRedux
   */
  function onSetCurrentActiveRoomRedux(directRoom) {
    const action = actionCreators.directChat.setCurrentActiveRoom(directRoom);
    store.dispatch(action);
  }

  /**
   * Join room and fetch messages
   * @function fetchMessages
   * @param {appLocked: boolean} - indicate wheather the app was opened from a background state
   */
  async function fetchMessages(appLocked?: boolean) {
    function handleAppLocked() {
      setIsLoadingMessages(false);
      try {
        setTimeout(() => {
          handleScrollToMessages();
        }, 400);
      } catch (error) {
        console.log('error: ', error);
      }
    }

    try {
      const roomsMessages = directChat.directChatMessages[currentRoom?.id];
      setIsLoadingMessages(true);

      const promise = await DirectChatsManager.fetchDirectRoomMessages(room.id);
      setTimeout(handleScrollToMessages);
      if (appLocked) {
        handleAppLocked();
        return;
      }

      if (!promise) {
        setIsLoadingMessages(false);
        return;
      }

      if (roomsMessages === undefined) {
        setIsLoadingMessages(false);
        return;
      }
      setIsLoadingMessages(false);
      enteredDirectChat();
    } catch (e) {
      Bugtracker.captureException(e, { scope: 'joinAndFetchMessages' });
    }
  }

  function onAppActive(status) {
    function handleAppActivation() {
      setAppWasLocked(true);
      fetchMessages(true);
    }

    const appState = store.getState().appStatus.appState;
    if (appState.prev === 'background' && status === 'active') {
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
   * Mark room as entered
   * @function enteredDirectChat
   */
  function enteredDirectChat() {
    const action = actionCreators.directChat.enterChat(currentRoom?.id);
    store.dispatch(action);
  }

  /**
   * Set the current playing audio message
   * @function handleMessagePlayingSound
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
    navigation.navigate('UsersProfileScreen', {
      paperPlane: {
        author: {
          id: item?.id,
        },
      },
      relatedUser: item,
    });
  }

  /**
   * Handle back navigation
   * @function navigateBack
   */
  function navigateBack() {
    navigation.goBack();
    resetNewMessageCount();
  }

  /**
   * Perform side effects when the text input is focused: scroll to end if no message is selected
   * @function handleScrollToMessages
   */
  function handleScrollToMessages() {
    scrollToEnd(flatListRef);
  }

  function handleOnFocus() {
    setTextIsFocused(true);
    VibrationPattern.doHapticFeedback();
  }

  function handleOnBlur() {
    if (currentRoom?.is_writable) {
      textInput.current?.blur();
    }
    setSelectedMessage(null);
    setTextIsFocused(false);
  }

  /**
   * Called when the scrolling fails
   * @function onScrollToIndexFailedHandler
   * @param info
   */
  function onScrollToIndexFailedHandler() {
    if (failedScrolledIndex) return;
    const wait = new Promise((resolve) => setTimeout(resolve, 500));
    wait.then(() => {
      try {
        handleScrollToMessages();
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
   * Block user
   * @function blockUser
   */
  async function blockUser() {
    const receiver = getTheOtherMember();
    const receiver_id = receiver?.internal_id;
    const directChatId = currentRoom?.id;
    const accept = false;
    setBlocking(true);
    if (showRejectDirectChatModal) {
      DirectChatsManager.acceptBlockDirectChat(directChatId, accept).then(
        responseHanlder,
      );
    } else {
      ReportBlockManager.reportUserFromDirectChat(
        receiver_id,
        directChatId,
      ).then(responseHanlder);
    }

    function responseHanlder(res) {
      if (res.success) {
        if (showRejectDirectChatModal) {
          MixPanelClient.trackEvent(DIRECT_CHAT_REJECTED);
        }
        setSuccessTitle('Successfully blocked user 😊');
        setTimeout(clear, 1000);
        setTimeout(navigateBack, 1500);
        setTimeout(() => onBlockUserInRedux(currentRoom, false), 2100);
      } else {
        setSuccessTitle('Failed to block user 😕');
        setTimeout(clear, 1000);
      }
      setBlocking(false);
    }

    function clear() {
      setShowBlockUserModal(false);
      setShowRejectDirectChatModal(false);
      setSuccessTitle('');
    }
  }

  /**
   * Either update the room or delete the room information in redux
   * @function onBlockUserInRedux
   * @param {direct_chat} - current room object
   * @param {keepRoom} - indicate wheather to replace the room or to delete the room
   */
  function onBlockUserInRedux(direct_chat: Object, keepRoom: Boolean) {
    const action = actionCreators.directChat.setAcceptBlock({
      direct_chat,
      accepted: keepRoom,
    });
    store.dispatch(action);
  }

  /**
   * Toggle BlockUser Modal
   * @function toggleBlockUserModal
   */
  function toggleBlockUserModal() {
    if (showRejectDirectChatModal) {
      toogleRejectDirectChatModal();
    } else {
      setShowBlockUserModal(!showBlockUserModal);
    }
  }

  /**
   * Toggle Block user Modal
   * @function toogleRejectDirectChatModal
   */
  function toogleRejectDirectChatModal() {
    setShowRejectDirectChatModal(!showRejectDirectChatModal);
  }

  async function acceptDirectChat() {
    const directChatId = currentRoom?.id;
    const accept = true;
    setAcceptingUser(true);
    DirectChatsManager.acceptBlockDirectChat(directChatId, accept).then(
      responseHandler,
    );
    function responseHandler(res) {
      if (res.success) {
        const { direct_chat } = res;
        MixPanelClient.trackEvent(DIRECT_CHAT_ACCEPTED);
        DirectChatsManager.subscribeOnPusher(currentRoom);
        onBlockUserInRedux(direct_chat, true);
        setAcceptUserSuccessTitle('');
      } else {
        setAcceptUserSuccessTitle('Failed to accept user 😕');
      }
      setAcceptingUser(false);
    }
  }

  /**
   * Perform all actions, side effects of submitting a message
   * @function handleSubmitAsync
   */
  async function handleSubmitAsync(recordingUri: string) {
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
    }

    /**
     * Perform side effects after a message is sent
     * @function sideEffectsAfterSend
     * @param {Message Object} newMessage - the message object
     */
    function sideEffectsAfterSend() {
      clearTextInput(textInput);
      setTextInputMessage('');
      setTimeout(() => {
        handleScrollToMessages();
      });
      MixPanelClient.trackEvent(DIRECT_MESSAGE_SENT);
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
    function compileNewMessageForInstantSending() {
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
        parent_message: null,
        replies: [],
        flatten_reactions: [],
        total_users_reacted: 0,
        sent: true,
        created_at: moment().format(),
        // this is set to true because message should get posted instantly even if will get flagged as suggestive latter
        is_approved: true,
      };
    }

    function compileNewMessageForHttp() {
      return {
        ref: uuid,
        chat_room: currentRoom?.id,
        message: textInputMessage,
        parent_message: null,
        sent: true,
        media_file: recordingUri ? recordingUri : null,
        media_type: recordingUri ? 1 : null,
        directChatroom: true,
      };
    }

    function addMessageToList() {
      const messageForInstantSending = compileNewMessageForInstantSending();
      const navigation = store.getState().navigation;
      const action = actionCreators.directChat.addNewDirectMessage({
        newMessage: messageForInstantSending,
        sentViaLoggedInUser: true,
        navigation,
      });
      store.dispatch(action);
      sideEffectsAfterSend();
    }

    function sendMessageToBE() {
      let messageObjHttp = compileNewMessageForHttp();
      DirectChatsManager.sendMessage(messageObjHttp);
    }

    try {
      const parent_message_id = findParentId(selectedMessage);

      sideEffectsBeforeSend();
      if (!props.netInfo.isConnected || !props.netInfo.isInternetReachable) {
        const failedMessageObj = compileNewMessageForFailedCase(
          parent_message_id,
        );
        const navigation = store.getState().navigation;
        const action = actionCreators.directChat.addNewMessage({
          newMessage: failedMessageObj,
          sentViaLoggedInUser: true,
          navigation,
        });
        store.dispatch(action);
        sideEffectsAfterSend();
        return;
      }

      addMessageToList();
      sendMessageToBE();
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
    setShowBlockUserModal(true);
  }

  /**
   * Navigate the user to each reply that he received or scroll him to the bottom of the page
   * @function goToIndex
   */
  function goToIndex() {
    scrollToEnd(flatListRef);
  }

  /**
   * Animate NavigationHelperArrow into the direction of the next reply
   * @function getNextReplyPosition
   */
  function getViewPosition(e?) {
    const roomMessages = directChat.directChatMessages[currentRoom?.id];

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

    if (!roomMessages || !viewability.viewableItems) return;

    handlePreviousMessages();
    handleScrollDownButton();
  }

  function onEndReached() {
    setShowScrollDownButton(false);
  }

  const renderOptionsBottomBar = useMemo(
    () => (
      <OptionsBottomBar
        currentRoom={currentRoom}
        selectedMessage={removeMember}
        userProfile={userProfile}
        toggleOptionsBottomBar={toggleOptionsBottomBar}
        onPress={toggleRemoveMemberModal}
        directChatroom
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
        directChatroom
      />
    );
  }, [showReactionsModal, userProfile, reactionMessage]);

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

  const renderBlockUserModal = useMemo(() => {
    return (
      <ConfirmCancelModal
        key={'BlockUserModal'}
        showConfirmCancelModal={showBlockUserModal || showRejectDirectChatModal}
        confirmText={'Block'}
        cancelText={'Cancel'}
        title={'Block User'}
        text={
          'They won’t be able to find your profile, see your paper planes or send you messages. Youpendo won’t let them know you blocked them.'
        }
        toggleConfirmCancelModal={toggleBlockUserModal}
        onConfirm={blockUser}
        loading={blocking}
        successTitle={successTitle}
      />
    );
  }, [showBlockUserModal, blocking, successTitle, showRejectDirectChatModal]);

  const navigationHelperButton = useMemo(() => {
    return currentRoom && !isLoadingMessages ? (
      <NavigationHelperButton
        colors={Globals.gradients.primary}
        scrollToIndex={() => goToIndex()}
        replies={[]}
        show={showScrollDownButton && !textIsFocused}
        nextReplyAbove={false}
      />
    ) : null;
  }, [showScrollDownButton, textIsFocused, isLoadingMessages]);

  const renderListFooterComponent = useMemo(() => {
    const previousRoute =
      navigationState?.routes[navigationState?.routes?.length - 2]?.name;
    const amIDirectOwner = haveICreatedTheDirect();
    if (!amIDirectOwner) {
      return (
        <ListHeaderSection
          currentRoom={currentRoom}
          userProfile={userProfile}
          hasPreviousMessages={hasPreviousMessages && !isLoadingMessages}
          previousRoute={previousRoute}
          link={currentRoom?.invite_link}
          directChatroom
        />
      );
    }
  }, [currentRoom, hasPreviousMessages, userProfile, isLoadingMessages]);

  const renderMessageLoadingIndicator = useMemo(() => {
    if (currentRoom) {
      return (
        <MessageLoadingIndicator
          visible={isLoadingMessages || props.directChat.loadingRemovingMember}
        />
      );
    }
  }, [currentRoom, isLoadingMessages]);

  function renderListHeaderComponent() {
    return (
      <View style={styles.footerContainer}>
        {renderMessageLoadingIndicator}
        {renderAcceptBlockModal}
      </View>
    );
  }

  const renderAcceptBlockModal = useMemo(() => {
    const sender = getTheOtherMember();
    return !haveICreatedTheDirect() && currentRoom?.status == 0 ? (
      <AcceptBlockComponent
        onAccept={acceptDirectChat}
        onReject={toogleRejectDirectChatModal}
        sender={sender}
        loading={acceptingUser}
        successTitle={acceptUserSuccessTitle}
      />
    ) : null;
  }, [
    currentRoom,
    acceptUserSuccessTitle,
    acceptingUser,
    showAcceptBlockPermissionRequest,
  ]);

  function renderItemSeperator({ leadingItem }) {
    const display =
      previousLastMessage?.id === leadingItem?.id &&
      !appWasLocked &&
      !isLoadingMessages &&
      currentRoom?.new_message_count > 0;
    return display ? (
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
  function renderItem({ item }) {
    return (
      <DirectMessage
        message={item}
        userProfile={userProfile}
        openOptions={(message) => toggleOptionsBottomBar(message)}
        loadingMessages={
          isLoadingMessages || props.directChat.loadingRemovingMember
        }
        toggleReactionModal={toggleReactionModal}
        disabled={false}
        isFocused={isFocused}
        currentPlayingItem={currentMessagePlayingSound}
        onSoundPlayingItem={handleMessagePlayingSound}
        directChatroom
        navigation={navigation}
      />
    );
  }

  function haveICreatedTheDirect() {
    const directOwnerId = currentRoom?.sender.id;
    const loggedInUserId = userProfile.id;
    return directOwnerId == loggedInUserId;
  }

  function getTheOtherMember() {
    if (currentRoom?.sender.id == userProfile.id) {
      return currentRoom?.receiver;
    } else {
      return currentRoom?.sender;
    }
  }

  const renderTextInput = useMemo(() => {
    function updateScrollPosition(e) {
      setTextInputScrollPosition(e.nativeEvent.contentOffset.y);
    }

    function scrollToSelectedLetter() {
      if (!enabledTextInputEditing) return;
      textInputScrollViewRef.current?.scrollTo({
        x: 0,
        y: textInputScrollRef.current + 0.1,
      });
    }

    return !showAcceptBlockPermissionRequest ? (
      <SendMessageBar
        data-test={'button-submit'}
        sendMessage={handleSubmitAsync}
        show={textInputMessage.length > 0}
        colors={Globals.gradients.primary}
        contentContainerStyle={{ paddingVertical: 10 }}>
        <ScrollView
          ref={textInputScrollViewRef}
          scrollEventThrottle={50}
          onScrollBeginDrag={() => setEnabledTextInputEditing(false)}
          onScrollEndDrag={() => setEnabledTextInputEditing(true)}
          onScroll={updateScrollPosition}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder={'New conversation'}
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
              editable={currentRoom?.is_writable || enabledTextInputEditing}
            />
          </View>
        </ScrollView>
      </SendMessageBar>
    ) : null;
  }, [
    textInputMessage,
    textIsFocused,
    selectedMessage,
    isLoadingMessages,
    props.directChat.loadingRemovingMember,
    textInputScrollRef.current,
    enabledTextInputEditing,
    showAcceptBlockPermissionRequest,
  ]);

  function customHeaderBarIcon() {
    return <ReportIcon />;
  }

  function renderSender() {
    const theOtherMember = getTheOtherMember();
    return (
      <View style={styles.senderContainer}>
        <View style={styles.additionalLeftIconAvatarContainer}>
          <UserAvatar
            onclick={() => goToUserProfile(theOtherMember)}
            uri={theOtherMember?.profilePicture}
            size={45}
            disableShaddow={false}
          />
        </View>
        <Text style={styles.additionalLeftIconUserName} numberOfLines={1}>
          {theOtherMember?.name}
        </Text>
      </View>
    );
  }

  const renderCustomeHeaderBar = useMemo(() => {
    return (
      <View style={{ backgroundColor: 'blue' }}>
        <CustomHeaderBar
          onDismiss={navigateBack}
          customIcon={
            !currentRoom?.is_onboarding ? customHeaderBarIcon() : null
          }
          onPress={CustomHeaderBarOnPressHandler}
          loading={isLoadingMessages}
          additionalLeftIcon={renderSender()}
        />
      </View>
    );
  }, [isLoadingMessages, currentRoom]);

  function renderChatScreen() {
    let roomMessages = directChat.directChatMessages[currentRoom?.id];

    return currentRoom ? (
      <>
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
              ListHeaderComponent={renderListHeaderComponent()}
              ListFooterComponent={renderListFooterComponent}
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
            />
            {renderTextInput}
            {navigationHelperButton}
            {renderOptionsBottomBar}
            {renderReactionsModal}
            {renderReuploadModal}
            {renderBlockUserModal}
          </KeyboardAvoidingView>
        </SafeAreaView>
      </>
    ) : (
      <></>
    );
  }

  return currentRoom !== undefined ? renderChatScreen() : <></>;
}

export default connect(mapStateToProps)(UnconnectedDirectChatRoomScreen);
