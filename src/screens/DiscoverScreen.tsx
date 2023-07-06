import React, {useRef, useEffect, useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  Text,
  Alert
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {connect} from 'react-redux';
import {useRoute, useNavigation} from '@react-navigation/native';
import PaperPlaneDetailsItem from '../screens/PaperPlane/PaperPlaneDetailsItem';
import Globals from '../component-library/Globals';
import PaperPlaneManager from '../services/api/PaperPlaneManager';
import MixPanelClient, {
  OPEN_PAPER_PLANE,
  LAST_PAPER_PLANE_RECEIVED,
  LIFETIME_PAPER_PLANES_RECEIVED,
  FIRST_PAPER_PLANE_RECEIVED,
  SIGN_UP_ENABLE_PUSH,
} from '../services/utility/MixPanelClient';
import PersistedMetric from '../services/utility/PersistedMetric';
import SearchHeader from '../component-library/SearchHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import PushNotificationSubscriber, {
  NOTIFICATIONS_NOT_APPROVED,
} from '../services/api/PushNotificationSubscriber';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import {store} from '../store';
import {actionCreators} from '../store/actions';
import LottieView from 'lottie-react-native';
import {swipeUp} from '../component-library/graphics/Images';
import PaperPlaneLoadingIndicator from '../component-library/LoadingIndicator/PaperPlaneLoadingIndicator';

const mapStateToProps = ({userProfile, paperPlanes, appStatus}) => ({
  userProfile,
  paperPlanes,
  appStatus,
});

