import React, { useEffect, useRef } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import RNNotificationPopup from 'react-native-push-notification-popup';
import { connect } from 'react-redux';
import NotificationPopupSlice, {
  notificationPopupProps,
} from '../store/slices/NotificationPopupSlice';
import Globals from './Globals';
import { PaperPlaneInterface } from '../services/api/PaperPlaneManager';
import NavigationService from '../services/utility/NavigationService';
import {
  NOTIFICATION_TYPE_PAPERPLANE_UPVOTE,
  TYPE_SOMEONE_FOLLOWED,
  TYPE_REPLY_UPVOTE,
  TYPE_CHAT_ROOM_CREATED,
  TYPE_CHAT_ROOM_MESSAGE_REPLY,
  TYPE_CHAT_ROOM_NEW_MEMBER,
  TYPE_CHAT_ROOM_NEW_MESSAGE,
  TYPE_NEW_FRIENDSHIP_REQUEST,
  TYPE_FRIENDSHIP_REQUEST_APPROVED,
  TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED,
  TYPE_CHAT_ROOM_EXTENSION_ALLOWED,
  TYPE_CHAT_ROOM_EXTENDED,
  TYPE_CHAT_ROOM_APPROVED,
  TYPE_CHAT_ROOM_REJECTED,
  TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED,
  TYPE_PAPER_PLANE_REACTION_CREATED,
  TYPE_DIRECT_CHAT_MESSAGE_CREATED,
} from '../services/api/PushNotificationSubscriber';
import { icon } from './graphics/Images';
import NotificationsManager from '../services/api/NotificationsManager';
import ChatRoomManager from '../services/api/ChatRoomManager';
import FriendshipManager from '../services/api/FriendshipManager';
import DirectChatsManager from '../services/api/DirectChatsManager';
import NotificationPopupHelper from '../services/utility/NotificationPopupHelper';

export interface NotificationPopupDataInterface {
  comment: any;
  createdAt: any;
  delivery: any;
  id: number;
  paperPlane: PaperPlaneInterface;
  readableEvent: string;
  relatedUser: any;
  reply: any;
  seenAt: string;
  type: number;
  chat_room?: {
    id: number;
  };
}

