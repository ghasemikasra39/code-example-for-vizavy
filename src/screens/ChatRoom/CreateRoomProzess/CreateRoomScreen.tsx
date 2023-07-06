import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import CustomHeaderBar from '../../../component-library/CustomHeaderBar';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from '../../../component-library/UserAvatar';
import Poll from '../../../component-library/Poll/Poll';
import ChatRoomManager from '../../../services/api/ChatRoomManager';
import { connect } from 'react-redux';
import { colorData, headers } from '../ChatRoomConstants';
import SelectInvites from './SelectInvites';
import { SafeAreaView } from 'react-native-safe-area-context';
import FadeInOut from '../../../Animated Hooks/FadeInOut';
import FriendshipManager from '../../../services/api/FriendshipManager';
import HapticFeedBackWrapper from '../../../component-library/HapticFeedBackWrapper';
import WriteIcon from '../../../component-library/graphics/Icons/WriteIcon';
import PollIcon from '../../../component-library/graphics/Icons/PollIcon';
import Globals from '../../../component-library/Globals';
import PusherClient from '../../../services/Pusher/PusherClient';
import { store } from '../../../store';
import { actionCreators } from '../../../store/actions';
import SendMessageBar from '../../../component-library/ChatRoom/SendMessageBar';
import AudioPlayBack from '../../../component-library/Audio/AudioPlayBack';
import RetryIcon from '../../../component-library/graphics/Icons/RetryIcon';


const mapStateToProps = ({ userProfile }) => ({
  userProfile,
});

