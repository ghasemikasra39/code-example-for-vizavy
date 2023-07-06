import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  Dimensions,
  ScrollView,
  FlatList,
  TextInput,
  Alert,
} from 'react-native';
import Globals from '../component-library/Globals';
import { useNavigation } from '@react-navigation/native';
import CustomHeaderBar from '../component-library/CustomHeaderBar';
import { connect } from 'react-redux';
import CloseIcon from '../component-library/graphics/Icons/CloseIcon';
import Button from '../component-library/Button';
import InviteFriendIcon from '../component-library/graphics/Icons/InviteFriendIcon';
import Contacts from 'react-native-contacts';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import InviteUserListItem, {
  InviteStatus,
} from '../component-library/InviteUserListItem';
import SearchIcon from '../component-library/graphics/Icons/SearchIcon';
import PermissionRequester from '../services/utility/PermissionRequester';
import ReferralManager from '../services/api/ReferralManager';
import IllustrationExplainer from '../component-library/IllustrationExplainer';
import NoMoreInvitesIcon from '../component-library/graphics/Icons/NoMoreInvitesIcon';
import { formatNumberForBE } from './OTP/OPTUtilities';
import DefaultLoadingIndicator from '../component-library/LoadingIndicator/DefaultLoadingIndicator';

const mapStateToProps = ({ referrals }) => ({
  referrals,
});

