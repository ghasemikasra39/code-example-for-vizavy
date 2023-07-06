import React, { useState } from 'react';
import moment from 'moment';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import Globals from './Globals';
import UserAvatar from './UserAvatar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import CloseIcon from './graphics/Icons/CloseIcon';
import FriendshipManager from '../services/api/FriendshipManager';

moment.updateLocale('en', Globals.format.dateAndTime);

interface friendshipUserInterface {
  internal_id: number;
  id: string;
  name: string;
  profilePicture: string;
  email: string;
  createdAt: string;
  location: {
    city: string;
    country: string;
    country_code: string;
  };
}

interface Props {
  requestId: number;
  user: friendshipUserInterface;
  requestCreateAt: string;
}

export default function FriendRequestListItem(props: Props) {
  const { requestId, user, requestCreateAt } = props;
  const emojiFlags = require('emoji-flags');
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  function goToUserProfile() {
    navigation.navigate('UsersProfileScreen', {
      relatedUser: user,
      paperPlane: null,
    });
  }

  async function respondFriendshipRequest(accept: boolean) {
    setLoading(true);
    if (accept) {
      FriendshipManager.acceptFriendshipRequests(requestId).then(
        responseHanlder,
      );
    } else {
      FriendshipManager.rejectFriendship(requestId).then(responseHanlder);
    }
    function responseHanlder() {
      setLoading(false);
    }
  }

  function getFormattedDate() {
    return moment(requestCreateAt).fromNow(true);
  }

  function renderAcceptButton() {
    return (
      <TouchableOpacity
        style={styles.acceptButtonContainer}
        onPress={() => respondFriendshipRequest(true)}>
        <Text style={styles.accept}>Accept</Text>
      </TouchableOpacity>
    );
  }

  function renderRejectButton() {
    return (
      <TouchableOpacity
        style={styles.rejectButtonContainer}
        onPress={() => respondFriendshipRequest(false)}>
        <CloseIcon size={12} color={Globals.color.text.grey} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.notificationWrapper}>
      <View style={styles.innerContainer}>
        <View style={styles.avatarShadow}>
          <UserAvatar
            onclick={goToUserProfile}
            uri={user?.profilePicture}
            size={44}
          />
        </View>

        <View style={styles.textHolder}>
          <Text style={styles.name}>
            {user?.name}{' '}
            {user?.location?.country_code
              ? emojiFlags.countryCode(user?.location?.country_code).emoji
              : null}
          </Text>
          <Text style={styles.eventMetaInformationLocation} numberOfLines={1}>
            {user?.location?.city ? user.location.city : null}
            {', '}
            {user?.location?.country ? user.location.country : null}
          </Text>
          <Text style={styles.eventMetaInformationText}>
            {getFormattedDate()}
          </Text>
        </View>
        {!loading ? (
          <View style={styles.actionContainer}>
            {renderAcceptButton()}
            {renderRejectButton()}
          </View>
        ) : (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        )}
      </View>
    </View>
  );
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
    width: 15,
    height: 15,
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
    flex: 1,
    alignContent: 'center',
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    lineHeight: Globals.font.size.large,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny * 0.2,
  },
  eventMetaInformationLocation: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
  eventMetaInformationText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    marginBottom: Globals.dimension.margin.tiny * 0.2,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 0.2,
  },
  acceptButtonContainer: {
    height: 30,
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: 100,
    backgroundColor: Globals.color.brand.primary,
    marginHorizontal: Globals.dimension.margin.tiny,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButtonContainer: {
    height: 30,
    aspectRatio: 1,
    padding: Globals.dimension.padding.tiny,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
    marginHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accept: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
});
