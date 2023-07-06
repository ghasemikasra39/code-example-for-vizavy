import React, { useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { connect } from 'react-redux';
import Globals from './Globals';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';
import SearchIcon from './graphics/Icons/SearchIcon';
import HeartIcon from './graphics/Icons/HeartIcon';
import ShareInviteIcon from './graphics/Icons/ShareInviteIcon';
import { store } from '../store';
import { actionCreators } from '../store/actions';
import MixPanelClient, {
  CLICK_INVITE,
} from '../services/utility/MixPanelClient';
import MessageIcon from './graphics/Icons/MessageIcon';
import NotificationButton from './graphics/Navigation/NotificationButton';

const mapStateToProps = ({ referrals, appStatus, directChat }) => ({
  referrals,
  appStatus,
  directChat,
});

interface Props {
  title: string;
}

function SearchHeader(props) {
  const { title, referrals, appStatus, directChat } = props;
  const { referral_invites } = referrals;
  const { inviteFriendPopUpSeen } = appStatus;
  const navigation = useNavigation();

  function navigateTo(screen: string) {
    navigation.navigate(screen, {});
    if (screen === 'Invite') {
      markInviteFriendBoxSeen();
    }
  }

  function markInviteFriendBoxSeen() {
    MixPanelClient.trackEvent(CLICK_INVITE);
    const action = actionCreators.appStatus.setInviteFriendPopUpSeen(true);
    store.dispatch(action);
  }

  function compileTextStyle() {
    let textStyle = styles.title;
    if (title === 'Discover') {
      textStyle = {
        ...textStyle,
        color: Globals.color.text.light,
      };
    }
    return textStyle;
  }

  function compileColor() {
    if (title === 'Discover') {
      return Globals.color.text.light;
    }
    return Globals.color.text.grey;
  }

  const renderNewMessageCount = useMemo(() => {
    const { directChatList } = directChat;
    let total_new_message_count = 0;
    directChatList.forEach((directChat) => {
      total_new_message_count += directChat.new_message_count;
    });

    return total_new_message_count > 0 ? (
      <View style={styles.dotContainer}>
        <Text style={styles.count}>{total_new_message_count}</Text>
      </View>
    ) : null;
  }, [directChat.directChatList]);

  const renderInviteBox = useMemo(() => {
    const referralListLength = referral_invites?.length;
    const origin = referral_invites[referralListLength - 1]?.origin;

    function getExplainerMessage() {
      switch (origin) {
        case 2:
          return `Your previous invite did not join. You now have another invite available.`;
        default:
          return `You got selected. Share your ${
            referral_invites?.length === 1 ? 'invite' : 'invites'
            } with someone that means a lot to you.`;
      }
    }

    const open = referral_invites?.length > 0 && !inviteFriendPopUpSeen;
    return open ? (
      <View style={styles.shareInviteBox}>
        <View style={styles.triangle} />
        <View style={styles.shareInviteContainer}>
          <View style={styles.inviteTitleContainer}>
            <HeartIcon
              isLiked
              size={15}
              style={{
                marginRight: Globals.dimension.margin.tiny * 0.7,
                top: -1,
              }}
            />
            <Text style={styles.inviteTitle}>
              You have {referral_invites?.length}{' '}
              {referral_invites?.length === 1 ? 'invite' : 'invites'}
            </Text>
          </View>
          <Text style={styles.description}>{getExplainerMessage()}</Text>
        </View>
      </View>
    ) : null;
  }, [referral_invites, inviteFriendPopUpSeen]);

  return (
    <View style={styles.container}>
      <Text style={compileTextStyle()}>{title}</Text>
      <View style={styles.iconWrapper}>
        {referral_invites?.length > 0 ? (
          <HapticFeedBackWrapper onPress={() => navigateTo('Invite')}>
            <View>
              <ShareInviteIcon
                style={styles.shareLinkIcon}
                color={compileColor()}
              />
            </View>
          </HapticFeedBackWrapper>
        ) : null}
        <HapticFeedBackWrapper onPress={() => navigateTo('Search')}>
          <View>
            <SearchIcon style={styles.searchIcon} color={compileColor()} />
          </View>
        </HapticFeedBackWrapper>
        <HapticFeedBackWrapper onPress={() => navigateTo('NewsScreen')}>
          <View>
            <NotificationButton color={compileColor()} />
          </View>
        </HapticFeedBackWrapper>
      </View>

      {renderInviteBox}
    </View>
  );
}

export default connect(mapStateToProps)(SearchHeader);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 45,
    zIndex: 10,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  searchBarContainer: {
    width: '100%',
    height: '90%',
    alignSelf: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Globals.dimension.borderRadius.large,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large * 1.2,
    color: Globals.color.text.grey,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 27,
    height: 25,
  },
  iconWrapper: {
    flexDirection: 'row',
  },
  shareLinkIcon: {
    marginRight: Globals.dimension.margin.small,
  },
  searchIcon: {
    marginRight: Globals.dimension.margin.small,
  },
  shareInviteBox: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    top: 45,
  },
  shareInviteContainer: {
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.mini,
    borderRadius: Globals.dimension.borderRadius.tiny * 1.5,
    backgroundColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 40,
    shadowOpacity: 0.2,
  },
  inviteTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 25,
  },
  inviteTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  description: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.tiny,
    marginTop: Globals.dimension.margin.tiny * 0.2,
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 20,
    borderRightWidth: 20,
    borderBottomWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Globals.color.background.light,
    elevation: Globals.shadows.shading2.elevation,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: Globals.shadows.shading2.shadowRadius,
    shadowOpacity: 0.7,
    alignSelf: 'flex-end',
    marginRight: 95,
  },
  dotContainer: {
    position: 'absolute',
    height: 20,
    minWidth: 20,
    borderColor: Globals.color.background.light,
    borderWidth: 1,
    paddingHorizontal: 5,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    right: -7,
  },
  count: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.brand.white,
    fontSize: Globals.font.size.xTiny,
  },
  messageIconContainer: {
    flexDirection: 'row',
  },
});