function DiscoverScreen(props) {
  const {paperPlanes, appStatus} = props;
  const carouselRef = useRef();
  const route = useRoute();
  const navigation = useNavigation();
  const width = Dimensions.get('window').width;
  const height = Dimensions.get('window').height;
  const [isFocused, setIsFocused] = useState(false);
  const [
    showEnabledNotificationsModal,
    setShowEnabledNotifictionsModal,
  ] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
  const MAX_LENGTH_PAPER_PLANES = 40;

  const onboardingSwipeUpSeenRef = useRef(appStatus.onboardingSwipeUpSeen);
  onboardingSwipeUpSeenRef.current = appStatus.onboardingSwipeUpSeen;
  const paperPlaneRef = useRef(paperPlanes.paperPlanes);
  paperPlaneRef.current = paperPlanes.paperPlanes;

  useEffect(() => {
    addEventListeners();
    checkPushNotifPermission();


    return () => removeEventListener();
  }, []);

  /**
   * Check weather the screen is focused or not focused
   * @method addEventListeners
   */
  function addEventListeners() {
    navigation.addListener('focus', onDidFocus);
    navigation.addListener('blur', onDidBlur);
  }

  /**
   * Remove event handlers
   * @method removeEventListener
   */
  function removeEventListener() {
    navigation.removeListener('focus', onDidFocus);
    navigation.removeListener('blur', onDidBlur);
  }

  /**
   * Focus view
   * @method onDidFocus
   */
  function onDidFocus() {
    setIsFocused(true);
  }

  /**
   * Blur view
   * @method onDidBlur
   */
  function onDidBlur() {
    setIsFocused(false);
  }

  /**
   * Fetch next paper plane when swiping through list
   * @method callNextPape
   */
  function callNextPape() {
    const currentIndex = getCurrentActiveSlide();
    const paperPlaneLength = paperPlaneRef.current?.length;
    if (paperPlaneLength >= MAX_LENGTH_PAPER_PLANES) {
      if (currentIndex === paperPlaneLength - 1) {
        resetPaperPlaneList();
      }
      return;
    }
    if (currentIndex >= paperPlaneLength - 2) {
      PaperPlaneManager.requestPaperPlanesAsync();
    }
  }

  /**
   * Reset Paper Plane list and catch next paper plane
   * @method resetPaperPlaneList
   */
  async function resetPaperPlaneList() {
    setShowLoadingIndicator(true);
    await resetPaperPlaneArrayRedux();
    PaperPlaneManager.requestPaperPlanesAsync().then(() =>
      hideLoadingIndicator(),
    );
  }

  /**
   * Reset Paper Plane list in redux
   * @method resetPaperPlaneArrayRedux
   */
  async function resetPaperPlaneArrayRedux() {
    return new Promise((resolve) => {
      const action = actionCreators.paperPlanes.reset();
      store.dispatch(action);
      resolve();
    });
  }

  /**
   * Set current active scroll index
   * @method setCurrentActiveSlide
   */
  function getCurrentActiveSlide() {
    const currentIndex = carouselRef.current.currentIndex;
    updateFocusIndexRedux(currentIndex);
    return currentIndex;
  }

  /**
   * Save the current focus index in redux
   * @method updateFocusIndexRedux
   */
  function updateFocusIndexRedux(index: number) {
    const action = actionCreators.paperPlanes.setFocusIndex(index);
    store.dispatch(action);
  }

  /**
   * Callback when snapping to an item
   * @method onSnapToItem
   */
  function onSnapToItem() {
    trackMixpanelData();
    callNextPape();
  }

  /**
   * Track mixpanel data
   * @method trackMixpanelData
   */
  function trackMixpanelData() {
    MixPanelClient.trackEvent(OPEN_PAPER_PLANE);
    MixPanelClient.trackEvent(OPEN_PAPER_PLANE);
    if (!PersistedMetric.has(FIRST_PAPER_PLANE_RECEIVED)) {
      PersistedMetric.set(FIRST_PAPER_PLANE_RECEIVED, new Date().toISOString());
      MixPanelClient.trackUserInformationOnce({
        [FIRST_PAPER_PLANE_RECEIVED]: new Date().toISOString(),
      });
    }
    MixPanelClient.trackUserInformation({
      [LAST_PAPER_PLANE_RECEIVED]: new Date().toISOString(),
      [LIFETIME_PAPER_PLANES_RECEIVED]: PersistedMetric.increment(
        LIFETIME_PAPER_PLANES_RECEIVED,
      ),
    });
  }

  /**
   * check if user allowed push notification, if not ask for permission
   * This method is called only once
   * @method checkPushNotifPermission
   */
  async function checkPushNotifPermission() {
    const enabledNotifications = await PushNotificationSubscriber.checkNotificationsEnabledStatus();
    if (
      enabledNotifications === NOTIFICATIONS_NOT_APPROVED &&
      onboardingSwipeUpSeenRef.current &&
      !appStatus.askedForNotificationPermissions
    ) {
      setShowEnabledNotifictionsModal(true);
    }
  }

  /**
   * Request notifications
   * @method requestNotifications
   */
  async function requestNotifications() {
    setShowEnabledNotifictionsModal(false);
    const enabled = await PushNotificationSubscriber.requestUserPermission();
    if (enabled) {
      MixPanelClient.trackEvent(SIGN_UP_ENABLE_PUSH);
    }
    updateAskedNotificationsPermissionStatusRedux(true);
  }

  function updateAskedNotificationsPermissionStatusRedux(asked: boolean) {
    const action = actionCreators.appStatus.setAskedForNotificationPermissions(
      asked,
    );
    store.dispatch(action);
  }

  /**
   * Toggle the allow notification modal
   * @method toggleNotificationsModal
   */
  function toggleNotificationsModal() {
    setShowEnabledNotifictionsModal(!showEnabledNotificationsModal);
    updateAskedNotificationsPermissionStatusRedux(true);
  }

  /**
   * Mark swipe right animation as seen
   * @method markSwipeAsSeen
   */
  function markSwipeAsSeen() {
    const action = actionCreators.appStatus.markOnboardingSwipeUpSeen(true);
    store.dispatch(action);
    setTimeout(() => {
      checkPushNotifPermission();
    }, 500);
  }

  /**
   * Scroll to next item
   * @method goToNext
   */
  function goToNext() {
    carouselRef.current?.snapToNext();
  }

  /**
   * Hide loading indicator
   * @method hideLoadingIndicatortainer
   */
  function hideLoadingIndicator() {
    setTimeout(() => setShowLoadingIndicator(false), 500);
  }

  const renderSwipeUpExplainer = useMemo(() => {
    return !onboardingSwipeUpSeenRef.current ? (
      <TouchableWithoutFeedback onPress={markSwipeAsSeen}>
        <View style={styles.swipeUpContainer}>
          <Text style={styles.swipeExplainer}>
            Swipe to catch next paper plane
          </Text>
          <LottieView
            source={swipeUp}
            autoPlay={true}
            style={styles.swipeRight}
            speed={0.9}
          />
        </View>
      </TouchableWithoutFeedback>
    ) : null;
  }, [onboardingSwipeUpSeenRef.current]);

  const renderLoadingIndicator = useMemo(() => {
    return showLoadingIndicator ? <PaperPlaneLoadingIndicator/> : null;
  }, [showLoadingIndicator]);

  function renderItem({item, index}) {
    return (
      <PaperPlaneDetailsItem
        item={item}
        currentFocusedIndex={paperPlanes.focusIndex}
        index={index}
        userProfile={props.userProfile}
        navigation={navigation}
        route={route}
        isFocused={isFocused}
        returnRoute={route?.params?.returnRoute}
        goToNext={goToNext}
      />
    );
  }

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={paperPlaneRef.current}
        inactiveSlideScale={1}
        itemHeight={height}
        itemWidth={width}
        renderItem={renderItem}
        sliderHeight={height}
        sliderWidth={width}
        enableSnap={true}
        ListFooterComponent={() => <PaperPlaneLoadingIndicator/>}
        onSnapToItem={onSnapToItem}
        getKeyExtractor={(item) => item?.id.toString()}
        decelerationRate={0}
        keyboardShouldPersistTaps={'handled'}
        scrollEnabled={true}
        vertical
        getItemLayout={(data, index) => ({
          length: height,
          offset: height * index,
          index,
        })}
      />
      <SafeAreaView style={styles.searchHeaderContainer}>
        <SearchHeader title={'Discover'}/>
      </SafeAreaView>
      <ConfirmCancelModal
        key={'AllowContactsModal'}
        showConfirmCancelModal={showEnabledNotificationsModal}
        confirmText={'Notifiy me'}
        cancelText={'Not now'}
        title={'Enable Notifications'}
        text={`Find out when people message you or you get new friend requests.`}
        toggleConfirmCancelModal={toggleNotificationsModal}
        onConfirm={requestNotifications}
      />
      {renderLoadingIndicator}
      {renderSwipeUpExplainer}
    </View>
  );
}

export default connect(mapStateToProps)(DiscoverScreen);
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Globals.color.background.dark,
  },
  loadingContainer: {
    position: 'absolute',
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.dark,
  },
  loadingWrapper: {
    width: '100%',
    height: '100%',
  },
  loadingFooterContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Globals.color.background.dark,
    alignItems: 'center',
  },
  searchHeaderContainer: {
    width: width,
    position: 'absolute',
  },
  loadingIndicatorContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  swipeUpContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
    zIndex: 10,
  },
  swipeExplainer: {
    width: '60%',
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.light,
    lineHeight: Globals.font.lineHeight.medium,
    marginBottom: Globals.dimension.margin.mini,
    textAlign: 'center',
  },
  swipeRight: {
    width: '100%',
  },
});
