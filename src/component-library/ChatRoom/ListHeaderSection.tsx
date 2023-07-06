import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import Globals from './../Globals';
import { ChatRoomInterface } from '../../services/api/ChatRoomManager';
import { UserProfileState } from '../../store/slices/UserProfileSlice';
import VoteOnPoll from '../Poll/VoteOnPoll';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';
import UserAvatar from '../UserAvatar';

interface Props {
  currentRoom: ChatRoomInterface;
  userProfile: UserProfileState;
  hasPreviousMessages: boolean;
  previousRoute: any;
  expiredRoom: boolean;
  link: boolean;
  onPress: () => void;
  directChatroom: boolean;
}

export default function ListHeaderSection(props: Props) {
  const emojiFlags = require('emoji-flags');
  const {
    currentRoom,
    previousRoute,
    userProfile,
    hasPreviousMessages,
    expiredRoom,
    onPress,
    directChatroom,
  } = props;

  function renderCopyLinkBox() {
    return (
      <HapticFeedBackWrapper onPress={() => onPress()}>
        <View style={styles.linkButtonContainer}>
          <Text style={styles.link}>Share Link</Text>
        </View>
      </HapticFeedBackWrapper>
    );
  }

  function renderDirectChatroomHeader() {
    const {
      location,
      profilePicture,
      friends_count,
      mutual_friends_count,
      age,
    } = currentRoom?.sender;
    const boldStyle = { fontFamily: Globals.font.family.bold };
    return (
      <View style={styles.directHeaderContainer}>
        <View style={styles.directAvatarContainer}>
          <UserAvatar uri={profilePicture} size={38} disableShaddow={false} />
        </View>

        <Text style={styles.userDescription}>
          {location?.country_code
            ? emojiFlags.countryCode(location?.country_code).emoji
            : '📍'}{' '}
          They are from{' '}
          <Text style={boldStyle}>
            {location?.city}
            {location?.city ? ', ' : ' '}
            {location?.country}
          </Text>
        </Text>
        {age ? (
          <Text style={styles.userDescription}>
            🎂 They are <Text style={boldStyle}>{age}</Text>
          </Text>
        ) : null}
        {friends_count > 0 ? (
          <Text style={styles.mutualFriend}>
            {friends_count} {friends_count === 1 ? 'friend' : 'friends'} on
            Youpendo{' '}
            {mutual_friends_count > 0
              ? `(${mutual_friends_count} mutual)`
              : null}
          </Text>
        ) : null}
      </View>
    );
  }

  function renderOtherTypesHeader() {
    return (
      <View style={{ flex: 1 }}>
        {!currentRoom.is_onboarding ? (
          <Text style={styles.headerTime}>
            Rooms get deleted after 24 hours
          </Text>
        ) : null}

        <Text style={styles.chatTitle}>{currentRoom.title}</Text>
        {currentRoom.votes?.length > 0 ? (
          <VoteOnPoll
            data={currentRoom.votes}
            roomId={currentRoom.id}
            color_1={currentRoom.color_1}
            color_2={currentRoom.color_2}
            hasVoted={currentRoom.is_voted || expiredRoom}
          />
        ) : null}
        {userProfile.id === currentRoom.app_user.id &&
        previousRoute === 'CreateRoom' ? (
          <View style={styles.welcomeContainer}>
            <Text style={styles.welcome}>Invite your friends 👋</Text>
            <Text style={styles.welcomeDescription}>
              Share this link with friends and they’ll automatically join your
              room.
            </Text>
            {renderCopyLinkBox()}
          </View>
        ) : null}

        {hasPreviousMessages ? <ActivityIndicator /> : null}
      </View>
    );
  }

  if (currentRoom) {
    if (directChatroom) {
      return renderDirectChatroomHeader();
    } else {
      return renderOtherTypesHeader();
    }
  }
  return null;
}

const styles = StyleSheet.create({
  headerTime: {
    textAlign: 'center',
    fontSize: Globals.font.size.xTiny,
    color: Globals.color.text.lightgrey,
    fontFamily: Globals.font.family.semibold,
  },
  chatTitle: {
    fontSize: 25,
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    paddingHorizontal: Globals.dimension.padding.medium,
    paddingVertical: Globals.dimension.padding.mini,
    lineHeight: 30,
  },
  welcomeContainer: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.tiny,
    paddingVertical: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.mini,
    marginVertical: Globals.dimension.margin.mini,
  },
  welcome: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  welcomeDescription: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
  },
  linkButtonContainer: {
    flex: 1,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny * 0.5,
    paddingHorizontal: Globals.dimension.padding.tiny,
    backgroundColor: Globals.color.button.blue,
    marginVertical: Globals.dimension.margin.tiny,
  },
  link: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  directHeaderContainer: {
    flex: 1,
    borderColor: Globals.color.background.mediumLightgrey,
    borderWidth: 1,
    borderRadius: Globals.dimension.borderRadius.mini,
    width: '80%',
    padding: Globals.dimension.padding.mini,
    marginLeft: Globals.dimension.margin.mini,
    marginBottom: Globals.dimension.margin.tiny,
  },
  directAvatarContainer: {
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
  userDescription: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  mutualFriend: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginTop: Globals.dimension.margin.tiny,
  },
});
