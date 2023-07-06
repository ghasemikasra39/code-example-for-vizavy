import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import Globals from '../../component-library/Globals';
import UserAvatar from '../../component-library/UserAvatar';
import MixPanelClient, {
  WELCOME_REFERRAL_SCREEN,
} from '../../services/utility/MixPanelClient';

interface Props {
  invitee: Object;
  inviter: Object;
}

export default function InvitedThroughFriendComponent(props: Props) {
  const { inviter } = props;
  useEffect(() => {
    MixPanelClient.trackEvent(WELCOME_REFERRAL_SCREEN);
  }, []);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}> Welcome to Youpendo</Text>
      <View style={styles.avatarContainer}>
        <UserAvatar size={120} uri={inviter?.profilePicture} />
      </View>
      {inviter?.name ? (
        <Text style={styles.inviter} numberOfLines={1}>
          {inviter?.name}
        </Text>
      ) : null}

      <Text style={styles.description}>
        "This app granted me one invite to share with a special friend. I’m
        grateful to have a friend like you and think you’ll enjoy Youpendo."
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
    marginBottom: Globals.dimension.margin.mini,
    textAlign: 'center',
  },
  description: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
    textAlign: 'center',
  },
  inviter: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
    textAlign: 'center',
  },
  avatarContainer: {
    marginBottom: Globals.dimension.margin.mini,
  },
});
