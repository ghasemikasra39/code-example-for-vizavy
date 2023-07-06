import React, {useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Globals from '../Globals';
import {getFormattedDate} from '../../screens/ChatRoom/ChatroomUtils';
import {MessageInterface} from '../../services/api/ChatRoomManager';
import {UserProfileState} from '../../store/slices/UserProfileSlice';
import FlattenReactionsComponent from './FlattenReactionsComponent';
import AudioPlayBack from '../Audio/AudioPlayBack';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';

interface MessageProps {
  message?: MessageInterface;
  userProfile?: UserProfileState;
  openOptions?: (message: Object) => void;
  loadingMessages?: boolean;
  toggleReactionModal?: (message: Object) => void;
  disabled?: boolean;
  isFocused?: boolean;
  currentPlayingItem?: MessageInterface;
  onSoundPlayingItem?: (message: MessageInterface) => void;
  directChatroom: boolean;
  navigation?: any;
}

export default function DirectMessage(props: MessageProps) {
  const {
    message,
    loadingMessages,
    userProfile,
    disabled,
    isFocused,
    onSoundPlayingItem,
    openOptions,
    toggleReactionModal,
    directChatroom,
    currentPlayingItem,
    navigation,
  } = props;

  function openPaperPlane() {
    navigation.push('PaperPlaneDetailsScreen', {
      item: message?.paper_plane,
      returnRoute: 'DirectChatScreen',
    });
  }

  const INITIAL_MESSAGE_LENGTH = 750;
  const [showEntireMessage, setShowEntireMessage] = useState(
    checkToShowEntireMessage(),
  );
  const [trimmedMessage, setTrimmedMessage] = useState(getTrimmedMessage());

  function getTrimmedMessage() {
    if (message?.message?.length > INITIAL_MESSAGE_LENGTH) {
      const newTrimmedMessage =
        message?.message?.substring(0, INITIAL_MESSAGE_LENGTH) + '...';
      return newTrimmedMessage;
    }
    return message.message;
  }

  function checkToShowEntireMessage() {
    if (message?.message?.length > INITIAL_MESSAGE_LENGTH) {
      return false;
    }
    return true;
  }

  function openEntireMessage() {
    setShowEntireMessage(true);
    setTrimmedMessage(message?.message);
  }

  const renderMessageItem = useMemo(() => {
    const fromHost = amImessageOwner();

    function compilePosition(position) {
      let positionStyle = position;
      positionStyle = {
        ...positionStyle,
        alignItems: fromHost ? 'flex-end' : 'flex-start',
      };
      return positionStyle;
    }

    /**
     * Decide if the logged-in user is the owner of the new message
     * @function amImessageOwner
     * @param {Message Object} newMessage
     * @returns {Boolean}
     */
    function amImessageOwner() {
      const userId = userProfile?.id;
      if (message?.app_user?.id === userId) {
        return true;
      } else {
        return false;
      }
    }

    function compilePPMessage() {
      return (
        <View style={compilePosition(styles.ppMessageContainer)}>
          <Text
            style={styles.ppMessageText}>{amImessageOwner() ? "You replied to their paper plane" : "Replied to your paper plane"}</Text>
          <TouchableOpacity onPress={openPaperPlane}>
            <Image
              style={styles.ppMessageImage}
              source={{uri: message?.paper_plane?.publicThumbnailUrl}}
              resizeMode={'cover'}
            />
          </TouchableOpacity>
        </View>
      );
    }

    function compileTextOrAudioMessage() {
      return (
        <View
          style={{
            ...styles.taMessageContainer,
            backgroundColor: fromHost
              ? Globals.color.background.mediumLightgrey
              : Globals.color.background.light,
          }}>
          {message?.media_url && message?.media_type === 1 ? (
            <AudioPlayBack
              recordingUri={message?.media_url}
              forceStop={!isFocused || currentPlayingItem?.id !== message?.id}
              item={message}
              onPlayItem={(recordingMessage) =>
                onSoundPlayingItem(recordingMessage)
              }
            />
          ) : (
            <View>
              <Text style={styles.taMessageText}>{trimmedMessage}</Text>
              {!showEntireMessage ? (
                <HapticFeedBackWrapper onPress={openEntireMessage}>
                  <Text style={styles.readMore}>Read more</Text>
                </HapticFeedBackWrapper>
              ) : null}
            </View>
          )}
          <View style={{alignItems: 'flex-end'}}>
            <Text style={styles.taMessageDate}>
              {getFormattedDate(message.created_at)}
            </Text>
          </View>

          <View style={styles.taMessageReactions}>
            <FlattenReactionsComponent
              data={message?.flatten_reactions}
              totalUsersReacted={message?.total_users_reacted}
              onPress={() => toggleReactionModal(message)}
            />
            {loadingMessages ? (
              <View style={styles.reactionsContainer}/>
            ) : null}
          </View>
        </View>
      );
    }

    return (
      <View style={compilePosition(styles.directMessageContainer)}>
        {message.paper_plane !== null &&
        message.paper_plane !== undefined &&
        compilePPMessage()}
        <TouchableWithoutFeedback
          onLongPress={() => openOptions(message)}
          delayLongPress={200}
          disabled={disabled}>
          {compileTextOrAudioMessage()}
        </TouchableWithoutFeedback>
      </View>
    );
  }, [
    message,
    loadingMessages,
    showEntireMessage,
    currentPlayingItem,
    isFocused,
    userProfile,
    trimmedMessage,
  ]);

  return renderMessageItem;
}

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.small * 0.6,
    paddingVertical: Globals.dimension.padding.tiny,
    backgroundColor: Globals.color.background.light,
  },
  indentedListItem: {
    paddingLeft: Globals.dimension.padding.xlarge * 0.85,
  },
  itemMainContainer: {
    flex: 1,
  },
  avatarContainer: {
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    width: 38,
    height: 38,
    elevation: 15,
    marginRight: Globals.dimension.margin.tiny,
  },
  messageMainContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  messageMainWrapper: {
    flex: 1,
    backgroundColor: Globals.color.background.mediumLightgrey,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: Globals.dimension.borderRadius.mini,
  },
  messageFirstRowContainer: {
    flexDirection: 'row',
    paddingBottom: 1,
  },
  userName: {
    color: Globals.color.text.default,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    lineHeight: Globals.font.lineHeight.small,
    flex: 2,
  },
  messageCreatedAt: {
    textAlign: 'right',
    color: Globals.color.text.grey,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.xTiny,
    lineHeight: Globals.font.lineHeight.tiny,
  },
  messageContent: {
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    fontFamily: Globals.font.family.regular,
    lineHeight: Globals.font.lineHeight.small,
  },
  readMore: {
    fontSize: Globals.font.size.small,
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.button.blue,
    lineHeight: Globals.font.lineHeight.small,
  },
  tapToReplyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tapToReply: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.xTiny,
    color: Globals.color.text.grey,
    marginLeft: Globals.dimension.margin.tiny * 0.5,
  },
  shadedThreat: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  coverloadingAvatar: {
    width: 38,
    height: 38,
    borderRadius: 100,
    backgroundColor: '#F0F0F1',
    position: 'absolute',
  },
  coverContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F1',
  },
  reactionsContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#F0F0F1',
    borderRadius: Globals.dimension.borderRadius.large,
  },
  reportIconContainer: {
    backgroundColor: Globals.color.background.light,
    flex: 1,
    justifyContent: 'center',
  },
  reportIconWrapper: {
    backgroundColor: Globals.color.background.mediumgrey,
    width: 40,
    height: 40,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportIcon: {
    width: 20,
    height: 25,
    right: 2,
  },
  flattenEmojiContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: -5,
  },
  joinMemberContainer: {
    backgroundColor: Globals.color.background.light,
  },
  joinedRoom: {
    color: Globals.color.text.grey,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.xTiny,
    alignSelf: 'center',
    padding: Globals.dimension.padding.tiny,
  },
  joinCoverContainer: {
    width: '60%',
    height: 13,
    alignSelf: 'center',
    borderRadius: Globals.dimension.borderRadius.large,
    backgroundColor: Globals.color.background.mediumLightgrey,
  },
  ppMessageContainer: {
    marginBottom: Globals.dimension.margin.tiny,
  },
  ppMessageText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.xTiny,
    lineHeight: Globals.font.lineHeight.tiny,
    color: Globals.color.text.grey,
    marginBottom: Globals.dimension.margin.tiny,
  },
  ppMessageImageContainer: {
    width: '93%',
    borderRadius: Globals.dimension.borderRadius.mini,
    marginBottom: Globals.dimension.margin.tiny,
    overflow: 'hidden',
  },
  ppMessageImage: {
    width: '47%',
    aspectRatio: 0.9,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.mini,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  taMessageContainer: {
    paddingHorizontal: Globals.dimension.padding.small * 0.6,
    paddingVertical: Globals.dimension.padding.tiny,
    borderWidth: 1,
    borderColor: Globals.color.background.mediumLightgrey,
    marginBottom: Globals.dimension.margin.tiny,
    width: '80%',
    borderRadius: Globals.dimension.borderRadius.tiny * 1.8,
  },
  taMessageText: {
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    fontFamily: Globals.font.family.regular,
    lineHeight: Globals.font.lineHeight.small,
  },
  taMessageDate: {
    fontFamily: Globals.font.family.regular,
    lineHeight: Globals.font.lineHeight.xTiny,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.xTiny,
  },
  taMessageReactions: {position: 'absolute', bottom: -8, left: 5},
  directMessageContainer: {
    paddingLeft: Globals.dimension.padding.mini,
    paddingRight: Globals.dimension.padding.mini,
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
});
