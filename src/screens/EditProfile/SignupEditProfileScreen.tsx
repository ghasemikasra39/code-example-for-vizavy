import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  AppState,
  Alert,
  SafeAreaView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { connect } from 'react-redux';
import Globals from '../../component-library/Globals';
import UserProfileManager from '../../services/api/UserProfileManager';
import AppStatusSlice, {
  AppStatusActionsPropsInterface,
  AppStatusStatePropsInterface,
} from '../../store/slices/AppStatusSlice';
import { UserProfileStatePropsInterface } from '../../store/slices/UserProfileSlice';
import MixPanelClient, {
  CONFIRM_PROFILE,
  COMPLETE_REGISTRATION,
  REGISTRATION_DATE,
  SIGN_UP_ADD_NAME,
  SIGN_UP_ADD_IMAGE,
  SIGN_UP_CONTINUE_ENABLED_PERMISSIONS,
  ENABLE_LOCATION,
  SUPER_NAME,
  SUPER_GENDER,
  SIGN_UP_ADD_AGE_GENDER,
  SUPER_DATE_OF_BIRTH,
  SIGN_UP_OPEN_SYSTEM_PERMISSIONS,
  JOINED_VIA_INVITE_LINK,
  INVITED_BY_USER,
} from '../../services/utility/MixPanelClient';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import { useNavigation, useRoute } from '@react-navigation/native';
import InitialLoadingService from '../../services/utility/InitialLoadingService';
import Button from '../../component-library/Button';
import PermissionRequester from '../../services/utility/PermissionRequester';
import LocationManager from '../../services/api/LocationManager';
import ProgressBar from '../../component-library/ProgressBar';
import ConfirmCancelModal from '../../modals/ConfirmCancelModal';
import EditNameComponent from './EditNameComponent';
import EditProfilePictureComponent from './EditProfilePictureComponent';
import EnablePermissionsComponent from './EnablePermissionsComponent';
import LocationDeniedComponent from './LocationDeniedComponent';
import { Bugtracker } from '../../services/utility/BugTrackerService';
import { actionCreators } from '../../store/actions';
import { store } from '../../store';
import EditAgeGenderComponent from './EditAgeGenderComponent';
import { formateDateForBE, windowWidth } from '../ChatRoom/ChatroomUtils';
import InvitedThroughFriendComponent from './InvitedThroughFriendComponent';

/**
 * Map Redux state to the props
 * @function mapStateToProps
 * @param {Redux state}
 * @return {Object} maps state to props
 */
const mapStateToProps = ({ userProfile, appStatus }) => ({
  userProfile,
  appStatus,
});

