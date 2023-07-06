import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { useNavigation, useRoute } from '@react-navigation/native';
import Globals from '../../component-library/Globals';
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import CheckMarkIcon from '../../component-library/graphics/Icons/CheckMarkIcon';
import AuthorizationManager, {
  LOGIN_PROVIDER_OTP,
} from '../../services/auth/AuthorizationManager';
import MixPanelClient, {
  OTP_ENTER_CODE,
  OTP_ENTER_CODE_FAILED,
} from '../../services/utility/MixPanelClient';
import { formatNumberForBE } from './OPTUtilities';
import {connect} from 'react-redux';
import ChatRoomManager from '../../services/api/ChatRoomManager';

const TITLE = 'My code is';
const SUBTITLE = 'We just texted you a code. Just type it in below.';
const NO_CODE_Q = "Didn't receive a code? Check if your number is correct or ";
const INVALID_CODE = 'Invalid code. Please try again. ';
const RE_SEND = 'Resend';
const SENT = 'Sent';
const TIME_OUT = "You can't create a new OTP yet.";
const OUT_OF_TRIES =
  'Our systems have detected high usage of this feature from your account. Please try again later.';
const WAITE_MESSAGE =
  'Please wait at least 30 seconds for the code to arrive before retrying.';

const mapStateToProps = ({ referrals }) => ({
  referrals,
});

function EnterOTPScreen(props) {
  const { referrals } = props;
  const navigation = useNavigation();
  const route = useRoute();
  const otpRef = useRef();
  const [codeValid, setCodeValid] = useState(true);
  const [enteredOTP, setEnteredOTP] = useState('');
  const [checkMarkVisible, setCheckMarkVisible] = useState(false);
  const [outOfTries, setOutOfTries] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { country, phoneNumber } = route.params;
  const countryCode = country.callingCode[0];
  const phone_number = '+' + countryCode + phoneNumber;

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    ChatRoomManager.handleDynamicLink();
  }, []);


  const requestOTP = () => {
    const encodedNumber = formatNumberForBE(phone_number);
    AuthorizationManager.requestOTP(encodedNumber)
      .then(res => {
        setCheckMarkVisible(true);
        setCodeValid(true);
        setTimeout(() => setCheckMarkVisible(false), 5000);
      })
      .catch((err) => {
        const { status, data } = err.response;
        if (status === 403) {
          if (data.message === TIME_OUT) {
            triggerAlert();
          }
          if (data.message === OUT_OF_TRIES) setOutOfTries(true);
        }
      });
  };

  async function onCodeFilled(code) {
    const encodedNumber = formatNumberForBE(phone_number);
    MixPanelClient.trackEvent(OTP_ENTER_CODE);
    const inviteLink = referrals.invite_link;
    AuthorizationManager.handleOTPLogin(encodedNumber, code, inviteLink)
      .then((res) => {
        const { data, status } = res;
        setCodeValid(true);
        AuthorizationManager.loginSuccessHandler(LOGIN_PROVIDER_OTP, data);
      })
      .catch((err) => {
        MixPanelClient.trackEvent(OTP_ENTER_CODE_FAILED);
        const { status, data } = err.response;
        setCodeValid(false);
        setEnteredOTP('');
        AuthorizationManager.loginFailureHandler(data, status);
      });
  };

  const onCodeChanged = (code) => {
    setCodeValid(true);
    setEnteredOTP(code);
  };

  const triggerAlert = () => {
    Alert.alert('Resend Code', WAITE_MESSAGE, [{ text: 'OK' }], {
      cancelable: true,
    });
  };

  const onTouchableOpacityPress = () => {
    requestOTP();
    setOutOfTries(false);
  };

  const compileResendTextStyle = () => ({
    ...styles.resendText,
    color: codeValid ? Globals.color.text.grey : Globals.color.brand.primary,
  });

  const compileCodeInputFieldStyle = () => ({
    width: 30,
    height: 45,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: codeValid ? '#979797' : Globals.color.brand.primary,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
  });

  const compileCodeInputHighlightStyle = () => ({
    borderColor: codeValid ? '#979797' : Globals.color.brand.primary,
    borderBottomWidth: 1,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
  });

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        onDismiss={() => navigation.goBack()}
        backArrowColor={Globals.color.text.lightgrey}
        isTransparent={true}
      />
      <View style={styles.wrapper}>
        <Text style={styles.title}>{TITLE}</Text>
        <View style={{ marginTop: Globals.dimension.margin.tiny }}>
          <Text style={styles.subtitle}>{SUBTITLE}</Text>
          {mounted && (
            <OTPInputView
              ref={otpRef}
              style={styles.otpStyle}
              pinCount={6}
              code={enteredOTP}
              onCodeChanged={onCodeChanged}
              autoFocusOnLoad
              codeInputFieldStyle={compileCodeInputFieldStyle()}
              codeInputHighlightStyle={compileCodeInputHighlightStyle()}
              onCodeFilled={onCodeFilled}
            />
          )}
          <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <Text style={compileResendTextStyle()}>
              {codeValid && !outOfTries && NO_CODE_Q}
              {!codeValid && !outOfTries && INVALID_CODE}
              {outOfTries ? (
                OUT_OF_TRIES
              ) : (
                  <>
                    <Text
                      onPress={onTouchableOpacityPress}
                      style={styles.resendWord}>
                      {checkMarkVisible ? SENT : RE_SEND}
                    </Text>{' '}
                    {checkMarkVisible ? (
                      <CheckMarkIcon
                        color={Globals.color.button.blue}
                        size={14}
                        style={{ marginTop: -5 }}
                      />
                    ) : (
                        <></>
                      )}
                  </>
                )}
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(EnterOTPScreen);

const styles = StyleSheet.create({
  container: {
    paddingVertical: Globals.dimension.padding.medium,
    backgroundColor: Globals.color.brand.white,
  },
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  subtitle: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
  },
  otpStyle: {
    flexDirection: 'row',
    marginTop: Globals.dimension.margin.large,
    marginBottom: Globals.dimension.margin.small,
  },
  resendText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.tiny,
    textAlign: 'center',
  },
  resendWord: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.button.blue,
    lineHeight: Globals.font.lineHeight.tiny,
    textAlign: 'center',
  },
});
