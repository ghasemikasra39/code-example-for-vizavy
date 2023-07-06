import React, { useMemo, useEffect, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import * as Device from 'expo-device';
import Video from 'react-native-video';
import { connect } from 'react-redux';

import Globals from '../component-library/Globals';
import { store } from '../store';
import { actionCreators } from '../store/actions';
import PaperPlaneManager from '../services/api/PaperPlaneManager';
import LottieView from 'lottie-react-native';
import MixPanelClient, {
  FIRST_PAPER_PLANE_RECEIVED,
  LAST_PAPER_PLANE_RECEIVED,
  LIFETIME_PAPER_PLANES_RECEIVED,
  OPEN_PAPER_PLANE,
} from '../services/utility/MixPanelClient';
import PersistedMetric from '../services/utility/PersistedMetric';
import { useNavigation } from '@react-navigation/native';
import {
  catchPaperPlane,
  tapToCatch,
  paperplanesBackground,
} from '../component-library/graphics/Images';
import { isIos } from '../services/utility/Platform';
import FadeInOut from '../Animated Hooks/FadeInOut';
import AnnouncementModal from '../modals/AnnouncementModal';
import SearchHeader from '../component-library/SearchHeader';
import { SafeAreaView } from 'react-native-safe-area-context';

const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

function ReceivePaperPlaneScreen(props) {
  const navigation = useNavigation();
  const animationTapHere = useRef();
  const animationTapToCatch = useRef();
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [isCatchingPaperPlane, setIsCatchingPaperPlane] = useState(false);
  const [caughtPaperPlane, setCaughtPaperPlane] = useState(null);
  const [, setLottiIsPlaying] = useState(false);
  const [lottiFinishedPlaying, setLottiFinishedPlaying] = useState(false);
  const { markTapToShare } = props.appStatus;

  useEffect(() => {
    addNavigationListener();
    return () => removeNavigationListeners();
  }, []);

  useEffect(() => {
    if (lottiFinishedPlaying) {
      navigateToPaperPlaneDetailsScreen();
    }
  }, [lottiFinishedPlaying, caughtPaperPlane]);

  /**
   * subscribe to navigation onFocus and onBlur listener
   * @method addNavigationListener
   */
  function addNavigationListener() {
    navigation.addListener('focus', () => onDidFocus());
    navigation.addListener('blur', () => onDidBlur());
  }

  function removeNavigationListeners() {
    navigation.removeListener('focus', () => onDidFocus());
    navigation.removeListener('blur', () => onDidBlur());
  }

  /**
   * Gets called when user is on the screen
   * @method onDidFocus
   */
  function onDidFocus() {
    setIsVideoPaused(false);
  }

  /**
   * Gets called when user leaves the screen
   * @method onDidBlur
   */
  function onDidBlur() {
    setIsVideoPaused(true);
  }

  /**
   * Request a new paper plane
   * @method catchPaperPlaneAsync
   */
  async function catchPaperPlaneAsync() {
    setIsCatchingPaperPlane(true);
    PaperPlaneManager.requestPaperPlaneAsync()
      .then((paperPlane) => {
        setIsCatchingPaperPlane(false);
        setCaughtPaperPlane(paperPlane.paperplane);
        playLottieAnimation();
        if (!markTapToShare) {
          toogleTapToShareExplainer();
        }
        MixPanelClient.trackEvent(OPEN_PAPER_PLANE);
        if (!PersistedMetric.has(FIRST_PAPER_PLANE_RECEIVED)) {
          PersistedMetric.set(
            FIRST_PAPER_PLANE_RECEIVED,
            new Date().toISOString(),
          );
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
      })
      .catch(() => setIsCatchingPaperPlane(false));
  }

  /**
   * Navigate to PaperPlaneDetailsScreen
   * @method navigateToPaperPlaneDetailsScreen
   */
  function navigateToPaperPlaneDetailsScreen() {
    navigation.navigate('PaperPlaneDetails', {
      paperPlane: caughtPaperPlane,
      returnRoute: 'ReceivePaperPlaneScreen',
      currentPaperPlane: 0,
    });
    resetLottiAnimation();
  }

  /**
   * Play TapToCatch Animation
   * @method playLottieAnimation
   */
  function playLottieAnimation() {
    setLottiIsPlaying(true);
    animationTapHere.current.play(0, 100);
  }

  /**
   * Reset TapToCatch Animation
   * @method resetLottiAnimation
   */
  function resetLottiAnimation() {
    setLottiIsPlaying(false);
    setLottiFinishedPlaying(false);
    animationTapHere.current.reset();
  }

  /**
   * Mark TapToShareExplainer box as seen in redux
   * @method toogleTapToShareExplainer
   */
  function toogleTapToShareExplainer() {
    if (!markTapToShare) {
      const seen = actionCreators.appStatus.markTapToShare(true);
      store.dispatch(seen);
    }
  }



  /**
   * Displays the paper plane background video
   * @method renderPaperPlaneVideo
   */
  const renderPaperPlaneVideo = useMemo(
    () => (
      <View style={styles.paperPlaneContainer}>
        <Video
          source={paperplanesBackground}
          style={styles.paperPlaneContainer}
          automaticallyWaitsToMinimizeStalling={false}
          bufferConfig={{
            minBufferMs: 0,
            maxBufferMs: 0,
            bufferForPlaybackMs: 0,
            bufferForPlaybackAfterRebufferMs: 0,
          }}
          repeat={true}
          paused={__DEV__ || !Device.isDevice || isVideoPaused}
          resizeMode={'cover'}
        />
        <TouchableWithoutFeedback onPress={catchPaperPlaneAsync}>
          <View style={styles.catchContainer}>
            {!isCatchingPaperPlane ? renderAnimation() : <ActivityIndicator />}
            <FadeInOut
              fadeIn={!isCatchingPaperPlane}
              style={styles.tapHereContainer}>
              <Text style={styles.tapHereText}>
                Tap to catch a paper plane {'\n'}
              </Text>
            </FadeInOut>
          </View>
        </TouchableWithoutFeedback>
      </View>
    ),
    [caughtPaperPlane, isCatchingPaperPlane, isVideoPaused],
  );

  function renderAnimation() {
    return (
      <View>
        <LottieView
          ref={animationTapToCatch}
          source={tapToCatch}
          style={styles.animationTapToCatch}
          speed={0.7}
          autoPlay
          loop
        />
        <LottieView
          ref={animationTapHere}
          source={catchPaperPlane}
          style={styles.animationTapHere}
          speed={1.7}
          loop={false}
          onAnimationFinish={() => setLottiFinishedPlaying(true)}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader title={'World'} />
      {renderPaperPlaneVideo}
      <AnnouncementModal />
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(ReceivePaperPlaneScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
    alignItems: 'center',
  },
  paperPlaneContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  catchContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  following: {
    fontWeight: 'bold',
    flexDirection: 'row',
    position: 'absolute',
    top: isIos() ? 50 : 25,
    zIndex: 3,
    width: '100%',
  },
  followingText1: {
    flex: 1,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: '#D0C9D6',
    paddingHorizontal: 5,
    paddingTop: 10,
    textAlign: 'right',
  },
  followingText2: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: '#D0C9D6',
    paddingLeft: 8,
    paddingTop: 10,
    textAlign: 'left',
  },
  aroundTheWorldTab: {
    flex: 0.6,
    flexDirection: 'row',
  },
  followingTab: {
    flex: 0.6,
    flexDirection: 'row',
  },
  newNotification: {
    borderRadius: 100,
    backgroundColor: '#F1004E',
    width: 7,
    height: 7,
    shadowColor: '#f40044',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.31,
    shadowRadius: 6,
    marginTop: 3,
  },
  emptyNotifcation: {
    borderColor: '#BAB4B4',
    borderWidth: 1,
    borderRadius: 100,
    width: 7,
    height: 7,
    shadowColor: '#f40044',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.31,
    shadowRadius: 6,
    marginTop: 3,
  },
  dividerWrapper: {
    flex: 0.05,
    justifyContent: 'flex-end',
    paddingBottom: !isIos() ? 2 : 0,
  },
  divider: {
    color: Globals.color.text.grey,
    textAlign: 'center',
  },
  imageContainer: {
    flexShrink: 1,
    width: '100%',
    aspectRatio: 0.97,
    paddingLeft: '25%',
    marginTop: 0,
    marginBottom: -170,
  },
  animationWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignContent: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  animationPaperPlanesBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 15,
  },
  animationTapHereWrapper: {
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: Dimensions.get('screen').height / 3,
  },
  animationTapHere: {
    width: Dimensions.get('screen').width / 1.5,
  },
  animationTapToCatch: {
    width: Dimensions.get('window').width / 1.5,
    position: 'absolute',
  },
  tapHereContainer: {
    position: 'absolute',
    bottom: '35%',
    width: '100%',
    alignItems: 'center',
  },
  tapHereText: {
    textAlign: 'center',
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.grey,
  },
  noFollowersContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  textContainer: {
    width: '90%',
    alignItems: 'center',
  },
  headline: {
    paddingVertical: Globals.dimension.padding.mini,
    textAlign: 'center',
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    lineHeight: 18,
  },
  paragraph: {
    paddingVertical: Globals.dimension.padding.mini,
    textAlign: 'center',
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: 22,
    width: '80%',
  },
  reportBlockBadgeStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(0, 0, 0, 0.5)',
    height: 30,
    borderRadius: 15,
  },
  reportBlockText: {
    textAlign: 'center',
    width: '100%',
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
    paddingLeft: 10,
    paddingRight: 10,
  },
  reportBlockContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: -Math.round(Dimensions.get('window').height) / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  explainerBox: {
    bottom: Dimensions.get('window').height / 7,
  },
});
