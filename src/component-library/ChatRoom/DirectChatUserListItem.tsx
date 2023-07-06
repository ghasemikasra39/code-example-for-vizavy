import React, {useMemo} from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Globals from '../Globals';
import UserAvatar from '../UserAvatar';
import moment from 'moment';
import { UserProfileStatePropsInterface } from '../../store/slices/UserProfileSlice';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  item: Object;
  navigation: any;
  userProfile: UserProfileStatePropsInterface;
}

export default function DirectChatUserListItem(props: Props) {
  const { item, navigation, userProfile } = props;
  const otherUser = getOtherUser();
  const showBlueDot = shouldShowBlueDot();

  function getOtherUser() {
    const { sender, receiver } = item;
    if (sender?.id === userProfile?.id) {
      return receiver;
    }
    return sender;
  }

  function shouldShowBlueDot() {
    return item.new_message_count !== null && item.new_message_count > 0;
  }

  function navigateToChat() {
    navigation.navigate('DirectChatRoomScreen', { room: item, today: true });
  }

  function goToUserProfile() {
    navigation.navigate('UsersProfileScreen', {
      paperPlane: { author: { id: otherUser?.id } },
      relatedUser: otherUser,
    });
  }

  const getFormattedDate = (created_at) => {
    const oneMinute = 60;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;
    const now = moment().format();

    const diffInSeconds = moment(now).diff(created_at, 'seconds');

    if (diffInSeconds < oneMinute) {
      return 'now';
    } else if (diffInSeconds < oneHour) {
      return `${Math.round(diffInSeconds / oneMinute)}min`;
    } else if (diffInSeconds < oneDay) {
      return `${Math.round(diffInSeconds / oneHour)}h`;
    } else {
      return moment(created_at).format('D MMM');
    }
  };

  const compileMessageTitle = (item) => {
    const { last_message } = item;
    let type = '';

    if (item.new_message_count !== null && item.new_message_count > 1) {
      type = 'moreThanOneMessage';
    } else if (
      last_message.paper_plane !== null &&
      last_message.paper_plane !== undefined
    ) {
      type = 'pp';
    } else if (last_message.media_url && last_message.media_type === 1) {
      type = 'audio';
    } else {
      type = 'text';
    }

    function compileTextStyle() {
      let textStyle = styles.message;
      if (viaLoggedInUser) {
        textStyle = {
          ...textStyle,
          color: Globals.color.text.grey,
        };
      } else if (item.new_message_count > 0) {
        textStyle = {
          ...textStyle,
          color: Globals.color.text.default,
          fontFamily: Globals.font.family.bold,
        };
      } else {
        textStyle = {
          ...textStyle,
          color: Globals.color.text.grey,
        };
      }
      return textStyle;
    }

    const viaLoggedInUser = last_message.app_user.id == props.userProfile.id;
    const itemText = last_message.message;
    const maxlimit = 30;
    let color = null;

    switch (type) {
      case 'audio':
        return (
          <Text style={compileTextStyle()} numberOfLines={1}>
            {viaLoggedInUser
              ? 'You sent a voice message'
              : 'Sent a voice message'}
          </Text>
        );
      case 'text':
        return (
          <Text style={compileTextStyle()} numberOfLines={1}>
            {itemText.length > maxlimit
              ? itemText.substring(0, maxlimit - 3) + '...'
              : itemText}
          </Text>
        );
      case 'pp':
        return (
          <Text style={compileTextStyle()} numberOfLines={1}>
            {viaLoggedInUser
              ? 'You replied to their paper plane'
              : 'Replied to your paper plane'}
          </Text>
        );
      case 'moreThanOneMessage':
        return (
          <Text style={compileTextStyle()} numberOfLines={1}>
            {item.new_message_count} new messages
          </Text>
        );
    }
  };

  function renderNewMessageDot() {
    return showBlueDot ? (
      <View style={styles.newMessageContainer}>
        <LinearGradient
          style={styles.newMessageGradient}
          colors={Globals.gradients.primary}
        />
      </View>
    ) : null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <UserAvatar
          onclick={goToUserProfile}
          uri={otherUser.profilePicture}
          size={60}
        />
      </View>
      <TouchableOpacity
        style={styles.descriptionContainer}
        onPress={navigateToChat}>
        <Text style={styles.name} numberOfLines={1}>
          {otherUser?.name}
        </Text>
        {compileMessageTitle(item)}
        <Text style={styles.time}>
          {getFormattedDate(item.last_message.created_at)}
        </Text>
      </TouchableOpacity>
      {renderNewMessageDot()}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
    marginBottom: Globals.dimension.margin.tiny,
  },
  avatarContainer: {
    marginRight: Globals.dimension.margin.mini,
  },
  descriptionContainer: {
    flex: 1,
    paddingRight: Globals.dimension.padding.mini,
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  message: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    marginTop: Globals.dimension.margin.tiny * 0.5,
  },
  time: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.xTiny,
    color: Globals.color.text.grey,
    marginTop: Globals.dimension.margin.tiny * 0.5,
  },
  newMessageContainer: {
    width: 12,
    aspectRatio: 1,
    borderRadius: 100,
    overflow: 'hidden',
  },
  newMessageGradient: {
    width: '100%',
    height: '100%',
  },
});
