import React, {useState} from 'react';
import {Alert, StyleSheet, FlatList} from 'react-native';
import Globals from '../component-library/Globals';
import SettingsListItem from '../component-library/SettingsListItem';
import AuthorizationManager from '../services/auth/AuthorizationManager';
import AgreementsModal from '../modals/AgreementsModal';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {AppStackParamList} from '../navigation/NavigationTypes';
import {store} from '../store';
import CustomHeaderBar from '../component-library/CustomHeaderBar';
import LimitedOfferModal from '../modals/LimitedOfferModal';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import {SafeAreaView} from 'react-native-safe-area-context';
import {env} from '../config';

type SettingsScreenNavigationProp = StackNavigationProp<AppStackParamList,
  'SettingsScreen'>;

export default function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const [logoutInProcess, setLogoutInProcess] = useState<boolean>(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState<boolean>(
    false,
  );
  const [showAgreementModal, setShowAgreementModal] = useState<boolean>(false);
  const [showLimitedOfferModal, setShowLimitedOfferModal] = useState(false);
  const [typeOfAgreement, setTypeOfAgreement] = useState<string>(null);

  const handleLogoutAsync = async () => {
    setLogoutInProcess(true);
    try {
      await AuthorizationManager.handleLogoutAsync();
      store.dispatch({type: 'RESET_STORE'});
      toggleConfirmationModal();
    } catch {
      Alert.alert('Logout failed.');
      setLogoutInProcess(false);
      toggleConfirmationModal();
    }
  };

  function toggleConfirmationModal() {
    setShowConfirmationModal(!showConfirmationModal);
  }


  function compileItems() {
    let items = [
      {
        title: 'Privacy Policy',
        onPress: () => {
          setShowAgreementModal(true);
          setTypeOfAgreement('Privacy Policy');
        },
      },
      {
        title: 'Terms & Conditions',
        onPress: () => {
          setShowAgreementModal(true);
          setTypeOfAgreement('Terms & Conditions');
        },
      },
      {
        title: 'Cookie Policy',
        onPress: () => {
          setShowAgreementModal(true);
          setTypeOfAgreement('Cookie Policy');
        },
      },
      {
        title: 'Community Guidelines',
        onPress: () => {
          setShowAgreementModal(true);
          setTypeOfAgreement('Community Guidelines');
        },
      },
      {
        title: 'Limited Offer',
        onPress: () => {
          setShowLimitedOfferModal(true);
        },
      },
      {
        title: 'Logout',
        onPress: () => {
          setShowConfirmationModal(!showConfirmationModal);
        },
      },
    ];
    if (env.name === 'DEV' || env.name === 'STAGING') {
      items.push({
        title: 'Reset Authorization',
        onPress: async () => {
          await AuthorizationManager.resetAuthorizationStateAsync()
          store.dispatch({type: 'RESET_STORE'});
          navigation.navigate('Auth');
        },
      })
    }

    return items;
  }

  function toggleAgreementModal(closed?: boolean) {
    if (closed) {
      setShowAgreementModal(false);
    } else {
      setShowAgreementModal(!showAgreementModal);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        text={'Settings'}
        onDismiss={() => navigation.goBack()}
      />
      <FlatList
        data={compileItems()}
        renderItem={({item}) => (
          <SettingsListItem title={item.title} onPress={item.onPress}/>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <ConfirmCancelModal
        myKey={'LogoutModal'}
        showConfirmCancelModal={showConfirmationModal}
        confirmText={'Yes'}
        cancelText={'No, cancel'}
        title={'Logout'}
        text={`Are you sure you want to logout??`}
        toggleConfirmCancelModal={toggleConfirmationModal}
        onConfirm={handleLogoutAsync}
        loading={logoutInProcess}
      />
      <LimitedOfferModal
        showLimitedOfferModal={showLimitedOfferModal}
        toggleLimitedOfferModal={() =>
          setShowLimitedOfferModal(!showLimitedOfferModal)
        }
        onClose={() => setShowLimitedOfferModal(false)}
      />
      <AgreementsModal
        showAgreementModal={showAgreementModal}
        toggleAgreementModal={toggleAgreementModal}
        type={typeOfAgreement}
        onClosed={() => toggleAgreementModal(true)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Globals.color.background.lightgrey,
    backgroundColor: Globals.color.background.light,
  },
  confirmationQuestion: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    textAlign: 'center',
    paddingBottom: Globals.dimension.padding.mini,
  },
  buttonShadow: {
    backgroundColor: '#C4C4C4',
    borderRadius: Globals.dimension.borderRadius.large,
    elevation: 15,
  },
});
