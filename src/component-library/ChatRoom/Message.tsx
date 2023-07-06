import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import Globals from './../Globals';
import UserAvatar from '../UserAvatar';
import { getFormattedDate } from '../../screens/ChatRoom/ChatroomUtils';
import {
  ChatRoomInterface,
  MessageInterface,
} from '../../services/api/ChatRoomManager';
import { UserProfileState } from '../../store/slices/UserProfileSlice';
import FlattenReactionsComponent from './FlattenReactionsComponent';
import AudioPlayBack from '../Audio/AudioPlayBack';
import ReplyMessageIcon from '../graphics/Icons/ReplyMessageIcon';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';

interface MessageProps {
  message?: MessageInterface;
  currentRoom?: ChatRoomInterface;
  conversationIndex?: number;
  userProfile?: UserProfileState;
  goToUserProfile?: (message) => void;
  handleMessageSelected?: (message, conversationIndex, replyIndex) => void;
  openOptions?: (message: Object) => void;
  keyBoardIsOpen?: boolean;
  loadingMessages?: boolean;
  toggleReactionModal?: (message: Object) => void;
  disabled?: boolean;
  isFocused?: boolean;
  currentPlayingItem?: MessageInterface;
  onSoundPlayingItem?: (message: MessageInterface) => void;
}

interface MessageItemProps extends MessageProps {
  messageItem: MessageInterface;
  replyIndex?: number;
}

export default function Message(props: MessageProps) {
  const {
    message,
    currentRoom,
    keyBoardIsOpen,
    loadingMessages,
    isFocused,
    currentPlayingItem,
    userProfile,
    onSoundPlayingItem,
    handleMessageSelected,
    conversationIndex,
    openOptions,
    goToUserProfile,
    toggleReactionModal,
  } = props;

  /**
   * Define the indentation of messages that have replies
   * @function compileThreadStyle
   * @param replies - Replies from parent message
   */
  function compileThreadStyle(replies) {
    let threadStyle = styles.itemMainContainer;
    if (replies) {
      threadStyle = {
        ...threadStyle,
        ...{
          marginBottom: Globals.dimension.margin.mini,
        },
      };
    }
    return threadStyle;
  }

  function passUpSelectedMessage(
    selectedMessage: MessageInterface,
    conversationIndex: number,
    replyIndex?: number,
  ) {
    handleMessageSelected(selectedMessage, conversationIndex, replyIndex);
  }

  function keyExtractor(item) {
    return item.ref;
  }

  function renderMessageItem(
    messageItem: MessageInterface,
    replyIndex?: number,
  ) {
    return (
      <MessageItem
        currentRoom={currentRoom}
        messageItem={messageItem}
        conversationIndex={conversationIndex}
        replyIndex={replyIndex ?? undefined}
        userProfile={userProfile}
        isFocused={isFocused}
        currentPlayingItem={currentPlayingItem}
        loadingMessages={loadingMessages}
        onSoundPlayingItem={(recordingMessage) =>
          onSoundPlayingItem(recordingMessage)
        }
        handleMessageSelected={passUpSelectedMessage}
        openOptions={(selectedMessage) => openOptions(selectedMessage)}
        toggleReactionModal={(selectedMessage) =>
          toggleReactionModal(selectedMessage)
        }
        goToUserProfile={(selectedMessage) => goToUserProfile(selectedMessage)}
        keyBoardIsOpen={keyBoardIsOpen}
      />
    );
  }

  function renderReplies(replies: Array<Object>) {
    return (
      <FlatList
        data={replies ? replies : []}
        renderItem={({ item, index }) => {
          let reply = item;
          let replyIndex = index;
          return renderMessageItem(reply, replyIndex);
        }}
        keyExtractor={keyExtractor}
      />
    );
  }

  return (
    <View style={compileThreadStyle(message?.replies?.length > 0)}>
      {renderMessageItem(message)}
      {message?.replies?.length > 0 ? renderReplies(message?.replies) : null}
    </View>
  );
}

