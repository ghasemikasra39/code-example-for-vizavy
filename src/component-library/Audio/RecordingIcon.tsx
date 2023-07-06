import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, PanResponder, Alert } from 'react-native';
import { Audio } from 'expo-av';
import {
  RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
  LOCK_ICON_OFFSET,
  ANIMATION_DURATION,
} from './AudioUtilities';
import MicrophoneIcon from '../graphics/Icons/MicrophoneIcon';
import Globals from '../Globals';
import { connect } from 'react-redux';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import PermissionRequester from '../../services/utility/PermissionRequester';
import VibrationPattern from '../../services/utility/VibrationPattern';
import * as Permissions from 'expo-permissions';

const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

function RecordingIcon(props) {
  const {
    onPrepareRecording,
    onStartRecording,
    onFinishRecording,
    onResponderMove,
    onRecordingStatusUpdate,
    forceStopRecording,
    loading,
  } = props;
  const { audioAllowed } = props.appStatus;
  const [newRecording, setNewRecording] = useState(null);
  const [isStopped, setIsStopped] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(newRecording);
  recordingRef.current = newRecording;

  const stoppedRef = useRef(isStopped);
  stoppedRef.current = isStopped;

  const isRecordingRef = useRef(isRecording);
  isRecordingRef.current = isRecording;

  const audioAllowedRef = useRef(audioAllowed);
  audioAllowedRef.current = audioAllowed;

  //-> PanHandler tracks the exact touch of the user
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: () => {},
      onPanResponderMove: (e) => {
        //Only allow the user to drag if the recording has successfully started
        if (isRecordingRef.current) {
          onResponderMove(e);
        }
      },
      onPanResponderReject: () => {},
      onPanResponderStart: () => {
        prepareRecording();
        VibrationPattern.doHapticFeedback();
      },
      onPanResponderEnd: (e) => {
        const { locationY } = e.nativeEvent;
        //Check if user is not recording anymore.
        //This happens when user releases the touch before finishing starting to record
        if (!isRecordingRef.current) {
          exitRecording();
          return;
        }
        //Check if user releases the touch outside the LOCK_ICON_OFFSET, which means that
        //he releases the touch in order to lock the recording
        if (locationY > LOCK_ICON_OFFSET) {
          stopRecording();
        } else {
          setIsStopped(false);
        }
      },
      onPanResponderTerminationRequest: () => true,
      onPanResponderRelease: () => {},
    }),
  ).current;

  useEffect(() => {
    if (forceStopRecording) {
      stopRecording();
      if (recordingRef.current) {
        VibrationPattern.doHapticFeedback();
      }
    }
  }, [forceStopRecording]);

  /**
   * Prepare the user for recording
   * @method prepareRecording
   */
  async function prepareRecording() {
    if (recordingRef.current) {
      exitRecording();
      return;
    }
    const recordingAllowed = await checkAudioPermissions();
    if (!recordingAllowed) return;
    setIsStopped(false);
    onPrepareRecording();
    setTimeout(startRecording, ANIMATION_DURATION / 3);
  }

  /**
   * Start the recording
   * @method startRecording
   * NOTE: Stopping and starting the recording can happen almost simultaneously. That's why we were exiting the function
   * when we observe that the user has already stopped the recording
   * -> stoppedRef.current tracks this.
   */
  async function startRecording() {
    if (stoppedRef.current) {
      exitRecording();
      return;
    }
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      setNewRecording(recording);
      await recording.prepareToRecordAsync(
        RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
      );
      await recording.setOnRecordingStatusUpdate((event) => {
        if (stoppedRef.current) {
          stopRecording();
        } else {
          onRecordingStatusUpdate(event);
        }
      });
      await recording.startAsync();
      onStartRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
      stopRecording();
      recheckPermissions();
    }
  }

  /**
   * Stop the recording
   * @method stopRecording
   */
  async function stopRecording() {
    try {
      setIsStopped(true);
      recordingRef.current?.stopAndUnloadAsync().then(() => {
        const { _uri, _finalDurationMillis } = recordingRef.current;
        onFinishRecording(_uri, _finalDurationMillis);
        setNewRecording(null);
        setIsRecording(false);
      });
    } catch (error) {
      recheckPermissions();
    }
  }

  /**
   * Exit recording gets called when a user stops the recording before it finished to start
   * @method exitRecording
   */
  function exitRecording() {
    setIsStopped(true);
    onFinishRecording('', 0);
    setIsRecording(false);
    VibrationPattern.doHapticFeedback();
  }

  /**
   * In order to avoid redundant checking if the user has enabled his recording permissions, we check this via Audio allowed state
   * from redux in order to avoid unneccessary waiting
   * @method checkAudioPermissions
   */
  async function checkAudioPermissions() {
    try {
      if (audioAllowedRef.current) return true;
      const result = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
      const { granted } = result;
      if (granted) {
        setAudioStatus(true);
      } else {
        Alert.alert(
          'Enable Audio',
          "To record a Voice Message, Youpendo needs access to your iPhone's microphone. Tap Settings and turn on Microphone",
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
      return false;
    } catch (error) {
      console.log('error checkAudioPermissions: ', error);
    }
  }

  /**
   * Sometimes codepush interrups a recording and which causes errors the next time you want record.
   * Before recording, we check the permissions if they are enabled through the AudioEnabled state from redux
   * This method simply tells the recorder to either check the recording permissions again the next time or not
   * @method recheckPermissions
   */
  async function recheckPermissions() {
    const result = await Audio.getPermissionsAsync();
    const { granted } = result;
    if (granted) {
      setAudioStatus(true);
    } else {
      setAudioStatus(false);
    }
  }

  /**
   * Toggle the Audio Allowed state in redux
   * @method setAudioStatus
   */
  function setAudioStatus(granted: boolean) {
    const action = actionCreators.appStatus.setAudioAllowed(granted);
    store.dispatch(action);
  }

  /**
   * If a user has not allowed his microphone, he will be directed to the Settings Screen on iOS Systemspreferences
   * @method openSettings
   */
  function openSettings() {
    PermissionRequester.openSettingsAsync();
  }

  function getMicrophoneColor() {
    if (recordingRef.current) {
      return Globals.color.text.grey;
    }
    if (loading) {
      return Globals.color.background.mediumgrey;
    }
    return Globals.color.button.blue;
  }

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <MicrophoneIcon color={getMicrophoneColor()} />
    </View>
  );
}

export default connect(mapStateToProps)(RecordingIcon);

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.tiny,
    height: 44,
  },
  microphoneContainer: {
    left: 0,
    bottom: 0,
  },
});
