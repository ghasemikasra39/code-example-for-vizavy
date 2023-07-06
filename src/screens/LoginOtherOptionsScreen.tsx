import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import Globals from '../component-library/Globals';
import Button from '../component-library/Button';
import AuthorizationManager, {
  LOGIN_PROVIDER_APPLE,
  LOGIN_PROVIDER_FACEBOOK,
  LOGIN_PROVIDER_OTP,
} from '../services/auth/AuthorizationManager';
import AppleIcon from '../component-library/graphics/Icons/AppleIcon';
import FacebookIcon from '../component-library/graphics/Icons/FacebookIcon';
import CloseIcon from '../component-library/graphics/Icons/CloseIcon';
import PhoneIcon from '../../src/component-library/graphics/Icons/PhoneIcon';
import AgreementsModal from '../modals/AgreementsModal';
import { useNavigation } from '@react-navigation/native';
import MixPanelClient, {
  LOGIN_FAILED, SIGN_UP_WITH_PHONE_NUMBER,
} from '../services/utility/MixPanelClient';
import { getCountryCallingCode } from 'libphonenumber-js';
import { Bugtracker } from '../services/utility/BugTrackerService';
import BackendApiClient from '../services/api/BackendApiClient';

export default function LoginOtherOptionsScreen() {
  const navigation = useNavigation();
  const [showAgreementModal, setShowAgreementModal] = useState(false);
  const [typeOfAgreement, setTypeOfAgreement] = useState('');
  const [loginInProgress, setLoginInProgress] = useState(false);
  const [, setLoginFailed] = useState(false);
  const [loginProvider, setLoginProvider] = useState(null);

  /**
   * Navigate to screen
   * @method navigateToScreen
   * @param {String} screen - name of the next screen
   * @param {Object} options - params to pass over to next screen
   */
  function navigateToScreen(screen: string, options?: Object) {
    navigation.navigate(screen, options);
  }

  /**
   * Handle the login process based on the provider
   * @method handleProviderLogin
   * @param {String} loginProvider - either LOGIN_PROVIDER_APPLE or LOGIN_PROVIDER_FACEBOOK
   * @return {Boolean} loginSucceeded - true if login successful, false otherwise
   */
  async function handleProviderLogin(loginProvider: any) {
    let tokenResponse = false;
    if (loginProvider === LOGIN_PROVIDER_FACEBOOK) {
      tokenResponse = await AuthorizationManager.handleFacebookLoginAsync();
    } else if (loginProvider === LOGIN_PROVIDER_APPLE) {
      tokenResponse = await AuthorizationManager.handleAppleLoginAsync();
    }
    return tokenResponse;
  }

  /**
   * Called when either of the login buttons is pressed, handle the login process
   * @method handleLoginAsync
   * @param {String} loginProvider - either LOGIN_PROVIDER_APPLE or LOGIN_PROVIDER_FACEBOOK
   */
  async function handleLoginAsync(loginProvider: string) {
    function sideEffectsBeforeLogin() {
      setLoginFailed(false);
      setLoginInProgress(true);
      setLoginProvider(loginProvider);
    }

    function sideEffectsAfterLogin(data) {
      setLoginFailed(!data.success);
      setLoginInProgress(false);
      setLoginProvider(null);
    }

    function sideEffectsAfterFailure(error) {
      MixPanelClient.trackEvent(LOGIN_FAILED, { loginProvider: loginProvider });
      setLoginFailed(true);
      setLoginInProgress(false);
      Bugtracker.Sentry.captureException(error);
    }

    if (loginInProgress) return;
    try {
      sideEffectsBeforeLogin();
      if (loginProvider === LOGIN_PROVIDER_OTP) {
        MixPanelClient.trackEvent(SIGN_UP_WITH_PHONE_NUMBER);
        getIpAdress();
        return;
      }

      const { data, status } = await handleProviderLogin(loginProvider);
      sideEffectsAfterLogin(data);
      data.success
        ? AuthorizationManager.loginSuccessHandler(loginProvider, data)
        : AuthorizationManager.loginFailureHandler(data, status);
    } catch (error) {
      sideEffectsAfterFailure(error);
    }
  }

  /**
   * Check the IP adress of the user and display him his country phone number initial
   * @method getIpAdress
   */
  async function getIpAdress() {
    const requestConfig = {
      url: '/location-recognition',
      method: 'GET',
    };
    BackendApiClient.requestAsync(requestConfig).then(
      (res: { data: { location: { country_code: any } } }) => {
        const { country_code } = res.data.location;
        const callingCode = getCountryCallingCode(country_code);
        navigateToScreen('EnterNumberScreen', {
          callingCode: [callingCode.toString()],
          cca2: country_code,
        });
        setLoginInProgress(false);
      },
      (err) => {
        navigateToScreen('EnterNumberScreen', {
          callingCode: ['49'],
          cca2: 'DE',
        });
        setLoginInProgress(false);
      },
    );
  }

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

  function renderLoadingIndicator(loginMethod: string) {
    return loginProvider === loginMethod && loginInProgress ? (
      <ActivityIndicator
        color={Globals.color.background.light}
        style={{ marginLeft: Globals.dimension.margin.tiny }}
      />
    ) : null;
  }

  function renderAgreementsTextBox() {
    /**
     * Show corresponding modal based on type
     * @function handleTouchableOpacityOnPress
     * @param {String} typeOfAgreement - type of modal
     */
    const handleTouchableOpacityOnPress = (typeOfAgreement) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.login}>Login</Text>
        <TouchableWithoutFeedback onPress={() => navigateToScreen('Login')}>
          <View style={styles.closeIconContainer}>
            <CloseIcon color={Globals.color.text.default} size={12} />
          </View>
        </TouchableWithoutFeedback>
      </View>

      <Button
        title={'Continue with Phone'}
        icon={
          <PhoneIcon
            color={Globals.color.brand.white}
            style={{ left: '-120%' }}
          />
        }
        onPress={() => handleLoginAsync(LOGIN_PROVIDER_OTP)}
        style={styles.buttonContainer}
        primary
        iconRight={renderLoadingIndicator(LOGIN_PROVIDER_OTP)}
        hapticFeedback
      />
      <Button
        title={'Continue with Facebook'}
        icon={
          <FacebookIcon
            color={Globals.color.brand.white}
            style={{
              top: -1,
              left: '-30%',
              marginRight: Globals.dimension.margin.tiny * 0.8,
            }}
          />
        }
        onPress={() => handleLoginAsync(LOGIN_PROVIDER_FACEBOOK)}
        buttonStyle={{ backgroundColor: '#3B5998' }}
        dark
        style={styles.buttonContainer}
        iconRight={renderLoadingIndicator(LOGIN_PROVIDER_FACEBOOK)}
        hapticFeedback
      />
      <Button
        title={'Continue with Apple'}
        icon={
          <AppleIcon
            color={Globals.color.brand.white}
            style={{ top: -1, left: '-120%' }}
          />
        }
        onPress={() => handleLoginAsync(LOGIN_PROVIDER_APPLE)}
        dark
        style={styles.buttonContainer}
        iconRight={renderLoadingIndicator(LOGIN_PROVIDER_APPLE)}
        hapticFeedback
      />
      <View style={styles.agreementBoxContainer}>
        {renderAgreementsTextBox()}
      </View>
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
    width: '100%',
    height: '100%',
    paddingTop: Globals.dimension.padding.small,
  },
  closeIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Globals.dimension.margin.mini,
    right: 2,
    position: 'absolute',
  },
  login: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    textAlign: 'center',
  },
  titleContainer: {
    width: '100%',
    height: 40,
    justifyContent: 'center',
  },
  buttonContainer: {
    marginHorizontal: Globals.dimension.margin.small,
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
  agreementBoxContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    paddingBottom: Globals.dimension.padding.mini,
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
});
