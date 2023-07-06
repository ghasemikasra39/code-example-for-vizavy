import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Globals from './Globals';
import SendSMS from 'react-native-sms';
import MixPanelClient, {
  SEND_INVITE,
} from '../services/utility/MixPanelClient';
import ReferralManager from '../services/api/ReferralManager';
import moment from 'moment';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';
import { formatNumberForBE } from '../screens/OTP/OPTUtilities';

interface Props {
  item: Object;
  referral: Object;
  loading: boolean;
  onSent?: (item: Object) => void;
}

export enum InviteStatus {
  JOINED = 'joined',
  INVITED = 'invited',
}

export default function InviteUserListItem(props: Props) {
  const { item, referral, loading, onSent } = props;
  const [openingSms, setOpeningSms] = useState(false);
  const inviteLink = referral?.invite_link;
  const inviteMessage = `Hey ${
    item?.givenName
  } - I have one invite and want you to join 😊. I added you using ${
    item?.phoneNumbers ? item?.phoneNumbers[0]?.number : null
  }, so make sure to use that number when you register. Here is the link! ${'\n'}${inviteLink}`;
  /**
   * Share link via sms
   * @function sendSmS
   */
  function sendSmS() {
    toggleOpeningSmS();
    SendSMS.send(
      {
        body: inviteMessage,
        recipients: [item?.phoneNumbers ? item?.phoneNumbers[0]?.number : null],
        successTypes: ['sent', 'queued'],
      },
      (completed) => {
        if (completed) {
          MixPanelClient.trackEvent(SEND_INVITE);
          onSent(item);
          updateReferralInvitesOnBE();
        }
      },
    );
  }

  async function updateReferralInvitesOnBE() {
    const referralId = referral?.id;
    const time = moment().utc().format('YYYY-MM-DD h:mm:ss');
    const phoneNumber = item?.phoneNumbers[0]?.number;
    const encodeNumber = formatNumberForBE(phoneNumber);
    const body = {
      sent_at: time,
      phone_number: encodeNumber,
    };
    await ReferralManager.sendReferralInvite(referralId, body);
    ReferralManager.getReferralInvites();
  }

  function toggleOpeningSmS() {
    setOpeningSms(true);
    setTimeout(() => setOpeningSms(false), 1000);
  }

  function renderButton() {
    function compileBackgroundStyle() {
      let backgroundStyle = styles.buttonContainer;
      if (loading) {
        backgroundStyle = {
          ...backgroundStyle,
          ...{
            backgroundColor: Globals.color.background.mediumgrey,
            width: 70,
          },
        };
      }
      switch (item?.status) {
        case InviteStatus.JOINED:
        case InviteStatus.INVITED:
          backgroundStyle = {
            ...backgroundStyle,
            backgroundColor: Globals.color.background.mediumgrey,
          };
      }
      return backgroundStyle;
    }

    function compileTextStyle() {
      let textStyle = styles.buttonTitle;
      switch (item?.status) {
        case InviteStatus.JOINED:
        case InviteStatus.INVITED:
          textStyle = {
            ...textStyle,
            color: Globals.color.text.grey,
          };
      }
      return textStyle;
    }

    function getTitle() {
      switch (item?.status) {
        case InviteStatus.JOINED:
          return 'Joined';
        case InviteStatus.INVITED:
          return 'Sent';
        default:
          return 'Invite';
      }
    }
    return (
      <TouchableOpacity onPress={sendSmS} disabled={item?.status}>
        <View style={compileBackgroundStyle()}>
          {openingSms ? (
            <ActivityIndicator color={Globals.color.background.light} />
          ) : !loading ? (
            <Text style={compileTextStyle()}>{getTitle()}</Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.initialContainer}>
        {!loading ? (
          <Text style={styles.initial}>{item?.givenName.charAt(0)}</Text>
        ) : null}
      </View>
      <View style={styles.wrapper}>
        <View style={styles.nameContainer}>
          {!loading ? (
            <Text style={styles.name} numberOfLines={1}>
              {item?.givenName} {item?.familyName}
            </Text>
          ) : (
            <View style={styles.nameCoverContainer} />
          )}
          {!loading ? (
            <Text style={styles.number}>{item?.phoneNumbers[0]?.number}</Text>
          ) : (
            <View style={styles.numverCoverContainer} />
          )}
        </View>
        {renderButton()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.tiny,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: Globals.dimension.padding.mini,
  },
  initialContainer: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  initial: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny,
  },
  number: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
  },
  buttonContainer: {
    height: 35,
    paddingHorizontal: Globals.dimension.padding.mini,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  nameCoverContainer: {
    width: '60%',
    height: 15,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
    marginBottom: Globals.dimension.margin.tiny,
  },
  numverCoverContainer: {
    width: '40%',
    height: 15,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
  },
});
