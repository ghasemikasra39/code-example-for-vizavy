import React, {useMemo} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Globals from '../Globals';
import {LinearGradient} from 'expo-linear-gradient';
import UserAvatar from '../UserAvatar';
import {useNavigation} from '@react-navigation/native';
import AvatarList from '../AvatarList';
import Shimmer from 'react-native-shimmer';
import {getTimeDifference} from '../../screens/ChatRoom/ChatroomUtils';
import LockIcon from '../graphics/Icons/LockIcon';
import StopIcon from '../graphics/Icons/StopIcon';
import PollIcon from '../graphics/Icons/PollIcon';
import NewMessageIcon from '../graphics/Icons/NewMessageIcon';
import WorldIcon from '../graphics/Icons/WorldIcon';

interface Props {
  room: any;
  index: number;
  userProfile: Object;
  showFirstRoomShimmer: boolean;
  markFirstRoomAsOpened: () => void;
  today?: boolean;
}

export default function RoomItem(props: Props) {
  const navigation = useNavigation();
  const {room, index, userProfile, today} = props;

  /**
   * Calculates how much time is remaining until the room gets deleted
   * @function calculateTimeRemaining
   * @param {timeCreated : any} - Set the time when the room was first created
   */
  function calculateTimeRemaining(timeCreated: any) {
    if (!today) return;
    const extentedExpirationTime = room.is_extended ? 24 : 0;
    const remainingTime =
      getTimeDifference(timeCreated, 'asHours') + extentedExpirationTime;
    return remainingTime;
  }

  /**
   * Navigates the user to the specific chatRoom
   * @function goToRoom
   * @param {room : any} - room object
   */
  function goToRoom(room: any) {
    const {showFirstRoomShimmer, today} = props;
    navigation.navigate('ChatRoom', {room, today});
    if (showFirstRoomShimmer) {
      props.markFirstRoomAsOpened();
    }
  }

  /**
   * Navigate to userProfile
   * @function goToUserProfile
   */
  function goToUserProfile() {
    if (userProfile.id === room.app_user.id) {
      navigation.push('MyProfileScreen', {
        userProfile,
      });
    } else {
      navigation.push('UsersProfileScreen', {
        paperPlane: {author: {id: room.app_user.id}},
        relatedUser: room.app_user,
      });
    }
  }

  const renderRoomItem = useMemo(() => {
    const {is_onboarding, approved_at, is_public, is_rejected} = props.room;
    const {profilePicture, name, location} = room.app_user;
    const {city, country} = location;

    const NewMessageCount =
      room.new_message_count > 0 ? (
        <View style={styles.newMessageCountContainer}>
          <NewMessageIcon style={styles.newMessageIcon}/>
          <Text style={styles.newMessageCount}>
            {' '}
            {room.new_message_count}{' '}
            {room.new_message_count === 1 ? 'New Message' : 'New Messages'}
          </Text>
        </View>
      ) : null;
    const PoolIcon = props.room.votes.length ? <PollIcon/> : null;

    function getRemainingTime() {
      if (is_onboarding) return null;
      if (approved_at !== null) {
        return (
          <Text style={styles.timeRemaining}>
            {calculateTimeRemaining(room?.approved_at)}
            {today ? 'h remaining' : 'Expired'}
          </Text>
        );
      }
      if (!is_rejected) {
        return <StopIcon style={styles.notApprovedIcon}/>;
      } else {
        return <Text style={styles.timeRemaining}>🔜</Text>;
      }
    }

    const Location = `${city}${city ? ', ' : null}${country}`;

    const lockIcon = (
      <View style={styles.unlockIconContainer}>
        {is_public ? (
          <WorldIcon color={room.color_1}/>
        ) : (
          <LockIcon color={room.color_1} size={13}/>
        )}
      </View>
    );

    function renderRoomHolderContainer() {
      return (
        <View style={styles.roomWrapper}>
          <UserAvatar
            uri={profilePicture}
            size={40}
            onclick={goToUserProfile}
          />
          <View style={styles.newRoomTextWrapper}>
            <Text style={styles.newRoom} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.startConversation} numberOfLines={1}>
              {Location}
            </Text>
          </View>
          {getRemainingTime()}
        </View>
      );
    }

    function renderRoomNotApprovedContainer() {
      if (is_onboarding) return null;
      if (approved_at !== null) return;
      return is_rejected ? (
        <View style={styles.notApprovedContainer}>
          <View style={styles.moderationSeperator}/>
          <View style={styles.modaterationDescriptionContainer}>
            <Text style={styles.modaterationTitle}>
              Sorry, this room has been removed by our moderators.
            </Text>
            <Text style={styles.modaterationDescription}>
              Moderators remove rooms for a variety of reasons, including
              keeping the community safe and civil.
            </Text>
          </View>
        </View>
      ) : (
        <Text style={styles.modaterationDescription} numberOfLines={1}>
          Your room will be online and visible for others soon 😊
        </Text>
      );
    }

    function renderDescriptionContainer() {
      return (
        <View style={styles.descriptionConatiner}>
          <Text style={styles.description}>{room.title}</Text>
          {PoolIcon}
          {NewMessageCount}
          {renderRoomNotApprovedContainer()}
        </View>
      );
    }

    function renderColorContainer() {
      return (
        <View style={styles.gradientContainer}>
          <Shimmer
            style={styles.shimmer}
            opacity={0.3}
            animating={props.showFirstRoomShimmer}>
            <LinearGradient
              style={styles.gradientBackground}
              colors={[room.color_1, room.color_2]}>
              {lockIcon}
              <AvatarList data={room.members}/>
              <View style={styles.joinButton}>
                <Text style={styles.join}>Join</Text>
              </View>
            </LinearGradient>
          </Shimmer>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.createRoomContainer}
        activeOpacity={0.5}
        onPress={() => goToRoom(room)}>
        {renderRoomHolderContainer()}
        {renderDescriptionContainer()}
        {renderColorContainer()}
      </TouchableOpacity>
    );
  }, [
    calculateTimeRemaining,
    index,
    navigation,
    props.room,
    props.showFirstRoomShimmer,
  ]);

  return renderRoomItem;
}