function NotificationPopup(props) {
  const popup = useRef();
  const { current } = props.notificationPopup;
  // const state = useNavigationState(state => state);

  useEffect(() => {
    async function navigateToPaperPlaneDetails() {
      const { current } = props.notificationPopup;
      switch (current?.type) {
        case NOTIFICATION_TYPE_PAPERPLANE_UPVOTE:
          NavigationService.navigate('PaperPlaneDetailsScreen', {
            item: current.paperPlane,
            returnRoute: 'NotificationsScreen',
          });
          break;
        case TYPE_REPLY_UPVOTE:
        case TYPE_SOMEONE_FOLLOWED:
          NavigationService.navigate('UsersProfileScreen', {
            payload: {
              paperPlane: { author: { id: current.relatedUser.id } },
              relatedUser: current.relatedUser,
            },
          });
          break;
        case TYPE_CHAT_ROOM_CREATED:
        case TYPE_CHAT_ROOM_MESSAGE_REPLY:
        case TYPE_CHAT_ROOM_NEW_MEMBER:
        case TYPE_CHAT_ROOM_NEW_MESSAGE:
        case TYPE_CHAT_ROOM_MESSAGE_REACTION_CREATED:
        case TYPE_CHAT_ROOM_EXTENSION_ALLOWED:
        case TYPE_CHAT_ROOM_EXTENDED:
        case TYPE_CHAT_ROOM_APPROVED:
          ChatRoomManager.navigateToChatRoomScreen(current.chat_room.id);
          break;
        case TYPE_CHAT_ROOM_REJECTED:
          ChatRoomManager.getRoomsListAsync();
          break;
        case TYPE_NEW_FRIENDSHIP_REQUEST:
          NavigationService.navigate('NewsScreen', {});
          break;
        case TYPE_FRIENDSHIP_REQUEST_APPROVED:
          FriendshipManager.getFriendsList();
          NavigationService.navigate('FriendsScreen', {});
          break;
        case TYPE_PAPER_PLANE_REACTION_CREATED:
          NavigationService.navigate('DirectRoomsScreen', {});
          break;
        case TYPE_DIRECT_CHAT_MESSAGE_CREATED:
        case TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED:
          DirectChatsManager.findAndNavigateToDirectChat(
            current?.direct_chat?.id,
          );
          break;
      }
      markNotificationAsSeen(current.id);
    }

    function hideNotificationInChatRoom() {
      switch (current?.type) {
        case TYPE_CHAT_ROOM_CREATED:
        case TYPE_CHAT_ROOM_MESSAGE_REPLY:
        case TYPE_CHAT_ROOM_NEW_MEMBER:
        case TYPE_CHAT_ROOM_NEW_MESSAGE:
          props.hide();
          break;
        default:
          toggleNotification();
      }
    }

    function hideNotificationInDirectChats() {
      switch (current?.type) {
        case TYPE_DIRECT_CHAT_MESSAGE_REACTION_CREATED:
        case TYPE_PAPER_PLANE_REACTION_CREATED:
        case TYPE_DIRECT_CHAT_MESSAGE_CREATED:
          props.hide();
          break;
        default:
          toggleNotification();
      }
    }

    function toggleNotification() {
      popup.current.show({
        onPress: navigateToPaperPlaneDetails,
        slideOutTime: 4000,
      });
      setTimeout(() => NotificationPopupHelper.hide(), 4000);
    }

    function show() {
      const currentRoute = NavigationService.getNavigatorRef().current?.getCurrentRoute();
      const condition1 = currentRoute?.name === 'ChatRoom';
      const condition2 =
        currentRoute?.name === 'DirectChatRoomScreen' ||
        currentRoute?.name === 'DirectRoomsScreen';
      if (condition1) {
        hideNotificationInChatRoom();
        return;
      }
      if (condition2) {
        hideNotificationInDirectChats();
        return;
      }
      toggleNotification();
    }
    if (props.notificationPopup.visible) show();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, props.notificationPopup.visible]);

  function markNotificationAsSeen(id?: number) {
    NotificationsManager.markNotitificationAsSeen(id);
    NotificationPopupHelper.hide();
  }

  return (
    <View style={styles.popupContainer}>
      <RNNotificationPopup
        ref={popup}
        renderPopupContent={() => (
          <View style={styles.popupContentContainer}>
            <View style={styles.popupHeaderContainer}>
              <View style={styles.headerIconContainer}>
                <Image style={styles.headerIcon} source={icon} />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText} numberOfLines={1}>
                  YOUPENDO
                </Text>
              </View>
              <View style={styles.headerTimeContainer}>
                <Text style={styles.headerTime} numberOfLines={1}>
                  Now
                </Text>
              </View>
            </View>
            <View style={styles.contentContainer}>
              <View style={styles.contentTextContainer}>
                <Text style={styles.contentText}>
                  {current?.readableEvent || ''}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

export default connect(
  notificationPopupProps,
  NotificationPopupSlice.actions,
)(NotificationPopup);

const styles = StyleSheet.create({
  popupContainer: {
    position: 'absolute',
  },
  popupContentContainer: {
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.borderRadius.mini,
    elevation: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
  },
  popupHeaderContainer: {
    borderTopLeftRadius: Globals.dimension.borderRadius.mini,
    borderTopRightRadius: Globals.dimension.borderRadius.mini,
    paddingTop: Globals.dimension.padding.mini,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconContainer: {
    height: 20,
    width: 20,
    marginLeft: Globals.dimension.margin.mini,
    marginRight: Globals.dimension.margin.tiny,
    borderRadius: 4,
  },
  headerIcon: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.lightgrey,
  },
  headerTimeContainer: {
    marginHorizontal: Globals.dimension.margin.mini,
  },
  headerTime: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
  contentContainer: {
    width: '100%',
    paddingBottom: Globals.dimension.padding.mini,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  contentTextContainer: {},
  contentText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginTop: Globals.dimension.margin.tiny,
  },
});