function CreateRoomScreen(props) {
  const emojiFlags = require('emoji-flags');
  const screenSequenceRef = useRef();
  const initialMessageScrollViewRef = useRef();
  const textInputRef = useRef(null);
  const initialTextInputRef = useRef(null);
  const navigation = useNavigation();
  const [scrollIndex, setScrollIndex] = useState(0);
  const [text, setText] = useState('');
  const [voiceRecording, setVoiceRecording] = useState('');
  const [initialMessage, setInitialMessage] = useState('');
  const [selectedColor, setSelectedColor] = useState([]);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [pollActive, setPollActive] = useState(false);
  const [inviteFollowerData, setInviteFollowerData] = useState([]);
  const [includeFollower, setIncludeFollower] = useState(false);
  const [announcementSelected, setAnnouncementSelected] = useState(false);
  const [publicSelected, setPublicSelected] = useState(false);
  const [isWritable, setIsWritable] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPublicRoomManager, setIsPublicRoomManager] = useState(false);
  const [isCreatable, setIsCreatable] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pollData, setPollData] = useState([
    {
      id: 1,
      text: '',
    },
    {
      id: 2,
      text: '',
    },
  ]);

  useEffect(() => {
    switch (scrollIndex) {
      case 1:
        textInputRef.current.focus();
        break;
      case 2:
        initialTextInputRef.current?.focus();
        break;
      default:
        textInputRef.current?.blur();
        initialTextInputRef.current?.blur();
    }
  }, [scrollIndex]);

  useEffect(() => {
    checkUserRoleStatus();
    refreshFriendshipList();
  }, []);

  /**
   * Check if user is an admin or has the right to create public rooms
   * @method checkUserRoleStatus
   */
  function checkUserRoleStatus() {
    const admin = !!props.userProfile.roles.find(
      (element) => element === 'ROLE_ADMIN',
    );
    setIsAdmin(admin);

    const publicRoomManger = !!props.userProfile.roles.find(
      (element) => element === 'ROLE_PUBLIC_CHAT_ROOM_MANAGER',
    );
    setIsPublicRoomManager(publicRoomManger);
  }

  async function subscribeOnPusher(roomData) {
    function addSubscription(subName) {
      const action = actionCreators.chatRoom.addSubscription(subName);
      store.dispatch(action);
    }

    const pusher = await PusherClient.connect();
    const subName = `private-chat-room-${roomData.id}`;
    const chatroomChannel = pusher.subscribe(subName);
    chatroomChannel.bind('pusher:subscription_succeeded', () =>
      addSubscription(subName),
    );
  }

  /**
   * Create a new chatRoom
   * @method createRoom
   */
  async function createRoom() {
    const successHandler = (roomData) => {
      subscribeOnPusher(roomData.room);
      navigation.navigate('ChatRoom', {
        room: roomData.room,
        openInviteModal: true,
      });
      setCreatingRoom(false);
    };

    const filteredInvitationList = filterInvitationList();
    if (text.length) {
      setCreatingRoom(true);
      const roomData = await ChatRoomManager.createChatRoomAsync({
        title: text,
        answer_options: pollActive ? JSON.stringify(pollData) : null,
        color_1: selectedColor[0],
        color_2: selectedColor[1],
        invited_users: !publicSelected ? filteredInvitationList : null,
        is_announcement: announcementSelected,
        is_public: publicSelected,
        is_writable: isWritable,
        message: initialMessage ? initialMessage : null,
        media_file: voiceRecording ? voiceRecording : null,
        media_type: voiceRecording ? 1 : null,
      });
      if (roomData) {
        successHandler(roomData);
      } else {
        Alert.alert(
          'Failed to create your room. Please check your interent connection',
        );
        setCreatingRoom(false);
      }
    }
  }

  /**
   * Filter invitationList before sending it to BE
   * @method filterInvitationList
   */
  function filterInvitationList() {
    const filteredInvitationList = inviteFollowerData.map(
      (e) => e.user.internal_id,
    );
    return filteredInvitationList;
  }

  /**
   * Refresh your friendslist
   * @method refreshFriendshipList
   */
  function refreshFriendshipList() {
    FriendshipManager.getFriendsList();
  }

  /**
   * Select from your followers who you want to take part of the group
   * @method selectInvites
   */
  function selectInvites() {
    switch (scrollIndex) {
      case 0:
      case 1:
        if (
          (text.length && !pollActive) ||
          (text.length &&
            pollActive &&
            pollData.filter((d) => d.text.length <= 0).length === 0)
        ) {
          screenSequenceRef.current.scrollToIndex({
            animated: true,
            index: scrollIndex + 1,
          });
          setScrollIndex(2);
        } else {
          Alert.alert('🖐📝', 'Please fill in all the information', [
            { text: 'OK' },
          ]);
        }
        break;
      case 2:
        navigateForward();
        break;
      case 3:
        if (isCreatable || announcementSelected || publicSelected) {
          createRoom();
        } else {
          Alert.alert(
            '🖐',
            'A room consists of at least 2 people. Invite 1 friend or more to start a room',
            [{ text: 'OK' }],
          );
        }
        break;
    }
  }

  /**
   * When a color has been selected, animate the screent to the second screen of the flatlist
   * @method selectColor
   */
  function selectColor(item: any) {
    screenSequenceRef.current.scrollToIndex({
      animated: true,
      index: 1,
    });
    setScrollIndex(1);
    setSelectedColor(item);
  }

  /**
   * Navigate forward in the sequence
   * @method navigateForward
   */
  function navigateForward() {
    screenSequenceRef.current.scrollToIndex({
      animated: true,
      index: scrollIndex + 1,
    });
    setScrollIndex(scrollIndex + 1);
  }

  /**
   * Navigate back
   * @method navigateBack
   */
  function navigateBack() {
    if (scrollIndex > 0) {
      //If navigating back in the Flatlist
      screenSequenceRef.current.scrollToIndex({
        animated: true,
        index: scrollIndex - 1,
      });
      setScrollIndex(scrollIndex - 1);
    } else {
      //Naviagte back to previous screen
      navigation.goBack();
    }
  }

  /**
   * Update TextInput
   * @method onChangeText
   */
  function onChangeText(text: string) {
    setText(text);
  }

  /**
   * Update initial message TextInput
   * @method onChangeInitialMessage
   * @param {value - string} - new entered text
   */
  function onChangeInitialMessage(value: string) {
    setInitialMessage(value);
  }

  /**
   * Opne and close Poll
   * @method togglePoll
   */
  function togglePoll() {
    setPollActive(!pollActive);
  }

  /**
   * Delete the voice message and the first message
   * @method resetVoiceAudio
   */
  function resetVoiceAudio() {
    setVoiceRecording('');
    setInitialMessage('');
  }

  /**
   * Receives the uri of the recorded voice message and displays it
   * @method handleFinishedRecording
   * @param {uri - string} - voice recording uri
   */
  function handleFinishedRecording(uri: string) {
    setIsRecording(false);
    if (uri) {
      setVoiceRecording(uri);
      setInitialMessage('');
    }
  }

  /**
   * If the user has finished recording a voice message, he will receive the option to try again to record a voice message
   * @method showTryAgainAlert
   */
  function showTryAgainAlert() {
    Alert.alert(
      'Try again?',
      'Are you sure? You will have to rerecord from scratch?',
      [
        {
          text: 'Cancel',
          onPress: () => {
          },
          style: 'cancel',
        },
        { text: 'Try again', onPress: resetVoiceAudio },
      ],
      { cancelable: false },
    );
  }

  /**
   * Create a list of followers the user wants to invite
   * @method updateInviteUserList
   * @param {id : number} - id of selected user
   * @param {includeFollowers : boolean} - if includeFollowers is true, the room will be send to all users of inviteList.
   * If includeFollowers is false, the room will be send to all users excluding the inviteList
   */
  function updateInviteUserList(
    inviteFriendsData: Array<Object>,
    includeFollowers: boolean,
  ) {
    setInviteFollowerData(inviteFriendsData);
    setIncludeFollower(includeFollowers);
    if (inviteFriendsData?.length > 0) {
      setIsCreatable(true);
    } else {
      setIsCreatable(false);
    }
  }

  /**
   * Grey out button text when no textInout is empty
   * @method compileButtonTextStyle
   */
  function compileButtonTextStyle() {
    let textStyle = styles.createButtonText;
    switch (scrollIndex) {
      case 1:
        if (
          (text.length && !pollActive) ||
          (text.length &&
            pollActive &&
            pollData.filter((d) => d.text.length <= 0).length === 0)
        ) {
          textStyle = {
            ...textStyle,
            ...{
              color: Globals.color.button.blue,
            },
          };
        }
        return textStyle;
      case 2:
        if ((voiceRecording || initialMessage) && !isRecording) {
          textStyle = {
            ...textStyle,
            ...{
              color: Globals.color.button.blue,
            },
          };
        }
        return textStyle;
      case 3:
        if (isCreatable || announcementSelected || publicSelected) {
          textStyle = {
            ...textStyle,
            ...{
              color: Globals.color.button.blue,
            },
          };
        }
        return textStyle;
      default:
        return textStyle;
    }
  }

  function renderColorItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.colorItemContainer}
        onPress={() => selectColor(item)}>
        <LinearGradient style={styles.colorItem} colors={item} />
      </TouchableOpacity>
    );
  }

  function renderCreateButton() {
    function getButtonText() {
      switch (scrollIndex) {
        case 0:
        case 1:
          return 'Next';
        case 2:
          if (!voiceRecording && !initialMessage) {
            return 'Skip';
          } else {
            return 'Next';
          }
        case 3:
          return 'Create';
      }
    }

    return scrollIndex > 0 ? (
      <TouchableOpacity
        disabled={isRecording}
        style={styles.createButton}
        onPress={() => selectInvites()}>
        {!creatingRoom ? (
          <Text style={compileButtonTextStyle()}>{getButtonText()}</Text>
        ) : (
            <ActivityIndicator color={Globals.color.button.blue} />
          )}
      </TouchableOpacity>
    ) : null;
  }

  function renderPollTextIcon() {
    return (
      <TouchableWithoutFeedback onPress={togglePoll}>
        <View style={styles.pollTextIconContainer}>
          {scrollIndex < 2 ? (
            !pollActive ? (
              <PollIcon />
            ) : (
                <WriteIcon style={styles.writeIcon} />
              )
          ) : null}
          {scrollIndex < 2 ? (
            <Text style={styles.pollIconText}>
              {!pollActive ? 'Poll' : 'Write'}
            </Text>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function renderBottomBar() {
    return (
      <KeyboardAvoidingView
        style={styles.bottomBarContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {scrollIndex === 2 ? (
          !voiceRecording ? (
            <SendMessageBar
              colors={selectedColor}
              handleStartRecording={() => setIsRecording(true)}
              handleFinishedRecording={handleFinishedRecording}
            />
          ) : (
              renderRetryButton()
            )
        ) : (
            <FadeInOut fadeIn={scrollIndex > 0}>
              <View style={styles.bottomBar}>{renderPollTextIcon()}</View>
            </FadeInOut>
          )}
      </KeyboardAvoidingView>
    );
  }

  function renderRetryButton() {
    return (
      <View style={styles.retryButtonContainer}>
        <HapticFeedBackWrapper onPress={showTryAgainAlert}>
          <View style={styles.retryContainer}>
            <LinearGradient
              colors={selectedColor}
              style={styles.retryGradientWrapper}>
              <RetryIcon color={Globals.color.text.light} size={30} />
            </LinearGradient>
          </View>
        </HapticFeedBackWrapper>
        <Text style={styles.retry}>Try again 😊</Text>
      </View>
    );
  }

  function renderCreateRoom() {
    return (
      <View style={styles.screenItemContainer}>
        <Text style={styles.describtion}>
          Rooms automatically self-delete after 24 hours. You wouldn’t want your
          conversations to be recorded in real-life, right?
        </Text>

        <Text style={styles.chooseColor}>Pick your favorite color</Text>

        <FlatList
          contentContainerStyle={styles.colorListContainer}
          data={colorData}
          renderItem={renderColorItem}
          numColumns={4}
          scrollEnabled={false}
          keyboardDismissMode={'none'}
          keyboardShouldPersistTaps={'always'}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    );
  }

  const renderStartConversation = useMemo(() => {
    return (
      <ScrollView
        style={styles.screenItemContainer}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}>
        <View style={styles.textInputContainer}>
          <View style={{ flex: 1 }}>
            <TextInput
              ref={textInputRef}
              onChangeText={(text) => onChangeText(text)}
              style={styles.textInput}
              defaultValue={text}
              numberOfLines={2}
              maxLength={140}
              placeholderTextColor={Globals.color.text.grey}
              placeholder={
                'Share what’s on your mind, ask a question or create a poll.'
              }
              selectionColor={Globals.color.text.grey}
              multiline={true}
              keyboardAppearance={'light'}
            />
          </View>
        </View>

        <View style={styles.characterLimitContainer}>
          <Text style={styles.characterLimit}>{text.length}/140</Text>
        </View>

        {pollActive ? (
          <View style={styles.pollContainer}>
            <Poll
              colors={selectedColor}
              pollData={pollData}
              updatePollData={(pollEntries) => setPollData(pollEntries)}
              focus={scrollIndex === 1 ? true : false}
            />
          </View>
        ) : null}
      </ScrollView>
    );
  },[text, scrollIndex, selectedColor, pollData, pollActive]);

  const renderInitialMessage = useMemo(() => {
    const { name, location } = props.userProfile;
    function compileTextInputStyle() {
      let textStyle = styles.messageTextInput;
      if (initialMessage?.length === 0) {
        textStyle = {
          ...textStyle,
          fontFamily: Globals.font.family.semibold,
        };
      }
      return textStyle;
    }

    function handleOnLayout() {
      initialMessageScrollViewRef.current?.scrollToEnd();
    }
    return (
      <ScrollView
        ref={initialMessageScrollViewRef}
        style={styles.screenItemContainer}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}>
        <View style={styles.textInputContainer}>
          <View style={styles.avatarContainer}>
            <UserAvatar size={45} uri={props.userProfile.profilePictureUrl} />
          </View>
          <View style={styles.initialMessageContainer}>
            <Text style={styles.name}>
              {name}{' '}
              {location?.country_code
                ? emojiFlags.countryCode(location?.country_code).emoji
                : null}
            </Text>
            <View>
              <TextInput
                ref={initialTextInputRef}
                onChangeText={onChangeInitialMessage}
                style={compileTextInputStyle()}
                defaultValue={initialMessage}
                numberOfLines={2}
                placeholderTextColor={Globals.color.text.grey}
                placeholder={
                  'Share your perspective to start the conversation...'
                }
                selectionColor={Globals.color.text.grey}
                multiline={true}
                keyboardAppearance={'light'}
                onLayout={handleOnLayout}
              />
              {isRecording || voiceRecording ? (
                <View style={styles.audioContainer}>
                  {voiceRecording ? (
                    <AudioPlayBack
                      recordingUri={voiceRecording}
                      forceStop={scrollIndex !== 2}
                    />
                  ) : (
                      <Text style={styles.recordingText}>Recording...</Text>
                    )}
                </View>
              ) : null}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  },[initialMessage, voiceRecording, scrollIndex, isRecording]);

  const renderSelectInvites = useMemo(() => {
    return (
      <View style={styles.screenItemContainer}>
        <SelectInvites
          colors={selectedColor}
          followerData={props.userProfile?.friendships}
          updateInviteFriendData={updateInviteUserList}
          admin={isAdmin}
          publicRoomManager={isPublicRoomManager}
          selectAnnouncement={() =>
            setAnnouncementSelected(!announcementSelected)
          }
          publicSelected={publicSelected}
          selectPublic={() => setPublicSelected(!publicSelected)}
          anouncementSelected={announcementSelected}
          isWritable={isWritable}
          selectIsWritable={() => setIsWritable(!isWritable)}
          navigation={navigation}
        />
      </View>
    );
  }, [
    selectedColor,
    props.userProfile?.friendships,
    isAdmin,
    isPublicRoomManager,
    announcementSelected,
    isWritable,
    publicSelected,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        text={headers[scrollIndex]}
        onDismiss={() => navigateBack()}
        avoidSafeArea={true}
        customIcon={renderCreateButton()}
      />
      <FlatList
        ref={screenSequenceRef}
        data={[
          renderCreateRoom(),
          renderStartConversation,
          renderInitialMessage,
          renderSelectInvites,
        ]}
        renderItem={({ item }) => item}
        horizontal={true}
        scrollEnabled={false}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}
        keyExtractor={(item, index) => index.toString()}
      />
      {renderBottomBar()}
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(CreateRoomScreen);

const styles = StyleSheet.create({
  containerBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.dark,
  },
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
  },
  screenItemContainer: {
    width: Dimensions.get('window').width,
    paddingVertical: Globals.dimension.padding.tiny,
  },
  describtion: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    paddingHorizontal: Globals.dimension.padding.small,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.tiny,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  chooseColor: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    fontSize: Globals.font.size.medium,
    textAlign: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
    marginTop: Globals.dimension.margin.medium,
  },
  colorListContainer: {
    width: '100%',
    alignItems: 'center',
  },
  colorItemContainer: {
    width: 60,
    height: 60,
    borderRadius: 100,
    overflow: 'hidden',
    margin: Globals.dimension.margin.mini,
  },
  colorItem: {
    width: '100%',
    height: '100%',
  },
  textInputContainer: {
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
    marginBottom: Globals.dimension.margin.medium,
  },
  audioContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
  },
  initialMessageContainer: {
    flex: 1,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.mini,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  textInput: {
    fontSize: Globals.font.size.large,
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
  },
  messageTextInput: {
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    fontFamily: Globals.font.family.regular,
    lineHeight: Globals.font.lineHeight.small,
    top: -5,
    paddingBottom: 3,
  },
  recordingText: {
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.grey,
    fontFamily: Globals.font.family.semibold,
    lineHeight: Globals.font.lineHeight.small,
  },
  name: {
    color: Globals.color.text.default,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
  },
  avatarContainer: {
    marginRight: Globals.dimension.margin.tiny,
  },
  characterLimitContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingHorizontal: Globals.dimension.padding.mini,
    marginTop: Globals.dimension.margin.tiny,
  },
  characterLimit: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
  },
  bottomBarContainer: {
    bottom: 0,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 45,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  createButton: {
    borderRadius: 100,
    overflow: 'hidden',
  },
  createButtonGradient: {
    height: 35,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.medium,
  },
  pollContainer: {
    width: '100%',
    marginTop: Globals.dimension.margin.tiny,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollTextIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pollIconText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    marginLeft: Globals.dimension.margin.tiny,
  },
  writeIcon: {
    top: -2.5,
  },
  retryButtonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Globals.dimension.padding.tiny,
  },
  retryContainer: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  retryGradientWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  retry: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    marginTop: Globals.dimension.margin.tiny,
  },
  recordingAnimation: {
    width: 40,
  },
});
