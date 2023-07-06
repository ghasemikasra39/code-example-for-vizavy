import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Globals from '../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import {
  upArrow,
  deleteRecording,
  lockAnimation,
  recordingMircrophone,
} from '../graphics/Images';
import RecordingIcon from '../Audio/RecordingIcon';
import LottieView from 'lottie-react-native';
import LockIcon from '../graphics/Icons/LockIcon';
import BackArrowIcon from '../graphics/Icons/BackArrowIcon';
import VibrationPattern from '../../services/utility/VibrationPattern';
import AudioPlayBack from '../Audio/AudioPlayBack';
import CheckMarkIcon from '../graphics/Icons/CheckMarkIcon';
import getRecordingTimeInSeconds, {
  LOCK_ICON_OFFSET,
  ANIMATION_DURATION,
} from '../Audio/AudioUtilities';
import MicrophoneIcon from '../graphics/Icons/MicrophoneIcon';
import FadeInOut from '../../Animated Hooks/FadeInOut';

interface Props {
  sendMessage: (uri: string) => void;
  handleStartRecording: () => void;
  handleFinishedRecording: (uri?: string) => void;
  children: any;
  show: boolean;
  colors: any;
  loadingMessages: boolean;
  expiredRoom?: boolean;
  darkMode?: boolean;
}