const styles = StyleSheet.create({
  createRoomContainer: {
    width: '93%',
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.borderRadius.mini,
    justifyContent: 'center',
    paddingTop: Globals.dimension.margin.mini,
    marginVertical: Globals.dimension.margin.tiny,
    elevation: Globals.shadows.shading1.elevation,
    shadowOffset: Globals.shadows.shading1.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
    alignSelf: 'center',
  },
  createRoomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Globals.dimension.margin.mini,
    paddingBottom: Globals.dimension.padding.mini,
  },
  roomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Globals.dimension.margin.mini,
  },
  newRoomTextWrapper: {
    marginLeft: Globals.dimension.margin.tiny,
    height: 35,
    justifyContent: 'space-between',
  },
  descriptionConatiner: {
    marginHorizontal: Globals.dimension.margin.mini,
    paddingVertical: Globals.dimension.padding.tiny,
  },
  description: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  newRoom: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    fontSize: Globals.font.size.medium,
    paddingRight: Globals.dimension.padding.large,
  },
  startConversation: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.tiny,
    paddingRight: Globals.dimension.padding.large,
  },
  timeRemaining: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.xTiny,
    position: 'absolute',
    top: -5,
    right: 0,
  },
  roomIconContainer: {
    borderRadius: 100,
    shadowColor: Globals.color.brand.primary,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
  },
  gradientContainer: {
    width: '100%',
    borderBottomEndRadius: Globals.dimension.borderRadius.mini,
    borderBottomStartRadius: Globals.dimension.borderRadius.mini,
    overflow: 'hidden',
  },
  shimmer: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    marginTop: Globals.dimension.margin.tiny,
    alignItems: 'center',
  },
  gradientBackground: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
    alignItems: 'center',
  },
  membersContainer: {
    marginHorizontal: Globals.dimension.margin.mini,
  },
  joinButton: {
    width: 50,
    height: 20,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  join: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.grey,
  },
  memberCount: {
    height: 30,
    paddingHorizontal: 8,
    right: 25,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pollIcon: {
    marginTop: Globals.dimension.margin.tiny,
  },
  newMessageCount: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.xTiny,
    lineHeight: Globals.font.lineHeight.small,
  },
  newMessageCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Globals.dimension.margin.tiny,
  },
  messageIcon: {
    width: 17,
    height: 16,
    marginRight: Globals.dimension.margin.tiny * 0.5,
  },
  notApprovedContainer: {
    width: '100%',
    flexDirection: 'row',
    borderRadius: Globals.dimension.borderRadius.tiny,
    borderWidth: 1,
    borderColor: Globals.color.background.grey,
    marginTop: Globals.dimension.margin.tiny,
  },
  moderationSeperator: {
    height: '100%',
    width: 5,
    borderTopLeftRadius: Globals.dimension.borderRadius.tiny,
    borderBottomLeftRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: Globals.color.background.grey,
  },
  modaterationDescriptionContainer: {
    paddingVertical: Globals.dimension.padding.tiny * 0.5,
    paddingHorizontal: Globals.dimension.padding.tiny,
  },
  modaterationTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.default,
  },
  modaterationDescription: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.xTiny,
    color: Globals.color.text.grey,
  },
  notApprovedIcon: {
    width: 19,
    height: 23,
    position: 'absolute',
    right: 0,
    top: -6,
  },
  unlockIconContainer: {
    backgroundColor: Globals.color.background.light,
    width: 30,
    aspectRatio: 1,
    borderRadius: Globals.dimension.borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Globals.dimension.margin.tiny,
  },
  newMessageIcon: {
    marginRight: Globals.dimension.margin.tiny * 0.5,
  },
});