function InviteScreen(props) {
  const { referrals } = props;
  const { referral_invites } = referrals;
  const navigation = useNavigation();
  const FRIEND_ICON_SIZE = Dimensions.get('window').height * 0.25;
  const FAKE_LOADING_DATA = [
    'a',
    'b',
    'c',
    'd',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
  ];
  const [showAllowContactsModal, setShowAllowContactsModal] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [contactsEnabled, setContactsEnabled] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);

  useEffect(() => {
    getContactList();
    toggleInitialLoadStatus();
  }, []);

  useEffect(() => {
    if (referral_invites?.length === 0) {
      setContactList([]);
    }
  }, [referral_invites]);

  function toggleInitialLoadStatus() {
    setTimeout(() => {
      setShowLoadingIndicator(false);
    }, 800);
    setTimeout(() => {
      setHasLoadedInitially(!hasLoadedInitially);
    }, 1200);
  }

  function checkContactPermissions() {
    Contacts.requestPermission().then((permission) => {
      getContactList();
      if (permission === 'denied') {
        showContactsRequestDeniedAlert();
      }
    });
  }

  function getContactList() {
    Contacts.checkPermission().then((permission) => {
      if (permission === 'undefined') {
        setContactsEnabled(false);
      }
      if (permission === 'authorized') {
        Contacts.getAll().then((list) => {
          getReferralInviteStatus(list);
          setContactsEnabled(true);
        });
      }
      if (permission === 'denied') {
        setContactsEnabled(false);
      }
    });
  }

  function getReferralInviteStatus(list: Array<Object>) {
    try {
      setLoading(true);
      const phoneNumbers = list
        .map((e) => formatNumberForBE(e?.phoneNumbers[0]?.number))
        .filter((e) => e?.length > 0);
      ReferralManager.getReferralInviteStatuses(phoneNumbers).then(
        (response) => {
          const { success, statuses } = response;
          setLoading(false);
          if (!success) return;
          createInviteList(statuses, list);
        },
      );
    } catch (error) {
      setLoading(false);
    }
  }

  function createInviteList(statuses: Object, contactsList: Array<Object>) {
    if (statuses?.length === 0) {
      setContactList(contactsList);
      return;
    }
    try {
      contactsList.forEach((element, index) => {
        const phoneNumber = formatNumberForBE(element.phoneNumbers[0]?.number);
        if (statuses[phoneNumber] !== undefined) {
          let newUserItem = element;
          newUserItem = {
            ...newUserItem,
            status: statuses[phoneNumber],
          };
          contactsList[index] = newUserItem;
        }
      });
      setContactList(contactsList);
    } catch (error) {
      console.log('ERROR: ', error);
    }
  }

  function onSentInvite(item: Object) {
    try {
      const phoneNumber = item?.phoneNumbers[0]?.number;
      const newContactList = [...contactList];
      const index = newContactList.findIndex(
        (user) => user?.phoneNumbers[0]?.number === phoneNumber,
      );
      newContactList[index] = {
        ...newContactList[index],
        status: InviteStatus.INVITED,
      };
      setContactList(newContactList);
    } catch (error) {
      console.log('error onSentInvite: ', error);
    }
  }

  function showContactsRequestDeniedAlert() {
    Alert.alert(
      'Connect Address Book',
      "You can choose who you'd like to invite from your friends. We'll keep your contacts safe.",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Settings', onPress: openSettings },
      ],
      { cancelable: false },
    );
  }

  /**
   * If a user has not allowed his microphone, he will be directed to the Settings Screen on iOS Systemspreferences
   * @method openSettings
   */
  function openSettings() {
    PermissionRequester.openSettingsAsync();
  }

  function toggleAllowContactsModal() {
    setShowAllowContactsModal(!showAllowContactsModal);
  }

  function showNativeAlert() {
    setShowAllowContactsModal(false);
    setTimeout(checkContactPermissions, 500);
  }

  function getTitle() {
    return `You have ${referral_invites?.length} ${
      referral_invites?.length === 1 ? 'invite' : 'invites'
      }`;
  }

  function renderCloseIcon() {
    return (
      <View style={styles.closeIconContainer}>
        <CloseIcon color={Globals.color.text.default} size={12} />
      </View>
    );
  }

  const renderLoadingIncidator = useMemo(() => {
    return !hasLoadedInitially ? (
      <View style={styles.loadingIndicatorContainer}>
        <DefaultLoadingIndicator show={showLoadingIndicator} size={'large'}/>
      </View>
    ) : null;
  }, [hasLoadedInitially, showLoadingIndicator]);

  function renderListHeaderComponent() {
    return (
      <View>
        <View style={styles.explainerContainer}>
          <Text style={styles.explainer}>
            Who’s a great addition to Youpendo?
          </Text>
          <Text
            style={
              styles.explainer
            }>{`(P.S. We’re iPhone only right now)`}</Text>
        </View>
        <View style={styles.searchBarContainer}>
          <SearchIcon />
          <TextInput
            style={styles.searchBar}
            onChangeText={(value) => setText(value)}
            defaultValue={text}
            maxLength={140}
            placeholderTextColor={Globals.color.text.grey}
            placeholder={'Search'}
            selectionColor={Globals.color.text.grey}
            clearButtonMode={'never'}
            keyboardAppearance={'light'}
          />
        </View>
      </View>
    );
  }

  function renderEnableContactsScreen() {
    return (
      <ScrollView style={styles.wrapper}>
        <InviteFriendIcon
          style={styles.inviteFrinedIcon}
          size={FRIEND_ICON_SIZE}
        />

        <Text style={styles.inviteTitle}>1 invite for 1 special friend.</Text>
        <Text style={styles.subTitle}>
          You’re selected because we trust you ✨
        </Text>
        <Text style={styles.description}>
          Youpendo is magical because of the people on the app. Invite a friend
          who you believe is a great addition to the community. Thanks to your
          invite, they’ll get instant access to all features.
        </Text>
      </ScrollView>
    );
  }

  const renderContactList = useMemo(() => {
    const referral = referral_invites[referral_invites?.length - 1];
    function renderItem({ item }) {
      return (
        <InviteUserListItem
          item={item}
          referral={referral}
          loading={loading}
          onSent={onSentInvite}
        />
      );
    }

    function getContactsList() {
      const filteredContacts = contactList.filter(
        (contact) => contact?.givenName?.indexOf(text) >= 0,
      );
      return filteredContacts;
    }

    function renderListEmptyComponent() {
      const size = Dimensions.get('window').width / 2.7;
      return referral_invites?.length === 0 ? (
        <IllustrationExplainer
          image={<NoMoreInvitesIcon size={size} />}
          headline={'You are out of invites'}
          description={'You have 0 invites left.'}
        />
      ) : null;
    }

    return (
      <FlatList
        data={!loading ? getContactsList() : FAKE_LOADING_DATA}
        renderItem={renderItem}
        ListHeaderComponent={renderListHeaderComponent()}
        ListEmptyComponent={renderListEmptyComponent()}
      />
    );
  }, [contactList, loading, text]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        text={getTitle()}
        userProfileInitialized={false}
        customIcon={renderCloseIcon()}
        onPress={() => navigation.goBack()}
      />
      {contactsEnabled ? renderContactList : renderEnableContactsScreen()}
      {!contactsEnabled ? (
        <Button
          title={'Invite Contacts'}
          onPress={toggleAllowContactsModal}
          primary
          style={styles.buttonContainer}
        />
      ) : null}

      <ConfirmCancelModal
        key={'AllowContactsModal'}
        showConfirmCancelModal={showAllowContactsModal}
        confirmText={'Ok'}
        cancelText={'Not now'}
        title={'Connect Address Book'}
        text={`You can choose who you'd like to invite from your friends. We'll keep your contacts safe.`}
        toggleConfirmCancelModal={toggleAllowContactsModal}
        onConfirm={showNativeAlert}
      />
      {renderLoadingIncidator}
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(InviteScreen);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
  },
  wrapper: {
    flex: 1,
    padding: Globals.dimension.padding.small,
  },
  closeIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginHorizontal: Globals.dimension.margin.small,
  },
  inviteTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
  },
  subTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginTop: Globals.dimension.padding.tiny,
  },
  description: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginTop: Globals.dimension.padding.tiny,
  },
  inviteFrinedIcon: {
    alignSelf: 'center',
    marginBottom: Globals.dimension.margin.mini,
  },
  searchBarContainer: {
    width: '90%',
    height: 38,
    alignSelf: 'center',
    paddingHorizontal: Globals.dimension.padding.tiny,
    marginVertical: Globals.dimension.padding.mini,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  searchBar: {
    flex: 1,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Globals.dimension.margin.tiny,
  },
  explainerContainer: {
    paddingHorizontal: Globals.dimension.padding.mini,
    marginTop: Globals.dimension.margin.tiny,
  },
  explainer: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    textAlign: 'center',
  },
  loadingIndicatorContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.light,
  },
});