export default function SendMessageBar(props: Props) {
  const {
    expiredRoom,
    loadingMessages,
    colors,
    children,
    show,
    sendMessage,
    handleStartRecording,
    handleFinishedRecording,
    darkMode,
  } = props;
  const WINDOW_WIDTH = Dimensions.get('window').width;
  //------------------States----------------------------
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(
    getRecordingTimeInSeconds(0),
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isPreviewRecording, setIsPreviewRecording] = useState(false);
  const [isDeletingPreview, setIsDeletingPreview] = useState(false);
  const [recordingUri, setRecordingUri] = useState(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showRecordingAnimation, setShowRecordingAnimation] = useState(false);
  const [hide, setHide] = useState(false);
  //-------------------Animations-----------------------------
  //-> Slide out textInput message
  const shiftHorizontal = useRef(new Animated.Value(0)).current;
  const shiftOpacity = useRef(new Animated.Value(1)).current;
  //-> Fade out slide to cancel and recordingTime
  const shiftSlideCancelValue = useRef(new Animated.Value(100)).current;
  const opacityInterpolator = shiftSlideCancelValue.interpolate({
    inputRange: [-150, 0, 100],
    outputRange: [0, 1, 0],
  });
  //-> SlideUp slide to unlick
  const shiftVertical = useRef(new Animated.Value(300)).current;
  const shiftVerticalnterpolator = shiftVertical.interpolate({
    inputRange: [LOCK_ICON_OFFSET, 0],
    outputRange: [0, 1],
  });
  //-> Scale lock icon when sliding up to lock
  const scaleValue = useRef(new Animated.Value(0)).current;
  const scaleVerticalnterpolator = scaleValue.interpolate({
    inputRange: [LOCK_ICON_OFFSET, 0],
    outputRange: [1, 0],
  });
  // -> Animation Refs
  const lockAnimationRef = useRef();
  const deleteRecordingRef = useRef();
  //-> Refs from state
  const lockedRef = useRef(isLocked);
  lockedRef.current = isLocked;
  const deletingRef = useRef(isDeleting);
  deletingRef.current = isDeleting;
  const cancelRef = useRef(isCancelled);
  cancelRef.current = isCancelled;
  const recordingRef = useRef(recordingUri);
  recordingRef.current = recordingUri;

  useEffect(() => {
    if (lockedRef.current) {
      lockRecording();
    }
  }, [lockedRef.current]);

  useEffect(() => {
    if (deletingRef.current) {
      removeRecording();
    }
  }, [deletingRef.current]);

  useEffect(() => {
    if (isRecording) {
      slideUpSlideToLock();
    } else {
      shiftVertical.setValue(200);
    }
  }, [isRecording]);

  /**
   * Slide out TextInput bar
   * Fade in recording time and recording Microphone
   * Show Slide to cancel
   * @method slideMessageBar
   */
  function slideMessageBar(open: boolean) {
    if (open) {
      Animated.parallel([
        Animated.timing(shiftHorizontal, {
          toValue: -WINDOW_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shiftOpacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shiftSlideCancelValue, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(shiftHorizontal, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shiftOpacity, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(shiftSlideCancelValue, {
          toValue: 100,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }

  /**
   * Show the user that he is able to swipe up in order to lock the recording by displaying the slideToLock Icon
   * @method slideUpSlideToLock
   */
  function slideUpSlideToLock() {
    Animated.spring(shiftVertical, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  }

  /**
   * Shrink locked recording icon after it has finished playing
   * @method shrinkLockedRecording
   */
  function shrinkLockedRecording() {
    setTimeout(() => {
      Animated.spring(scaleValue, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }, 1000);
  }

  /**
   * Prepare user to record a voice message
   * @method onPrepareRecording
   */
  function onPrepareRecording() {
    slideMessageBar(true);
  }

  /**
   * Start the recording
   * @method onStartRecording
   */
  function onStartRecording() {
    setIsRecording(true);
    setIsCancelled(false);
    handleStartRecording && handleStartRecording();
  }

  /**
   * Callback that gets fired once the recording has successfully stoppped
   * @method onFinishRecording
   * @param {uri} - URI of the created voice recording
   * @param {totalRecordingDuration} - Exit the function once totalRecordingDuration is less than 500 ms
   */
  function onFinishRecording(uri: string, totalRecordingDuration: number) {
    if (totalRecordingDuration < 500) {
      passUpRecordingUri();
      reset();
      VibrationPattern.doHapticFeedback();
      return;
    }

    if (!cancelRef.current) {
      setRecordingUri(uri);
    }
    if (
      (!lockedRef.current && !deletingRef.current && !cancelRef.current) ||
      hide
    ) {
      previewRecording();
      passUpRecordingUri(uri);
    } else {
      passUpRecordingUri();
    }
  }

  /**
   * Preview the recording
   * @method previewRecording
   */
  function previewRecording() {
    if (handleFinishedRecording) {
      immidiatelyPostRecording();
      return;
    }
    setIsPreviewRecording(true);
    setIsLocked(false);
    setIsDeleting(false);
    setIsRecording(false);
    slideMessageBar(false);
    scaleValue.setValue(0);
    VibrationPattern.doHapticFeedback();
  }

  /**
   * Immidiately post the voice recording without previewing it
   * @method immidiatelyPostRecording
   */
  function immidiatelyPostRecording() {
    setHide(true);
    setIsRecording(false);
    VibrationPattern.doHapticFeedback();
  }

  /**
   * Remove recording recording is in preview mode
   * @method removePreview
   */
  function removePreview() {
    setIsDeletingPreview(true);
    VibrationPattern.doHapticFeedback();
    deleteRecordingRef.current?.play();
  }

  /**
   * Remove recording when swiping left
   * @method removeRecording
   */
  function removeRecording() {
    setIsRecording(false);
    setTimeout(reset, 800);
  }

  /**
   * Reset the component to its initial state
   * @method reset
   */
  function reset() {
    setIsRecording(false);
    setRecordingUri(null);
    setIsLocked(false);
    setIsDeleting(false);
    setIsPreviewRecording(false);
    setIsDeletingPreview(false);
    setIsCancelled(true);
    setHide(false);
    setRecordingTime(getRecordingTimeInSeconds(0));
    shiftSlideCancelValue.setValue(0);
    scaleValue.setValue(0);
    shiftVertical.setValue(200);
    slideMessageBar(false);
  }

  /**
   * Lock recording
   * @method lockRecording
   */
  function lockRecording() {
    lockAnimationRef.current.play();
  }

  /**
   * Lock recording if user swipes up or delete the recording if user swipes left
   * @method onResponderMove
   * @param {event} - panhandler movement event
   */
  function onResponderMove(evt) {
    if (lockedRef.current) return;
    const { locationX, locationY } = evt.nativeEvent;
    if (locationX < -150) {
      setIsDeleting(true);
    }
    if (locationX < 0 && locationX > -150) {
      shiftSlideCancelValue.setValue(locationX);
    }
    if (locationY <= LOCK_ICON_OFFSET) {
      setIsLocked(true);
    }
    if (locationY < 0 && locationY > LOCK_ICON_OFFSET) {
      scaleValue.setValue(locationY);
      shiftVertical.setValue(locationY);
    }
  }

  /**
   * Update the recording time every 500 ms in order to display to the user the recording tme
   * @method onRecordingStatusUpdate
   * @param {event} - recording event
   */
  function onRecordingStatusUpdate(event) {
    const { durationMillis } = event;
    const timeRecorded = getRecordingTimeInSeconds(durationMillis);
    setRecordingTime(timeRecorded);
  }

  /**
   * This method passes up to the parent component the freshyl recorded uri
   * @method passUpRecordingUri
   */
  function passUpRecordingUri(uri?: string) {
    handleFinishedRecording && handleFinishedRecording(uri ? uri : null);
  }

  /**
   * Post the message
   * NOTE: if the user has a voice recording, the message that gets posted will be a voice recording
   * Else, he will post a text message
   * @method postMessage
   */
  function postMessage() {
    sendMessage(recordingRef.current);
    reset();
    VibrationPattern.doHapticFeedback();
  }

  function compileBackgroundStyle() {
    let backgroundStyle = styles.container;
    if (darkMode) {
      backgroundStyle = {
        ...backgroundStyle,
        backgroundColor: 'transparent',
      };
    }
    return backgroundStyle;
  }

  function sendButton(open: boolean) {
    return (
      <TouchableWithoutFeedback onPress={postMessage} disabled={!open}>
        <View style={styles.sendButtonContainer}>
          {open ? (
            <LinearGradient colors={colors} style={styles.sendButtonGradient}>
              <Image source={upArrow} style={styles.upArrow} />
            </LinearGradient>
          ) : null}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const renderSlideToLock = useMemo(() => {
    const transitionAnimation = {
      transform: [{ translateY: shiftVertical }],
      opacity: shiftVerticalnterpolator,
    };

    function compileSlideToLockStyle() {
      let lockStyle = styles.slideToLockContainer;
      if (hide) {
        lockStyle = {
          ...lockStyle,
          opacity: 0,
        };
      }
      return lockStyle;
    }

    return isRecording ? (
      <Animated.View style={[compileSlideToLockStyle(), transitionAnimation]}>
        <LockIcon />
        <BackArrowIcon size={7} style={styles.arrowUpIcon} />
      </Animated.View>
    ) : null;
  }, [isRecording]);

  function renderLockedIcon() {
    const transitionAnimation = {
      transform: [{ scale: scaleVerticalnterpolator }],
    };

    function compileLockStyle() {
      let lockStyle = styles.lockAnimationContainer;
      if (hide) {
        lockStyle = {
          ...lockStyle,
          opacity: 0,
        };
      }
      return lockStyle;
    }

    return (
      <Animated.View style={[compileLockStyle(), transitionAnimation]}>
        <LottieView
          ref={lockAnimationRef}
          source={lockAnimation}
          style={styles.lockAnimation}
          speed={1.5}
          autoPlay={false}
          loop={false}
          onAnimationFinish={shrinkLockedRecording}
        />
      </Animated.View>
    );
  }

  const previewRecordingView = useMemo(() => {
    return isPreviewRecording ? (
      <View style={styles.previewRecordingContainer}>
        <TouchableWithoutFeedback
          hitSlop={Globals.dimension.hitSlop.regular}
          onPress={removePreview}>
          <LottieView
            ref={deleteRecordingRef}
            source={deleteRecording}
            style={styles.deletRecordingAnimation}
            speed={2.2}
            loop={false}
            onAnimationFinish={reset}
          />
        </TouchableWithoutFeedback>
        {!isDeletingPreview ? (
          <View style={styles.audioPlayBackContainer}>
            <AudioPlayBack recordingUri={recordingRef.current} />
          </View>
        ) : null}
      </View>
    ) : null;
  }, [isPreviewRecording, isDeletingPreview, recordingRef.current]);

  function textInputBox() {
    const textInputAnimationStyle = {
      transform: [{ translateX: shiftHorizontal }],
      opacity: shiftOpacity,
    };

    function compileTextInputStyleContainer() {
      let containerStyle = styles.textInputContainer;
      if (!children) {
        containerStyle = {
          ...containerStyle,
          backgroundColor: Globals.color.background.light,
        };
      }
      if (darkMode) {
        containerStyle = {
          ...containerStyle,
          ...{
            backgroundColor: 'transparent',
            borderWidth: 1,
            borderColor: Globals.color.background.light,
          },
        };
      }
      return containerStyle;
    }

    function renderCoverContainer() {
      return loadingMessages ? (
        <View style={styles.textCoverContainer} />
      ) : null;
    }

    return (
      <Animated.View
        style={[compileTextInputStyleContainer(), textInputAnimationStyle]}>
        {children}
        {sendButton(show)}
        {renderCoverContainer()}
        {previewRecordingView}
      </Animated.View>
    );
  }

  function recordingView() {
    const opacityAnimation = {
      opacity: opacityInterpolator,
    };
    const slideOutAnimation = {
      transform: [{ translateX: shiftSlideCancelValue }],
      opacity: opacityInterpolator,
    };

    function getCancelText() {
      if (lockedRef.current && !deletingRef.current) {
        return (
          <TouchableWithoutFeedback onPress={reset}>
            <Text style={styles.cancel}>Cancel</Text>
          </TouchableWithoutFeedback>
        );
      }
      if (!deletingRef.current) {
        return (
          <Animated.Text style={[styles.slideCancel, slideOutAnimation]}>
            {'<'}
            {'<'}
            {' Slide to cancel'}
          </Animated.Text>
        );
      }
      return null;
    }

    function compileRecordingTimeStyle() {
      let timeStyle = styles.recordingTime;
      if (isRecording && showRecordingAnimation) {
        timeStyle = {
          ...timeStyle,
          color: Globals.color.button.blue,
        };
      }
      return timeStyle;
    }

    function compileRecordingContainerStyle() {
      let containerStyle = styles.recordingContainer;
      if (darkMode) {
        containerStyle = {
          ...containerStyle,
          backgroundColor: 'transparent',
        };
      }
      if (hide) {
        containerStyle = {
          ...containerStyle,
          opacity: hide ? 0 : 1,
        };
      }
      return containerStyle;
    }

    return !isPreviewRecording ? (
      <View style={compileRecordingContainerStyle()}>
        <View style={styles.recordingTimeContainer}>
          {!deletingRef.current ? (
            <Animated.View
              style={[styles.recordingTimeWrapper, opacityAnimation]}>
              {isRecording && showRecordingAnimation ? (
                <LottieView
                  source={recordingMircrophone}
                  style={styles.recordingMircophone}
                  speed={1.1}
                  autoPlay
                  loop
                />
              ) : (
                <FadeInOut
                  fadeIn={!isRecording}
                  duration={250}
                  done={() => setShowRecordingAnimation(false)}
                  start={() => setShowRecordingAnimation(true)}>
                  <MicrophoneIcon
                    color={Globals.color.text.grey}
                    size={14}
                    style={styles.recordingMicrophonePlaceholder}
                  />
                </FadeInOut>
              )}
              <Text style={compileRecordingTimeStyle()}>{recordingTime}</Text>
            </Animated.View>
          ) : (
            <LottieView
              source={deleteRecording}
              style={styles.deletRecordingAnimation}
              speed={2.2}
              autoPlay
              loop
            />
          )}
        </View>
        <View style={styles.cancelContainer}>{getCancelText()}</View>
      </View>
    ) : null;
  }

  function renderMessageBar() {
    return (
      <View style={{ ...styles.wrapper, opacity: hide ? 0 : 1 }}>
        {recordingView()}
        {textInputBox()}
        {expiredRoom ? (
          <View style={styles.coverSendMessageBar}>
            {expiredRoom ? (
              <Text style={styles.coverText} numberOfLines={2}>
                You can read but not write or react to messages in expired rooms
                😊
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    );
  }

  const renderRecordingBar = useMemo(() => {
    function getActionIcon() {
      if (isPreviewRecording) {
        return (
          <View style={styles.actionIconContainer}>{sendButton(true)}</View>
        );
      }
      if (lockedRef.current) {
        return (
          <TouchableWithoutFeedback
            onPress={previewRecording}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <View style={styles.actionIconContainer}>
              <CheckMarkIcon color={Globals.color.button.blue} size={20} />
            </View>
          </TouchableWithoutFeedback>
        );
      }
      return null;
    }

    return !expiredRoom && !show ? (
      <View style={{ ...styles.recordingIconContainer, opacity: hide ? 0 : 1 }}>
        <RecordingIcon
          onPrepareRecording={onPrepareRecording}
          onStartRecording={onStartRecording}
          onFinishRecording={onFinishRecording}
          onResponderMove={onResponderMove}
          onRecordingStatusUpdate={onRecordingStatusUpdate}
          forceStopRecording={!isRecording}
          loading={loadingMessages}
        />
        {getActionIcon()}
      </View>
    ) : null;
  }, [
    loadingMessages,
    expiredRoom,
    show,
    lockedRef.current,
    isPreviewRecording,
    isRecording,
    hide,
  ]);

  return (
    <View style={compileBackgroundStyle()}>
      {renderSlideToLock}
      {renderLockedIcon()}
      {renderMessageBar()}
      {renderRecordingBar}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Globals.color.background.light,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    maxHeight: 160,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Globals.dimension.padding.tiny,
  },
  textInput: {
    flex: 0.95,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  textInputContainer: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.small,
    paddingRight: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  textCoverContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Globals.color.background.mediumLightgrey,
    borderRadius: Globals.dimension.borderRadius.small,
  },
  previewRecordingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.small,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sendButtonWrapper: {
    width: '10%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upArrow: {
    width: 10,
    height: 15,
  },
  photoButtonContainer: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
  cameraIcon: {
    width: 17,
    height: 13,
  },
  coverSendMessageBar: {
    position: 'absolute',
    backgroundColor: Globals.color.background.light,
    width: '100%',
    height: '120%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.lightgrey,
    textAlign: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  recordingContainer: {
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
    position: 'absolute',
    width: '100%',
    height: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
    overflow: 'hidden',
  },
  cancelContainer: {
    flex: 1.2,
  },
  slideCancel: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.grey,
  },
  cancel: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.button.blue,
  },
  recordingTimeContainer: {
    flex: 1,
  },
  recordingTimeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingTime: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.grey,
  },
  recordingMircophone: {
    height: 25,
    marginRight: Globals.dimension.margin.tiny,
  },
  recordingMicrophonePlaceholder: {
    left: 4,
    marginRight: Globals.dimension.margin.tiny + 7,
  },
  deletRecordingAnimation: {
    height: 35,
  },
  slideToLockContainer: {
    position: 'absolute',
    width: 40,
    height: 60,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    right: 10,
    top: -60,
  },
  arrowUpIcon: {
    transform: [{ rotate: '90deg' }],
  },
  lockAnimationContainer: {
    width: 60,
    aspectRatio: 1,
    backgroundColor: Globals.color.button.blue,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 0,
    top: -110,
  },
  lockAnimation: {
    width: 130,
  },
  audioPlayBackContainer: {
    flex: 1,
    marginLeft: Globals.dimension.margin.tiny,
    paddingLeft: Globals.dimension.padding.mini,
  },
  recordingIconContainer: {
    flex: 0.11,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  actionIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    backgroundColor: Globals.color.background.light,
    position: 'absolute',
  },
});