export function MessageItem(props: MessageItemProps) {
  const emojiFlags = require('emoji-flags');
  const {
    messageItem,
    loadingMessages,
    currentRoom,
    userProfile,
    goToUserProfile,
    handleMessageSelected,
    conversationIndex,
    replyIndex,
    disabled,
    isFocused,
    onSoundPlayingItem,
    openOptions,
    toggleReactionModal,
    keyBoardIsOpen,
    currentPlayingItem,
  } = props;
  const {
    app_user,
    message,
    is_approved,
    media_type,
    media_url,
    created_at,
    parent_message,
    flatten_reactions,
    total_users_reacted,
    type,
    sent,
  } = messageItem;
  const INITIAL_MESSAGE_LENGTH = 750;
  const [showEntireMessage, setShowEntireMessage] = useState(
    checkToShowEntireMessage(),
  );
  const [trimmedMessage, setTrimmedMessage] = useState(getTrimmedMessage());

  function getTrimmedMessage() {
    if (message?.length > INITIAL_MESSAGE_LENGTH) {
      const newTrimmedMessage =
        message.substring(0, INITIAL_MESSAGE_LENGTH) + '...';
      return newTrimmedMessage;
    }
    return message;
  }

  function checkToShowEntireMessage() {
    if (message?.length > INITIAL_MESSAGE_LENGTH) {
      return false;
    }
    return true;
  }

  function openEntireMessage() {
    setShowEntireMessage(true);
    setTrimmedMessage(message);
  }

  function passUpSelectedMessage() {
    handleMessageSelected(messageItem, conversationIndex, replyIndex);
  }

  const compileJoinMessage = useMemo(() => {
    return app_user.id !== currentRoom.app_user.id ? (
      <View style={styles.joinMemberContainer}>
        {!loadingMessages ? (
          <Text numberOfLines={1} style={styles.joinedRoom}>
            {app_user.name}{' '}
            {app_user.location.country_code
              ? emojiFlags.countryCode(app_user.location.country_code).emoji
              : null}{' '}
            joined the room 👋
          </Text>
        ) : (
          <View style={styles.joinCoverContainer} />
        )}
      </View>
    ) : null;
  }, [loadingMessages]);

  function renderFlattenEmojies() {
    return (
      <View style={styles.flattenEmojiContainer}>
        <FlattenReactionsComponent
          data={flatten_reactions}
          totalUsersReacted={total_users_reacted}
          onPress={() => toggleReactionModal(messageItem)}
        />
        {loadingMessages ? <View style={styles.reactionsContainer} /> : null}
      </View>
    );
  }
  const renderMessageItem = useMemo(() => {
    /**
     * Indent a message to the right if it's a child
     * @function compileListItemStyles
     * @param message
     */
    function compileListItemStyles() {
      let listItemStyles = styles.listItem;

      if (parent_message !== null && parent_message?.id !== null) {
        listItemStyles = {
          ...listItemStyles,
          ...styles.indentedListItem,
        };
      }

      return listItemStyles;
    }

    /**
     * Define the size of the userAvatar depending if the message is a reply or a parentMessage
     * @function compileUserAvatarContainer
     * @param conversation - Item message that gets passed down from flatList to renderItem
     */
    function compileUserAvatarContainer() {
      let containerStyle = styles.avatarContainer;
      if (parent_message !== null && parent_message?.id !== null) {
        containerStyle = {
          ...containerStyle,
          ...{
            width: 34,
            height: 34,
          },
        };
      }
      return containerStyle;
    }

    /**
     * Return the profile picture from Amazon S3 or if it is you, return your cached image
     * @function compileUserAvatarUri
     * @param conversation - Item message that gets passed down from flatList to renderItem
     */
    function compileUserAvatarUri() {
      if (userProfile.id === app_user?.id)
        return 'data:image/png;base64,' + userProfile.profilePictureBase64;
      return app_user?.profilePicture;
    }

    /**
     * Define the backgroundStyle of the message item
     * @function compileMessageMainWrapper
     */
    function compileMessageMainWrapper() {
      let backgroundStyle = styles.messageMainWrapper;
      if (loadingMessages) {
        backgroundStyle = {
          ...backgroundStyle,
          backgroundColor: '#F0F0F1',
        };
      }
      return backgroundStyle;
    }

    /**
     * Decide on the correct size of the avatar based on being a parent message or child
     * @function compileUserAvatarSize
     * @param {Message Object} item - the message
     * @return {Number} - the size of the avatar
     */
    function compileUserAvatarSize() {
      // null | id
      return parent_message !== null && parent_message?.id !== null ? 35 : 38;
    }

    /**
     * Define the loading userAvatar icon that covers the actual userAvatar when messages are loading
     * @function compileCoverAvatarSize
     * @param conversation - Item message that gets passed down from flatList to renderItem
     */
    function compileCoverAvatarSize() {
      let containerSize = styles.coverloadingAvatar;
      if (parent_message !== null && parent_message?.id !== null) {
        containerSize = {
          ...containerSize,
          width: 35,
          height: 35,
        };
      }
      return containerSize;
    }

    /**
     * Decide if the logged-in user is the owner of the new message
     * @function amImessageOwner
     * @param {Message Object} newMessage
     * @returns {Boolean}
     */
    function amImessageOwner() {
      const userId = userProfile?.id;
      if (app_user?.id === userId) {
        return true;
      } else {
        return false;
      }
    }
    if (is_approved || (!is_approved && amImessageOwner()))
      return (
        <View style={compileListItemStyles()}>
          <View style={compileUserAvatarContainer()}>
            <UserAvatar
              onclick={() => goToUserProfile(messageItem)}
              uri={compileUserAvatarUri()}
              size={compileUserAvatarSize()}
              disableShaddow={true}
            />
            {loadingMessages ? <View style={compileCoverAvatarSize()} /> : null}
          </View>
          <View style={styles.messageMainContainer}>
            <TouchableWithoutFeedback
              onPress={passUpSelectedMessage}
              onLongPress={() => openOptions(messageItem)}
              delayLongPress={200}
              disabled={disabled}>
              <View style={compileMessageMainWrapper()}>
                <View style={styles.messageFirstRowContainer}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {app_user.name}{' '}
                    {app_user.location.country_code
                      ? emojiFlags.countryCode(app_user.location.country_code)
                          .emoji
                      : null}
                  </Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.messageCreatedAt}>
                      {' '}
                      {getFormattedDate(created_at)}
                    </Text>
                  </View>
                  {loadingMessages ? (
                    <View style={styles.coverContainer} />
                  ) : null}
                </View>
                <View>
                  {media_url && media_type === 1 ? (
                    <AudioPlayBack
                      recordingUri={media_url}
                      forceStop={
                        !isFocused || currentPlayingItem?.id !== messageItem?.id
                      }
                      item={messageItem}
                      onPlayItem={(recordingMessage) =>
                        onSoundPlayingItem(recordingMessage)
                      }
                    />
                  ) : (
                    <View>
                      <Text style={styles.messageContent}>
                        {trimmedMessage}
                      </Text>
                      {!showEntireMessage ? (
                        <HapticFeedBackWrapper onPress={openEntireMessage}>
                          <Text style={styles.readMore}>Read more</Text>
                        </HapticFeedBackWrapper>
                      ) : null}

                      {!currentRoom?.is_onboarding ? (
                        <View style={styles.tapToReplyContainer}>
                          <ReplyMessageIcon size={11} />
                          <Text style={styles.tapToReply}>Tap to reply</Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            height: Globals.dimension.margin.tiny * 0.5,
                          }}
                        />
                      )}
                    </View>
                  )}

                  {loadingMessages ? (
                    <View style={styles.coverContainer} />
                  ) : null}
                </View>
              </View>
            </TouchableWithoutFeedback>
            <View />
            {renderFlattenEmojies()}
          </View>

          <View>
            {sent !== undefined && sent === false ? (
              <TouchableOpacity style={styles.failedMessageContainer}>
                <Text style={styles.exclamationMark}>!</Text>
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </View>
        </View>
      );
    return null;
  }, [
    messageItem,
    currentRoom,
    loadingMessages,
    showEntireMessage,
    currentPlayingItem,
    isFocused,
    userProfile,
    keyBoardIsOpen,
  ]);

  switch (type) {
    case 'member':
      return compileJoinMessage;
    case 'message':
      return renderMessageItem;
  }
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
    backgroundColor: 'cadetblue',
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
  joinMemberContainer: { backgroundColor: Globals.color.background.light },
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
});