function SignupEditProfileScreen(props: Props) {
  const navigation = useNavigation();
  const route = useRoute();
  const returnRoute = route.params?.returnRoute;
  const screenSequenceRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState(props.userProfile.name || '');
  const [scrollIndex, setScrollIndex] = useState(0);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [] = useState(false);
  const [askedForLocation, setAskedForLocation] = useState(false);
  const [askedForNotification] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [inviter, setInviter] = useState(null);
  const [invitee, setInvitee] = useState(null);

  useEffect(() => {
    markSignUpInProgress(true);
  }, []);

  useEffect(() => {
    setInvitee(route.params?.data?.user);
    setInviter(route.params?.data?.invited_by_user);
  }, [route]);

  useEffect(() => {
    if (props.userProfile.name) setText(props.userProfile.name);
    if (props.userProfile.profilePictureUrl) {
      setProfilePictureUrl(props.userProfile.profilePictureUrl);
    }
    if (props.userProfile.gender) {
      setGender(props.userProfile.gender);
    }
    if (props.userProfile.dayOfBirth) {
      setDateOfBirth(props.userProfile.dayOfBirth);
    }
  }, [props.userProfile.name, props.userProfile.profilePictureUrl]);

  useEffect(() => {
    if (scrollIndex === 4) {
      AppState.addEventListener('change', () =>
        handleLocationPermissionRequestAsync(),
      );
    }

    return () => {
      AppState.removeEventListener('change', () =>
        handleLocationPermissionRequestAsync(),
      );
    };
  }, [
    askedForLocation,
    askedForNotification,
    scrollIndex,
    handleLocationPermissionRequestAsync,
  ]);

  /**
   * Update the date of birth value
   * @function updateDateOfBirth
   */
  function updateDateOfBirth(newDateOfBirth: number) {
    setDateOfBirth(newDateOfBirth);
  }

  /**
   * Update the gender value
   * @function updateGender
   */
  function updateGender(newGender: string) {
    setGender(newGender);
  }

  /**
   * Mark signup in progress in order to lead the user back to this screen if he kills the app during sign up
   * @function markSignUpInProgress
   */
  function markSignUpInProgress(workInProgress: Boolean) {
    const inProgress = actionCreators.appStatus.markSignUpInProgress(
      workInProgress,
    );
    store.dispatch(inProgress);
  }

  /**
   * Delete the referral link that indicates the user that he or she was invited by a friend
   * @function clearReferralLink
   */
  function clearReferralLink() {
    const action = actionCreators.referrals.setInviteLink(null);
    store.dispatch(action);
  }

  function precedScrollIndex() {
    const newScrollIndex = scrollIndex + 1;
    screenSequenceRef.current.scrollToIndex({
      animated: true,
      index: newScrollIndex,
    });
    setScrollIndex(newScrollIndex);
    setShowConfirmModal(false);
  }

  function checkLocation() {
    LocationManager.checkLocation();
  }

  /**
   * Navigate forward in the sequence
   * @function continueSignUp
   */
  async function continueSignUp() {
    const addition = inviter ? 1 : 0;
    if (inviter && scrollIndex === 0) {
      precedScrollIndex();
      return;
    }
    switch (scrollIndex) {
      case 0 + addition:
        MixPanelClient.trackEvent(SIGN_UP_ADD_NAME);
        precedScrollIndex();
        break;
      case 1 + addition:
        MixPanelClient.trackEvent(SIGN_UP_ADD_AGE_GENDER);
        precedScrollIndex();
        break;
      case 2 + addition:
        MixPanelClient.trackEvent(SIGN_UP_ADD_IMAGE);
        updateProfile();
        break;
      case 3 + addition:
        if (showConfirmModal) {
          moveForward();
          toggleConfirmModal();
          return;
        }
        const granted = await handleLocationPermissionRequestAsync();
        if (granted) {
          completeRegistration();
          checkLocation();
        } else {
          moveForward();
        }
        MixPanelClient.trackEvent(SIGN_UP_CONTINUE_ENABLED_PERMISSIONS);
        break;
      case 4 + addition:
        if (locationEnabled) {
          MixPanelClient.trackEvent(SIGN_UP_CONTINUE_ENABLED_PERMISSIONS);
          completeRegistration();
          checkLocation();
        } else {
          handleOpenSettingsAsync();
          MixPanelClient.trackEvent(SIGN_UP_OPEN_SYSTEM_PERMISSIONS);
        }
        break;
    }
  }

  /**
   * Post profile information to Backend
   * @function updateProfile
   */
  async function updateProfile() {
    const handler = (res) => {
      setIsLoading(false);
      if (res?.success) {
        UserProfileManager.updateProfilePictureBase64(profilePictureUrl);
        precedScrollIndex();
      }
    };

    setIsLoading(true);
    const formattedDateOfBirth = formateDateForBE(dateOfBirth);
    UserProfileManager.updateAsync({
      name: text,
      profilePictureUrl: profilePictureUrl,
      gender: gender !== 'Not Specified' ? gender : null,
      dateOfBirth: formattedDateOfBirth,
      invited_by_user: inviter ? inviter?.internal_id : null,
    })
      .then(handler)
      .catch(() => setIsLoading(false));
    UserProfileManager.updateUserProfilePicture(profilePictureUrl);
  }

  /**
   * Navigate back in the sequence
   * @function navigateBack
   */
  function navigateBack() {
    if (scrollIndex > 0) {
      screenSequenceRef.current.scrollToIndex({
        animated: true,
        index: scrollIndex - 1,
      });
      setScrollIndex(scrollIndex - 1);
    }
  }

  /**
   * Navigate forward in the sequence
   * @function moveForward
   */
  function moveForward(customScrollIndex?: number, animated?: boolean) {
    const index = customScrollIndex ? customScrollIndex : scrollIndex + 1;
    screenSequenceRef.current.scrollToIndex({
      animated: animated,
      index,
    });
    setScrollIndex(index);
  }

  /**
   * Complete registration and navigate the user to the ExplainerSeqeenceScreen
   * @function completeRegistration
   */
  function completeRegistration() {
    const formattedDateOfBirth = formateDateForBE(dateOfBirth);
    function trackName() {
      MixPanelClient.trackEvent(CONFIRM_PROFILE);
      MixPanelClient.registerSuperProperty(SUPER_NAME, text);
      MixPanelClient.trackUserInformation({
        $name: text,
        [SUPER_GENDER]: gender,
        [SUPER_DATE_OF_BIRTH]: formattedDateOfBirth,
        [JOINED_VIA_INVITE_LINK]: inviter ? true : false,
        [INVITED_BY_USER]: inviter ? inviter.name : '',
      });
    }

    function trackDate() {
      //Track Mixpanel properties
      MixPanelClient.trackEvent(COMPLETE_REGISTRATION);
      MixPanelClient.registerSuperProperty(
        REGISTRATION_DATE,
        new Date().toISOString(),
      );
      MixPanelClient.trackUserInformation({
        [REGISTRATION_DATE]: new Date().toISOString(),
      });
    }
    trackName();
    trackDate();
    markSignUpInProgress(false);
    clearReferralLink();
    InitialLoadingService.loadAllData();
    navigation.navigate('ExplainerSequenceScreen');
  }

  /**
   * Ask the user to enable his location
   * This method is called only once
   * @function handleLocationPermissionRequestAsync
   */
  async function handleLocationPermissionRequestAsync() {
    const locationGranted = await LocationManager.triggerLocationSubmissionAsync();
    if (locationGranted) {
      MixPanelClient.trackEvent(ENABLE_LOCATION);
      setLocationEnabled(true);
      setAskedForLocation(true);
    } else {
      setLocationEnabled(false);
      setAskedForLocation(true);
    }
    return locationGranted;
  }

  /**
   * Navigate the user outside the app to enable his location
   * @function handleOpenSettingsAsync
   */
  async function handleOpenSettingsAsync() {
    await PermissionRequester.openSettingsAsync();
  }

  /**
   * Toogle the confirmation modal
   * @function toggleConfirmModal
   */
  function toggleConfirmModal() {
    setShowConfirmModal(!showConfirmModal);
  }

  /**
   * Activate the continue button
   * @function getButtonActiveStatus
   */
  function getButtonActiveStatus() {
    const addition = inviter ? 1 : 0;
    if (inviter && scrollIndex === 0) {
      return false;
    }
    switch (scrollIndex) {
      case 0 + addition:
        if (text.length) {
          return false;
        }
        return true;
      case 1 + addition:
        if (dateOfBirth && gender) {
          return false;
        }
        return true;
      case 2 + addition:
        if (profilePictureUrl) {
          return false;
        }
        return true;
      case 3 + addition:
        if (askedForLocation && askedForNotification) {
          return false;
        }
      case 4:
        return false;
      default:
        return true;
    }
  }

  /**
   * Change the button title
   * @function getButtonTitle
   */
  function getButtonTitle() {
    const addition = inviter ? 1 : 0;
    switch (scrollIndex) {
      case 3 + addition:
        if (locationEnabled) {
          return 'Continue';
        } else {
          return 'Allow Location';
        }
      case 4 + addition:
        if (!locationEnabled) {
          return 'Open Settings';
        }
        return 'Continue';
      default:
        return 'Continue';
    }
  }

  function getExplainerText() {
    const addition = inviter ? 1 : 0;
    switch (scrollIndex) {
      case 2 + addition:
        return 'All users have a profile picture. Please add a picture to make it easier for others to connect with you.☺️';
      case 1 + addition:
        return 'We do not share any of your data and take your privacy very seriously.';
      default:
        return null;
    }
  }

  /**
   * Displaz loading indicator if needed
   * @function displayIcon
   */
  function displayIcon() {
    if (isLoading)
      return (
        <ActivityIndicator
          style={{ marginLeft: Globals.dimension.margin.mini }}
          size="small"
          color={Globals.color.brand.white}
        />
      );
  }

  function renderWarningsIcon() {
    return <Text style={styles.warningsIcon}>✋🏽</Text>;
  }

  const renderInvitedThroughFriendsScreen = useMemo(() => {
    return (
      <InvitedThroughFriendComponent invitee={invitee} inviter={inviter} />
    );
  }, [invitee, inviter]);

  const renderEditNameScreen = useMemo(() => {
    const initialIndex = inviter ? 1 : 0;
    return (
      <EditNameComponent
        text={text}
        loading={props.userProfile.loading}
        updateName={(name) => setText(name)}
        openKeyboard={scrollIndex === initialIndex}
      />
    );
  }, [text, props.userProfile, scrollIndex, inviter]);

  const renderAgeGenderScreen = useMemo(
    () => (
      <EditAgeGenderComponent
        dateOfBirth={dateOfBirth}
        gender={gender}
        updateDateOfBirth={updateDateOfBirth}
        updateGender={updateGender}
      />
    ),
    [scrollIndex, dateOfBirth, gender],
  );

  const renderEditProfileScreen = useMemo(
    () => (
      <EditProfilePictureComponent
        name={text}
        loading={props.userProfile.loading}
        updateProfilePicture={(profileUrl) => setProfilePictureUrl(profileUrl)}
        profilePicture={profilePictureUrl}
      />
    ),
    [text, profilePictureUrl, props.userProfile],
  );

  function renderEnableLocationsScreen() {
    return <EnablePermissionsComponent />;
  }

  const renderLocationDeniedScreen = useMemo(
    () => <LocationDeniedComponent name={text} />,
    [text],
  );

  function getScreens() {
    if (inviter) {
      return [
        renderInvitedThroughFriendsScreen,
        renderEditNameScreen,
        renderAgeGenderScreen,
        renderEditProfileScreen,
        renderEnableLocationsScreen(),
        renderLocationDeniedScreen,
      ];
    }
    return [
      renderEditNameScreen,
      renderAgeGenderScreen,
      renderEditProfileScreen,
      renderEnableLocationsScreen(),
      renderLocationDeniedScreen,
    ];
  }
  const showSkipButton = scrollIndex === (!inviter ? 3 : 4) && !locationEnabled;
  return (
    <KeyboardAvoidingView
      style={{
        ...styles.container,
        backgroundColor: Globals.color.background.dark,
      }}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={styles.container}>
        <CustomHeaderBar
          onDismiss={() => navigateBack()}
          backArrowColor={!returnRoute ? Globals.color.text.lightgrey : null}
          userProfileInitialized={scrollIndex !== 0}
          skip={showSkipButton}
          onPress={showSkipButton && toggleConfirmModal}
          isTransparent={true}
        />
        {!returnRoute ? (
          <View style={styles.progressBarContainer}>
            <ProgressBar
              total={getScreens()?.length}
              progressIndex={scrollIndex + 1}
            />
          </View>
        ) : null}
        <FlatList
          ref={screenSequenceRef}
          data={getScreens()}
          renderItem={({ item }) => item}
          horizontal={true}
          scrollEnabled={false}
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />

        <View style={styles.buttonContainer}>
          <Text style={styles.infoText}>{getExplainerText()}</Text>
          <Button
            style={styles.submitButton}
            title={getButtonTitle()}
            onPress={() => continueSignUp()}
            iconRight={displayIcon()}
            primary
            disabled={getButtonActiveStatus()}
            hapticFeedback
          />
        </View>
      </SafeAreaView>
      <ConfirmCancelModal
        showConfirmCancelModal={showConfirmModal}
        toggleConfirmCancelModal={toggleConfirmModal}
        onConfirm={continueSignUp}
        confirmText={'Skip'}
        cancelText={'Enable'}
        title={'Are you sure?'}
        text={'Youpendo will not work without these permissions.'}
        icon={renderWarningsIcon()}
      />
    </KeyboardAvoidingView>
  );
}

type EditProfileScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'EditProfile'
>;
type EditProfileScreenRouteProp = RouteProp<AppStackParamList, 'EditProfile'>;

interface Props
  extends AppStatusActionsPropsInterface,
    AppStatusStatePropsInterface,
    UserProfileStatePropsInterface {
  navigation: EditProfileScreenNavigationProp;
  route: EditProfileScreenRouteProp;
}

export default connect(
  mapStateToProps,
  AppStatusSlice.actions,
)(SignupEditProfileScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
  },
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.large,
    paddingVertical: Globals.dimension.padding.medium,
  },
  submitButton: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: '#C4C4C4',
    borderRadius: Globals.dimension.borderRadius.large,
    elevation: 15,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: Globals.dimension.margin.small,
  },
  infoText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    marginTop: Globals.dimension.margin.medium,
    textAlign: 'center',
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  checkmarkContainer: {
    width: 30,
    height: 30,
    backgroundColor: Globals.color.button.disabled,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: 13,
    height: 10,
  },
  failedContainer: {
    width: 40,
    height: 40,
    borderRadius: 100,
    backgroundColor: Globals.color.brand.primary,
    borderWidth: 3,
    borderColor: Globals.color.background.light,
    elevation: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    marginBottom: Globals.dimension.margin.tiny,
  },
  exclamationMark: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
  },
  warningsIcon: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  explainerHeader: {
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  howTo: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.grey,
  },
  progressBarContainer: {
    width: windowWidth,
    backgroundColor: 'green',
  },
});
