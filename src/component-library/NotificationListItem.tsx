import React, { useMemo, useState, useEffect } from 'react';
import moment from 'moment';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import Globals from './Globals';
import UserAvatar from './UserAvatar';
import NavigationService from '../services/utility/NavigationService';
import {
  NOTIFICATION_TYPE_PAPERPLANE_UPVOTE,
  NOTIFICATION_TYPE_PAPERPLANE_REPLY,
  NOTIFICATION_TYPE_PAPERPLANE_REPLY_TO_REPLY,
  TYPE_SOMEONE_FOLLOWED,
  TYPE_GREETINGS,
  TYPE_REPLY_UPVOTE,
  TYPE_FRIENDSHIP_REQUEST_APPROVED,
  TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED,
  TYPE_NEW_FRIENDSHIP_REQUEST,
  BackendNotificationInterface,
  TYPE_CHAT_ROOM_CREATED,
  TYPE_ROOM_ABOUT_TO_EXPIRE,
  TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED,
  TYPE_CHAT_ROOM_EXTENDED,
} from '../services/api/PushNotificationSubscriber';
import {
  followUser,
  replyIconNotification,
  replyIconNotificationBlue,
} from './graphics/Images';
import NotificationsManager from '../services/api/NotificationsManager';
import HeartImage from './graphics/Icons/HeartImage';
import { UserProfileState } from '../store/slices/UserProfileSlice';
import { useNavigation } from '@react-navigation/native';
import HighlightText from '@sanar/react-native-highlight-text';
import FriendRequestListItem from './FriendRequestListItem';
import ChatRoomManager from '../services/api/ChatRoomManager';
import { getTimeDifference } from '../screens/ChatRoom/ChatroomUtils';
import TimeUpIcon from './graphics/Icons/TimeUpIcon';
import CouchIcon from './graphics/Icons/CouchIcon';
import DirectChatsManager from '../services/api/DirectChatsManager';
import FriendshipManager from '../services/api/FriendshipManager';
import MessageIcon from './graphics/Icons/MessageIcon';
import ReactionIcon from './graphics/Icons/ReactionIcon';

moment.updateLocale('en', Globals.format.dateAndTime);

interface Props {
  notification: BackendNotificationInterface;
  userProfile: UserProfileState;
  seenNotification?: (id: number) => void;
  followedUser?: (id: number) => void;
}

