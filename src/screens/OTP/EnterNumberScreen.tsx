import React, { useState, useRef, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import TinyArrow from '../../component-library/graphics/Icons/TinyArrow';
import Button from '../../component-library/Button';
import { countryCodeModalCloseIcon } from '../../component-library/graphics/Images';
import parsePhoneNumber from 'libphonenumber-js';
import AuthorizationManager from '../../services/auth/AuthorizationManager';
import { useRoute } from '@react-navigation/native';
import Globals from '../../component-library/Globals';
import { formatNumberForBE } from './OPTUtilities';
import MixPanelClient, {
  ENTER_PHONE_NUMBER,
  LOGIN_ENTER_NUMBER_FAILED,
} from '../../services/utility/MixPanelClient';

const TITLE = "What's your phone number?";
const SECURITY_TEXT =
  "We never share this with anyone and it won't be shown on your profile";
const INVALID_PHONE_NUMBER = 'Invalid phone number.';
const OUT_OF_TRIES =
  'Our systems have detected high usage of this feature from your account. Please try again later.';
const TIME_OUT = "You can't create a new OTP yet.";
const BLOCKED_COUNTRY =
  "Unfortunately, the app is not available in your country, yet. We're working hard to make the app available for everyone.";
const WAITE_MESSAGE =
  'Please wait at least 30 seconds for the code to arrive before retrying.';

export default function EnterNumberScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const textInputRef = useRef(null);
  const defaultCountry = {
    callingCode: ['49'],
    cca2: 'DE',
    currency: ['EUR'],
    flag: 'flag-de',
    name: 'Germany',
    region: 'Europe',
    subregion: 'Western Europe',
  };
  const [countryCode, setCountryCode] = useState(defaultCountry.cca2);
  const [country, setCountry] = useState(defaultCountry);
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [buttonActive, setButtonActive] = useState(false);
  const [isValidPhoneNumber, setIsValidPhoneNumber] = useState(true);
  const [outOfTries, setOutOfTries] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    textInputRef.current.focus();
  });

  useEffect(() => {
    const { callingCode, cca2 } = route.params;
    setCountry({ callingCode, cca2 });
    setCountryCode(cca2);
  }, []);

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCountry(country);
  };

  const internationalFormatter = (phoneNumber) => {
    const countryCode = country.callingCode[0];
    return '+' + countryCode + phoneNumber;
  };

  const isNumberPossible = (phoneNumber) => {
    let isPossible = false;

    const phoneNumberParsed = parsePhoneNumber(phoneNumber, countryCode);
    const countryCallingCode = `+${phoneNumberParsed?.countryCallingCode}`;
    if (phoneNumberParsed) {
      isPossible =
        phoneNumberParsed?.isPossible() && phoneNumberParsed?.isValid();
    }
    const numberExtracted = phoneNumberParsed
      ? phoneNumberParsed.number.toString()
      : '';
    const internationalNumberParsed = parsePhoneNumber(numberExtracted);
    const internationalFormat = internationalNumberParsed?.formatInternational();
    const nationalNumber = internationalFormat?.split(countryCallingCode)[1];

    return { isPossible, nationalNumber };
  };

  const onChangeText = (phoneNumber) => {
    const number = isNumberPossible(phoneNumber);
    const { isPossible, nationalNumber } = number;
    if (!isValidPhoneNumber) setIsValidPhoneNumber(true);
    if (nationalNumber?.length > 9) {
      setPhoneNumber(nationalNumber);
    } else {
      setPhoneNumber(phoneNumber);
    }

    isPossible ? setButtonActive(true) : setButtonActive(false);
  };

  const triggerAlert = () => {
    Alert.alert('Resend Code', WAITE_MESSAGE, [{ text: 'OK' }], {
      cancelable: true,
    });
  };

  function blockUser(message) {
    Alert.alert('App Not Available', message, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  }

  const requestOTP = () => {
    setOutOfTries(false);
    const phone_number_inter = internationalFormatter(phoneNumber);
    const encodedNumber = formatNumberForBE(phone_number_inter);
    setLoading(true);
    AuthorizationManager.requestOTP(encodedNumber)
      .then((res) => {
        navigation.navigate('EnterOTPScreen', { phoneNumber, country });
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        MixPanelClient.trackEvent(LOGIN_ENTER_NUMBER_FAILED);
        const { status, data } = err.response;
        if (status === 422) setIsValidPhoneNumber(false);
        if (status === 403) {
          const { message } = data;
          switch (message) {
            case TIME_OUT:
              triggerAlert();
              break;
            case OUT_OF_TRIES:
              setOutOfTries(true);
              break;
            case BLOCKED_COUNTRY:
              blockUser(message);
          }
        }
      });
  };

  const onPressHandler = () => {
    MixPanelClient.trackEvent(ENTER_PHONE_NUMBER);
    requestOTP();
  };

  const compileTextInputStyle = () => ({
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color:
      !isValidPhoneNumber || outOfTries
        ? Globals.color.brand.primary
        : Globals.color.text.default,
    width: '100%',
  });

  const compileLineStyle = () => ({
    width: '100%',
    height: 1,
    backgroundColor:
      !isValidPhoneNumber || outOfTries
        ? Globals.color.brand.primary
        : Globals.color.text.default,
    marginTop: Globals.dimension.margin.tiny,
    borderRadius: 100,
  });

  const compileInvalidPhoneNumberTextStyle = () => ({
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.xTiny,
    color:
      !isValidPhoneNumber || outOfTries
        ? Globals.color.brand.primary
        : Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.tiny,
    textAlign: 'center',
  });

  const renderCountryFilter = (props) => {
    return (
      <View style={styles.searchBar}>
        <View style={styles.searchBarContainer}>
          <TextInput
            {...props}
            placeholder={'Search'}
            style={styles.searchPlaceholder}
          />
        </View>
      </View>
    );
  };

  const FilterListProps = {
    ItemSeparatorComponent: () => <View style={styles.itemSeparatorStyle} />,
  };

  function renderContinueButton() {
    function displayIcon() {
      if (loading)
        return (
          <ActivityIndicator
            style={{ marginLeft: Globals.dimension.margin.mini }}
            size="small"
            color={Globals.color.brand.white}
          />
        );
    }

    return (
      <KeyboardAvoidingView
        style={styles.bottomBarContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.securityText}>{SECURITY_TEXT}</Text>

        <Button
          primary
          title={'Continue'}
          onPress={onPressHandler}
          disabled={!buttonActive}
          iconRight={displayIcon()}
          hapticFeedback
        />
      </KeyboardAvoidingView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        onDismiss={() => navigation.goBack()}
        backArrowColor={Globals.color.text.lightgrey}
        isTransparent={true}
      />
      <View style={styles.wrapper}>
        <Text style={styles.title}>{TITLE}</Text>
        <View style={styles.textInputWrapper}>
          <View style={{ flexDirection: 'row' }}>
            <CountryPicker
              withCallingCodeButton
              countryCode={countryCode}
              withFilter
              withFlag
              withAlphaFilter176
              withCallingCode
              withEmoji
              withAlphaFilter={false}
              onSelect={onSelect}
              filterProps={styles.filterProps}
              closeButtonImage={countryCodeModalCloseIcon}
              closeButtonStyle={styles.closeButtonStyle}
              closeButtonImageStyle={styles.closeButtonImageStyle}
              renderCountryFilter={renderCountryFilter}
              flatListProps={FilterListProps}
              visible={isFilterVisible}
              containerButtonStyle={{ marginRight: 20 }}
              theme={styles.themeStyle}
              onClose={() => setIsFilterVisible(false)}
            />

            <TouchableOpacity
              onPress={() => setIsFilterVisible(true)}
              style={styles.arrowContainer}>
              <TinyArrow
                width={15}
                height={15}
                color={Globals.color.text.default}
              />
            </TouchableOpacity>
            <TextInput
              ref={textInputRef}
              style={compileTextInputStyle()}
              onChangeText={onChangeText}
              value={phoneNumber}
              placeholderTextColor={Globals.color.text.lightgrey}
              placeholder={''}
              selectionColor={Globals.color.text.default}
              multiline={false}
              keyboardAppearance={'light'}
              keyboardType="numeric"
              maxLength={17}
              textContentType={'telephoneNumber'}
            />
          </View>
          <View style={compileLineStyle()} />
          <View style={{ marginTop: Globals.dimension.margin.tiny }}>
            {isValidPhoneNumber ? null : (
              <Text style={compileInvalidPhoneNumberTextStyle()}>
                {INVALID_PHONE_NUMBER}
              </Text>
            )}
            {outOfTries ? (
              <Text style={compileInvalidPhoneNumberTextStyle()}>
                {OUT_OF_TRIES}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
      {renderContinueButton()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
  },
  wrapper: {
    flex: 1,
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  textInputWrapper: {
    width: '100%',
    marginTop: Globals.dimension.margin.small,
  },
  textInput: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
    width: '100%',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Globals.color.text.lightgrey,
    marginTop: Globals.dimension.margin.tiny,
    borderRadius: 100,
  },
  arrowContainer: {
    justifyContent: 'center',
    marginLeft: -15,
    marginRight: Globals.dimension.margin.tiny,
    paddingTop: 3,
  },
  securityText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.padding.mini,
    textAlign: 'center',
  },
  securityTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Globals.dimension.margin.medium,
    backgroundColor: 'green',
  },
  searchBar: {
    flex: 1,
    height: 40,
    marginRight: Globals.dimension.margin.mini,
  },
  searchBarContainer: {
    flexDirection: 'row',
    flex: 1,
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: Globals.dimension.borderRadius.large,
  },
  filterProps: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginLeft: Globals.dimension.margin.tiny,
  },
  searchPlaceholder: {
    flex: 1,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginLeft: Globals.dimension.margin.tiny,
  },
  closeButtonImageStyle: {
    width: 13,
    height: 13,
  },
  closeButtonStyle: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
    marginHorizontal: Globals.dimension.margin.mini,
  },
  themeStyle: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
  },
  itemSeparatorStyle: {
    borderBottomColor: Globals.color.text.grey,
    borderBottomWidth: 1.5,
    width: '75%',
    alignSelf: 'center',
  },
  errorMessageContainer: {
    marginTop: Globals.dimension.margin.tiny,
  },
  bottomBarContainer: {
    width: '100%',
    bottom: 0,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
});
