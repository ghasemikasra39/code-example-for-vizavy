import React, { useMemo } from 'react';
import Modal from '../component-library/Modal';
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import Globals from '../component-library/Globals';
import { inviteFriendsData } from '../screens/ChatRoom/ChatRoomConstants';
import { close_icon_black } from '../component-library/graphics/Images';
import Clipboard from '@react-native-community/clipboard';
import SendSMS from 'react-native-sms';
import Share from 'react-native-share';
import MixPanelClient, {
  SHARE_FB_MESSENGER,
  SHARE_WHATSAPP,
  SHARE_SMS,
  SHARE_Copied_LINK,
  SHARE_MORE,
} from '../services/utility/MixPanelClient';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  link?: string;
  roomMessage: string;
  openModal: boolean;
  toogleModal: () => void;
  onClose: () => void;
  colors: any;
}

export default function InviteFriendModal(props: Props) {
  const { link, openModal, toogleModal, onClose, colors } = props;

  /**
   * This method defines what option the user has selected to share his link with
   * @function shareLink
   * @param {index : number} - gives the index of the selected option
   */
  function shareLink(index: number) {
    switch (index) {
      case 0:
        copyLink();
        break;
      case 1:
        sendSmS();
        break;
      case 2:
        shareOnWhatsApp();
        break;
      case 3:
        shareOnFbMessenger();
        break;
      case 4:
        openMore();
    }
  }

  /**
   * Copy the link to clipboard
   * @function copyLink
   */
  function copyLink() {
    Clipboard.setString(link);
    Alert.alert('🔗', 'We copied the link for you ☺️', [
      { text: 'OK', onPress: () => toogleModal() },
    ]);
    MixPanelClient.trackEvent(SHARE_Copied_LINK);
  }

  /**
   * Share link via sms
   * @function sendSmS
   */
  function sendSmS() {
    SendSMS.send(
      {
        body: link,
        recipients: [],
        successTypes: ['sent', 'queued'],
      },
      (completed) => {
        if (completed) {
          MixPanelClient.trackEvent(SHARE_SMS);
        }
      },
    );
  }

  /**
   * Share link via WhatsApp
   * @function shareOnWhatsApp
   */
  function shareOnWhatsApp() {
    let url = 'whatsapp://send?text=' + link;
    Linking.openURL(url)
      .then(() => {
        MixPanelClient.trackEvent(SHARE_WHATSAPP);
      })
      .catch(() => {
        Alert.alert('🔍😕', 'Make sure Whatsapp is installed on your device', [
          { text: 'OK' },
        ]);
      });
  }

  /**
   * Share link via Facebook Messenger
   * @function shareOnFbMessenger
   */
  function shareOnFbMessenger() {
    Linking.openURL(`fb-messenger://share?link=${link}`)
      .then(() => {
        MixPanelClient.trackEvent(SHARE_FB_MESSENGER);
      })
      .catch(() => {
        Alert.alert(
          '🔍😕',
          'Make sure Facebook Messenger is installed on your device',
          [{ text: 'OK' }],
        );
      });
  }

  /**
   * Share link via more options modal that OS device provides
   * @function openMore
   */
  async function openMore() {
    const options = {
      message: link,
      title: 'Join Room',
    };
    Share.open(options).then(() => {
      MixPanelClient.trackEvent(SHARE_MORE);
    });
  }

  function renderIcons({ item, index }) {
    if (index === 0) {
      return (
        <View style={styles.iconWrapper}>
          <TouchableOpacity
            style={styles.iconBackground}
            onPress={() => shareLink(index)}>
            <Image
              source={item.icon}
              style={index === 0 ? styles.copyIcon : styles.moreIcon}
            />
          </TouchableOpacity>
          <Text style={styles.iconDescription}>{item.description}</Text>
        </View>
      );
    } else if (index === 4) {
      return (
        <View style={styles.iconWrapper}>
          <TouchableOpacity
            style={styles.iconBackground}
            onPress={() => shareLink(index)}>
            <LinearGradient style={styles.iconGradient} colors={colors}>
              <Image
                source={item.icon}
                style={index === 0 ? styles.copyIcon : styles.moreIcon}
              />
            </LinearGradient>
          </TouchableOpacity>
          <Text style={styles.iconDescription}>{item.description}</Text>
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => shareLink(index)}>
          <Image source={item.icon} style={styles.shareIcon} />
          <Text style={styles.iconDescription}>{item.description}</Text>
        </TouchableOpacity>
      );
    }
  }

  const renderInviteFriendsModal = useMemo(
    () => (
      <Modal
        key="inviteFriendModal"
        isVisible={openModal}
        placement="bottom"
        modalheightType={'modal4'}
        onClosed={() => onClose()}>
        <View style={styles.container}>
          <Text style={styles.joinHeader}>Invite a friend to your room!</Text>
          <Text style={styles.joinDescription}>
            Share this link with friends and they’ll automatically join your
            room.
          </Text>

          <FlatList
            data={inviteFriendsData}
            renderItem={renderIcons}
            horizontal={true}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </Modal>
    ),
    [openModal],
  );

  return renderInviteFriendsModal;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: Globals.dimension.padding.mini,
  },
  modalWrapper: {
    borderTopLeftRadius: Globals.dimension.borderRadius.large,
    borderTopRightRadius: Globals.dimension.borderRadius.large,
    backgroundColor: Globals.color.background.light,
    shadowColor: '#B3B6B9',
    shadowOffset: { width: 0, height: -7 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },
  joinHeader: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  joinDescription: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    lineHeight: 20,
    color: Globals.color.text.grey,
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: Globals.dimension.padding.medium,
    marginTop: Globals.dimension.margin.mini,
  },
  listContainer: {
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: Globals.dimension.padding.small,
    marginTop: Globals.dimension.margin.medium,
  },
  iconWrapper: {
    alignItems: 'center',
  },
  iconBackground: {
    width: 50,
    height: 50,
    backgroundColor: Globals.color.text.lightgrey,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconDescription: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.default,
    marginTop: Globals.dimension.margin.tiny,
  },
  shareIcon: {
    width: 50,
    height: 50,
  },
  copyIcon: {
    width: 20,
    height: 25,
  },
  moreIcon: {
    width: 25,
    height: 5,
  },
  closeContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: Globals.dimension.padding.mini,
  },
  closeIconWrapper: {
    padding: Globals.dimension.padding.mini,
  },
  closeButton: {
    width: 15,
    height: 15,
  },
});
