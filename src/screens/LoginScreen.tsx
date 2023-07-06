import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Linking,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Globals from '../component-library/Globals';
import Button from '../component-library/Button';
import PhoneIcon from '../../src/component-library/graphics/Icons/PhoneIcon';
import { connect } from 'react-redux';
import AppStatusSlice from '../store/slices/AppStatusSlice';
import { TouchableOpacity } from 'react-native-gesture-handler';
import AgreementsModal from '../modals/AgreementsModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthorizationStackParamList } from '../navigation/NavigationTypes';
import {
  logoWhite,
  paperPlanePreviewAnimation,
} from '../component-library/graphics/Images';
import { useNavigation, useRoute } from '@react-navigation/native';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import HapticFeedBackWrapper from '../component-library/HapticFeedBackWrapper';
import BackendApiClient from '../services/api/BackendApiClient';
import { getCountryCallingCode } from 'libphonenumber-js';
import MixPanelClient, { SIGN_UP_WITH_PHONE_NUMBER } from '../services/utility/MixPanelClient';

const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

function LoginScreen() {
  const [showBlockReportModal, setShowBlockReportModal] = useState(false);
  const [blockTitle, setBlockTitle] = useState('');
  const [blockMessage, setBlockMessage] = useState('');
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [typeOfAgreement, setTypeOfAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [] = useState(null);
  const [] = useState(true);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const route = useRoute();
  /**
   * called when the user is blocked and shows the block/report modal
   */
  useEffect(() => {
    if (route.params?.isBlockedReported === true) {
      navigation.setParams({ isBlockedReported: null });
      setShowBlockReportModal(true);
      setBlockTitle('Block/Report');
      setBlockMessage(
        'Your account has been blocked because you violated against the community guidelines. Please click the contact button if you believe the blocking has been unjustified.',
      );
    }
    if (route.params?.isLocationBlocked === true) {
      navigation.setParams({ isLocationBlocked: null });
      setShowBlockReportModal(true);
      setBlockTitle('App Not Available');
      setBlockMessage(
        `This app is currently not available in your country or region. We're working hard to make the app available everywhere.`,
      );
    }
  }, [route.params]);

  /**
   * Toggle Agreement Modal
   * @method toggleAgreementModal
   */
  function toggleAgreementModal(closed?: boolean) {
    if (closed) {
      setShowAgreementModal(false);
    } else {
      setShowAgreementModal(!showAgreementModal);
    }
  }

  /**
   * Toggle LoginBlockReport Modal
   * @method toggleLoginBlockReportModal
   */
  function toggleLoginBlockReportModal(close?: boolean) {
    if (close) {
      setShowBlockReportModal(false);
    } else {
      setShowBlockReportModal(!showBlockReportModal);
    }
  }

  /**
   * Contact Youpendo
   * @method contactYoupendo
   */
  function contactYoupendo() {
    Linking.openURL('https://www.youpendo.com/contact-us');
    toggleLoginBlockReportModal();
  }

  function navigateToScreen(screen: string, options?: Object) {
    navigation.navigate(screen, options);
  }

  /**
   * Called when logging in with phone number
   * Gets the location of the user beforehand
   * @method loginWithPhoneNumber
   */
  async function loginWithPhoneNumber() {
    try {
      const requestConfig = {
        url: '/location-recognition',
        method: 'GET',
      };
      setLoading(true);
      MixPanelClient.trackEvent(SIGN_UP_WITH_PHONE_NUMBER);
      BackendApiClient.requestAsync(requestConfig).then(
        (res: { data: { location: { country_code: any } } }) => {
          const { country_code } = res.data.location;
          const callingCode = getCountryCallingCode(country_code);
          navigateToScreen('EnterNumberScreen', {
            callingCode: [callingCode.toString()],
            cca2: country_code,
          });
          setLoading(false);
        },
        () => {
          navigateToScreen('EnterNumberScreen', {
            callingCode: ['1'],
            cca2: 'US',
          });
          setLoading(false);
        },
      );
    } catch (error) {
      setLoading(false);
      console.log('error: ', error);
    }
  }

  /**
   * Render Agreements Text Box
   * @method renderAgreementsTextBox
   * @return {React.Element}
   */
  function renderAgreementsTextBox() {
    /**
     * Show corresponding modal based on type
     * @function handleTouchableOpacityOnPress
     * @param {String} typeOfAgreement - type of modal
     */
    const handleTouchableOpacityOnPress = typeOfAgreement => {
      setShowAgreementModal(true);
      setTypeOfAgreement(typeOfAgreement);
    };

    return (
      <View style={styles.agreementsTextBoxColumn}>
        <View style={styles.agreementsTextBoxRow}>
          <Text style={styles.terms}>By signing up, you agree to our</Text>
          <TouchableOpacity
            onPress={() => handleTouchableOpacityOnPress('Terms & Conditions')}>
            <Text style={styles.link}>Terms</Text>
          </TouchableOpacity>
          <Text style={styles.terms}>,</Text>
          <TouchableOpacity
            onPress={() => handleTouchableOpacityOnPress('Privacy Policy')}>
            <Text style={styles.link}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.agreementsTextBoxRow}>
          <Text style={styles.terms}>, and</Text>
          <TouchableOpacity
            onPress={() => handleTouchableOpacityOnPress('Cookie Policy')}>
            <Text style={styles.link}>Cookie Use</Text>
          </TouchableOpacity>
          <Text style={styles.terms}>. You also agree that you're</Text>
        </View>
        <View>
          <Text style={styles.terms}>over 17 years old.</Text>
        </View>
      </View>
    );
  }

  /**
   * Render Logo Brand
   * @const renderLogoBrand
   * @return {React.Element}
   */
  function renderLogoBrand() {
    return (
      <View style={styles.containerLogoBrand}>
        <View style={styles.logoContainer}>
          <Image source={logoWhite} style={styles.brandImage} />
        </View>
        <Text style={styles.logoName}>Youpendo</Text>
      </View>
    );
  }

  function renderShading() {
    return (
      <LinearGradient
        style={styles.shadingContainer}
        colors={[
          'transparent',
          'rgba(255,255,255,0.8)',
          Globals.color.background.light,
        ]}
      />
    );
  }

  function renderLoadingIndicator() {
    return loading ? (
      <ActivityIndicator
        color={Globals.color.background.light}
        style={{ marginLeft: Globals.dimension.margin.tiny }}
      />
    ) : null;
  }

  /**
   * Render Render Login Butttons
   * @method renderLoginButttons
   * @return {React.Element}
   */
  function renderLoginButtons() {
    return (
      <View>
        <View style={styles.explainerSlider}>
          <Text style={styles.slogan}>
            Meet new people and create meaningful connections
          </Text>
        </View>
        <Button
          title={'Continue with Phone'}
          icon={
            <PhoneIcon
              color={Globals.color.brand.white}
              style={{ left: '-120%' }}
            />
          }
          onPress={loginWithPhoneNumber}
          primary
          style={styles.buttonContainer}
          iconRight={renderLoadingIndicator()}
          hapticFeedback
        />
        <HapticFeedBackWrapper
          onPress={() => navigateToScreen('LoginOtherOptions')}>
          <View style={styles.otherContainer}>
            <Text style={styles.other}>Other Options</Text>
          </View>
        </HapticFeedBackWrapper>
      </View>
    );
  }

  function renderPaperPlanePreviews() {
    return (
      <View style={styles.paperPlanePreviewContainer}>
        <LottieView
          source={paperPlanePreviewAnimation}
          style={styles.paperPlanePreview}
          speed={0.01}
          autoPlay
          loop
        />
        {renderShading()}
        {renderLogoBrand()}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderPaperPlanePreviews()}

      {renderLoginButtons()}
      {renderAgreementsTextBox()}

      <ConfirmCancelModal
        showConfirmCancelModal={showBlockReportModal}
        confirmText={'Cancel'}
        cancelText={'Contact'}
        title={blockTitle}
        text={blockMessage}
        toggleConfirmCancelModal={contactYoupendo}
        onConfirm={toggleLoginBlockReportModal}
        onClose={() => toggleLoginBlockReportModal(true)}
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

type LoginScreenNavigationProp = StackNavigationProp<AuthorizationStackParamList,
  'Login'>;

export default connect(mapStateToProps, AppStatusSlice.actions)(LoginScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
  },
  containerLogoBrand: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 0,
  },
  explainerSlider: {
    width: '100%',
    paddingVertical: Globals.dimension.padding.mini,
    paddingHorizontal: Globals.dimension.padding.medium,
    alignItems: 'center',
  },
  slogan: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.small,
  },
  otherContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Globals.dimension.padding.mini,
  },
  other: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.brand.primary,
  },
  logoName: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    textAlign: 'center',
    color: Globals.color.brand.primary,
    marginTop: Globals.dimension.margin.mini,
  },
  logoContainer: {
    width: 100,
    aspectRatio: 1,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: Globals.color.background.light,
  },
  brandImage: {
    width: 55,
    height: 50,
  },
  loginButton: {
    marginTop: -20,
    marginHorizontal: Globals.dimension.margin.small,
    backgroundColor: Globals.color.brand.primary,
    elevation: 20,
    borderRadius: Globals.dimension.borderRadius.small,
  },
  appleSignIn: {
    marginTop: -20,
    marginBottom: 20,
    alignSelf: 'stretch',
    borderColor: '#000',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    padding: Globals.dimension.padding.mini,
    height: 50,
    marginHorizontal: Globals.dimension.margin.medium,
  },
  terms: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: 20,
  },
  link: {
    textDecorationLine: 'underline',
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: 20,
    marginLeft: 2,
  },
  agreementsTextBoxColumn: {
    flexDirection: 'column',
    marginHorizontal: Globals.dimension.margin.medium,
    paddingBottom: Globals.dimension.padding.mini,
  },
  agreementsTextBoxRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paperPlanePreviewContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  paperPlanePreview: {
    width: '95%',
    alignSelf: 'center',
  },
  shadingContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '50%',
  },
  buttonContainer: {
    marginHorizontal: Globals.dimension.margin.small,
  },
});