export default function NotificationListItem(props: Props) {
  const { notification, userProfile } = props;
  const [roomExpired, setRoomExpired] = useState(false);
  const {
    id,
    type,
    createdAt,
    readableEvent,
    relatedUser,
    paperPlane,
    seenAt,
    reply,
  } = notification;
  const navigation = useNavigation();

  useEffect(() => {
    calculateTimeRemaining();
  }, []);

  /**
   * This method marks the notification as seen and updates the Ui
   * @method markNotificationAsSeen
   */
  function markNotificationAsSeen() {
    if (!seenAt) {
      //Marks the notifiation as seen from the backend
      NotificationsManager.markNotitificationAsSeen(id);
    }
  }

  function goToUserProfile() {
    if (userProfile.id === relatedUser?.id) {
      navigation.navigate('MyProfileScreen', {
        userProfile,
      });
    } else {
      navigation.navigate('UsersProfileScreen', {
        paperPlane: paperPlane,
        relatedUser: relatedUser,
      });
    }
  }

  /**
   * Calculates how much time is remaining until the room gets deleted
   * @function calculateTimeRemaining
   * @param {timeCreated : any} - Set the time when the room was first created
   */
  function calculateTimeRemaining() {
    const extentedExpirationTime = notification?.chat_room?.is_extended
      ? 24
      : 0;
    const remainingTime =
      getTimeDifference(notification?.chat_room?.approved_at, 'asHours') +
      extentedExpirationTime;
    if (remainingTime < 0) {
      setRoomExpired(true);
    } else {
      setRoomExpired(false);
    }
  }

  /**
   * Handles the navigation when a user clicks on the notification
   * @method handleNavigation
   */
  function handleNavigation() {
    switch (type) {
      case NOTIFICATION_TYPE_PAPERPLANE_UPVOTE:
        NavigationService.navigate('PaperPlaneDetailsScreen', {
          item: paperPlane,
          returnRoute: 'NotificationsScreen',
          currentPaperPlane: 0,
        });
        break;
      case TYPE_FRIENDSHIP_REQUEST_APPROVED:
        FriendshipManager.getFriendsList();
        NavigationService.navigate('FriendsScreen', {});
        break;
      case TYPE_CHAT_ROOM_CREATED:
      case TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED:
      case TYPE_CHAT_ROOM_EXTENDED:
      case TYPE_ROOM_ABOUT_TO_EXPIRE:
        if (!roomExpired) {
          ChatRoomManager.navigateToChatRoomScreen(notification?.chat_room?.id);
        }
        break;
      case TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED:
        DirectChatsManager.findAndNavigateToDirectChat(
          notification?.direct_chat?.id,
        );
        break;
    }
    markNotificationAsSeen();
  }

  /**
   * Render icon actions according to notification type
   * @method actionIcon
   */
  function actionIcon() {
    if (type === NOTIFICATION_TYPE_PAPERPLANE_UPVOTE) {
      return (
        <View style={styles.likeContainer}>
          <View style={styles.likeIndicator}>
            <HeartImage isLiked={false} width={20} height={20} />
          </View>
        </View>
      );
    } else if (type === TYPE_REPLY_UPVOTE) {
      return (
        <View style={styles.likeContainer}>
          <View style={styles.replyLikeIndicator}>
            <HeartImage isLiked={true} width={20} height={20} />
          </View>
        </View>
      );
    } else if (type === NOTIFICATION_TYPE_PAPERPLANE_REPLY) {
      return (
        <View style={styles.likeContainer}>
          <View style={styles.replyIconContainer}>
            <Image style={styles.replyIcon} source={replyIconNotification} />
          </View>
        </View>
      );
    } else if (type === NOTIFICATION_TYPE_PAPERPLANE_REPLY_TO_REPLY) {
      return (
        <View style={styles.likeContainer}>
          <View style={styles.replytoReplyIconContainer}>
            <Image
              style={styles.replyIcon}
              source={replyIconNotificationBlue}
            />
          </View>
        </View>
      );
    }
  }

  const checkNotificationType = useMemo(() => {
    function getFormattedDate() {
      return moment(createdAt).fromNow(true);
    }

    /**
     * Compile NOTIFICATION_TYPE_INCOMING_PAPERPLANE, NOTIFICATION_TYPE_PAPERPLANE_UPVOTE,
     * TYPE_SOMEONE_FOLLOWED, TYPE_GREETINGS and TYPE_SUBSCRIBED_PAPERPLANE_COMMENTED
     *  notification types
     * @function compileOtherTypes
     * @return {React.JSX} the notification item JSX
     */
    function compileOtherTypes() {
      return (
        <View style={styles.notificationWrapper}>
          <View style={styles.innerContainer}>
            <View style={styles.avatarShadow}>
              <UserAvatar
                onclick={goToUserProfile}
                uri={relatedUser?.profilePicture}
                size={44}
              />
            </View>
            <TouchableOpacity
              style={styles.textHolder}
              onPress={handleNavigation}>
              <HighlightText
                style={styles.eventDescriptionText}
                highlightStyle={styles.eventDescriptionName}
                searchWords={[relatedUser?.name]}
                textToHighlight={readableEvent}
              />
              {relatedUser?.location && [
                <Text
                  style={styles.eventMetaInformationText}
                  key="metaInformation">
                  {/* {' • ' + getFormattedDate()} */}
                  {getFormattedDate()}
                </Text>,
              ]}
            </TouchableOpacity>
            {type !== TYPE_FRIENDSHIP_REQUEST_APPROVED ? (
              <TouchableOpacity
                style={styles.actionContainer}
                onPress={handleNavigation}>
                {type === TYPE_SOMEONE_FOLLOWED ? (
                  <Image source={followUser} style={styles.followUserIcon} />
                ) : type !== TYPE_GREETINGS ? (
                  <View style={styles.thumbnailHolder}>
                    <View style={styles.thumbnailWrapper}>
                      {paperPlane && paperPlane?.publicThumbnailUrl && (
                        <ImageBackground
                          resizeMode={'cover'}
                          style={styles.thumbnail}
                          source={{
                            uri: paperPlane?.publicThumbnailUrl,
                          }}
                        />
                      )}
                    </View>
                    {actionIcon()}
                  </View>
                ) : null}
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      );
    }

    function compileFriendshipRequest() {
      return (
        <View style={styles.notificationWrapper}>
          <FriendRequestListItem
            requestId={notification?.friendship_request?.id}
            user={notification?.relatedUser}
            requestCreateAt={notification?.createdAt}
          />
        </View>
      );
    }

    function compileRoomType() {
      return (
        <View style={styles.notificationWrapper}>
          <View style={styles.innerContainer}>
            <View style={styles.avatarShadow}>
              <UserAvatar
                onclick={goToUserProfile}
                uri={relatedUser?.profilePicture}
                size={44}
              />
            </View>
            <TouchableOpacity
              style={styles.textHolder}
              onPress={handleNavigation}>
              <HighlightText
                style={styles.eventDescriptionText}
                highlightStyle={styles.eventDescriptionName}
                searchWords={[relatedUser?.name]}
                textToHighlight={readableEvent}
              />
              {relatedUser?.location && [
                <Text
                  style={styles.eventMetaInformationText}
                  key="metaInformation">
                  {/* {' • ' + getFormattedDate()} */}
                  {getFormattedDate()}
                </Text>,
              ]}
            </TouchableOpacity>
            <View style={styles.actionContainer}>
              {roomExpired ? (
                <View style={styles.timeUpIconContainer}>
                  <TimeUpIcon />
                </View>
              ) : (
                <View style={styles.couchIconContainer}>
                  <CouchIcon color={Globals.color.background.light} />
                </View>
              )}
            </View>
          </View>
        </View>
      );
    }

    function compileDirectChatType() {
      return (
        <View style={styles.notificationWrapper}>
          <View style={styles.innerContainer}>
            <View style={styles.avatarShadow}>
              <UserAvatar
                onclick={goToUserProfile}
                uri={relatedUser?.profilePicture}
                size={44}
              />
            </View>
            <TouchableOpacity
              style={styles.textHolder}
              onPress={handleNavigation}>
              <HighlightText
                style={styles.eventDescriptionText}
                highlightStyle={styles.eventDescriptionName}
                searchWords={[relatedUser?.name]}
                textToHighlight={readableEvent}
              />
              {relatedUser?.location && [
                <Text
                  style={styles.eventMetaInformationText}
                  key="metaInformation">
                  {/* {' • ' + getFormattedDate()} */}
                  {getFormattedDate()}
                </Text>,
              ]}
            </TouchableOpacity>
            <View style={styles.actionContainer}>
              <ReactionIcon color={Globals.color.background.grey} size={25} />
            </View>
          </View>
        </View>
      );
    }

    switch (type) {
      case NOTIFICATION_TYPE_PAPERPLANE_UPVOTE:
      case TYPE_GREETINGS:
      case TYPE_FRIENDSHIP_REQUEST_APPROVED:
        return compileOtherTypes();
      case TYPE_NEW_FRIENDSHIP_REQUEST:
        return compileFriendshipRequest();
      case TYPE_CHAT_ROOM_CREATED:
      case TYPE_ROOM_ABOUT_TO_EXPIRE:
      case TYPE_CHAT_ROOM_EXTENDED:
      case TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED:
        return compileRoomType();
      case TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED:
        return compileDirectChatType();
    }
  }, []);

  return <View style={{ overflow: 'visible' }}>{checkNotificationType}</View>;
}

const styles = StyleSheet.create({
  notificationWrapper: {
    backgroundColor: Globals.color.background.light,
    paddingVertical: Globals.dimension.padding.tiny,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  avatarShadow: {
    flexDirection: 'row',
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    width: 44,
    height: 44,
    elevation: 15,
  },
  newNotifcation: {
    position: 'absolute',
    left: -3,
    top: -3,
    width: 10,
    height: 10,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    shadowColor: Globals.color.brand.primary,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    right: 12,
  },
  textHolder: {
    marginLeft: Globals.dimension.margin.tiny,
    flex: 4,
    top: -4,
    alignContent: 'center',
  },
  eventDescriptionName: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginBottom: Globals.dimension.margin.tiny,
  },
  eventDescriptionText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
  eventMetaInformationText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
  },
  actionContainer: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: Globals.dimension.margin.tiny,
  },
  thumbnailHolder: {
    width: 45,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Globals.dimension.borderRadius.mini * 0.6,
    backgroundColor: Globals.color.background.light,
    elevation: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  thumbnailWrapper: {
    width: 45,
    height: 45,
    borderRadius: Globals.dimension.borderRadius.mini * 0.6,
    overflow: 'hidden',
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  likeContainer: {
    width: '100%',
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  likeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: Globals.color.brand.primary,
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    left: -5,
    bottom: -5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  replyLikeIndicator: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: Globals.color.background.light,
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    left: -5,
    bottom: -5,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  replyIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: '#025AFE',
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    left: -5,
    bottom: -5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  replytoReplyIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: Globals.color.background.light,
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    left: -5,
    bottom: -5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  replyIcon: {
    width: 11,
    height: 11,
  },
  followingButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Globals.color.background.light,
  },
  followUserIcon: {
    width: 32,
    height: 35,
    top: 3,
    left: -3,
  },
  reportIconContainer: {
    width: 44,
    height: 44,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowColor: Globals.color.background.dark,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportNotifImage: {
    width: 44,
    height: 44,
    borderWidth: 2,
    borderRadius: 100,
    borderColor: Globals.color.background.light,
  },
  reportNotifConatainer: {
    flex: 1,
    marginLeft: Globals.dimension.margin.tiny,
  },
  acceptRejectContainer: {
    flexDirection: 'row',
    marginLeft: Globals.dimension.margin.tiny,
  },
  acceptButton: {
    height: 30,
    paddingHorizontal: Globals.dimension.padding.mini,
    backgroundColor: Globals.color.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Globals.dimension.margin.mini,
    borderRadius: 100,
  },
  rejectButton: {
    height: 30,
    aspectRatio: 1,
    paddingHorizontal: Globals.dimension.padding.mini,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  acceptTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  timeUpIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  couchIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  directChatIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.brand.accent3,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
