import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import Globals from '../Globals';
import PlayAudioIcon from '../graphics/Icons/PlayAudioIcon';
import StopAudioIcon from '../graphics/Icons/StopAudioIcon';
import Slider from '@react-native-community/slider';
import { circleIcon } from '../graphics/Images';
import { Audio } from 'expo-av';
import getRecordingTimeInSeconds from './AudioUtilities';
import { INTERRUPTION_MODE_IOS_DO_NOT_MIX } from 'expo-av/build/Audio';
import { MessageInterface } from '../../services/api/ChatRoomManager';

interface Props {
  recordingUri: string;
  forceStop: boolean;
  item?: MessageInterface;
  onPlayItem?: (item: MessageInterface) => void;
}

export default function AudioPlayBack(props: Props) {
  const { recordingUri, forceStop, onPlayItem, item } = props;
  const [recordedSound, setRecordedSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (recordingUri) {
      getSoundReady();
    }
  }, [recordingUri]);

  useEffect(() => {
    return recordedSound
      ? () => {
          unloadSound();
        }
      : undefined;
  }, [recordedSound]);

  useEffect(() => {
    if (forceStop) {
      pauseSound();
    }
  }, [forceStop]);

  /**
   * if the component receives a voice message uri,
   * this function will prepare it to play and will return how long this voice message will be
   * @method getSoundReady
   */
  async function getSoundReady() {
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        {
          uri: recordingUri,
        },
        {
          progressUpdateIntervalMillis: 500,
          positionMillis: 0,
          shouldPlay: false,
          rate: 1.0,
          shouldCorrectPitch: false,
          volume: 1.0,
          isMuted: false,
          isLooping: false,
        },
      );
      setRecordedSound(sound);
      setRecordingTime(status?.durationMillis);
    } catch (error) {
      console.log('error getSoundReady: ', error);
    }
  }

  /**
   * This method will update the user about the time progress of the playing recording
   * @method addEventListener
   */
  function addEventListener() {
    try {
      recordedSound.setOnPlaybackStatusUpdate((event) => {
        const { positionMillis } = event;
        setCurrentTime(positionMillis);
        if (positionMillis === recordingTime) {
          setTimeout(restart, 200);
        }
      });
    } catch (error) {
      console.log('error addEventListener: ', error);
    }
  }
  /**
   * This method will update the user about the time progress of the playing recording
   * @method removeEventListener
   */
  async function removeEventListener() {
    await recordedSound.setOnPlaybackStatusUpdate(null);
  }

  /**
   * Unload the played recording from memory
   * @method unloadSound
   */
  async function unloadSound() {
    try {
      setIsPlaying(false);
      await recordedSound?.unloadAsync();
    } catch (error) {
      console.log('error unloadSound: ', error);
    }
  }

  /**
   * Play voicemessage
   * @method playSound
   */
  async function playSound() {
    try {
      onPlayItem && onPlayItem(item);
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      });
      await recordedSound?.playAsync();
      setIsPlaying(true);
      addEventListener();
    } catch (error) {
      console.log('error playSound: ', error);
    }
  }

  /**
   * Pause voicemessage
   * @method pauseSound
   */
  async function pauseSound() {
    try {
      setIsPlaying(false);
      await recordedSound?.pauseAsync();
      removeEventListener();
    } catch (error) {
    }
  }

  /**
   * This methods sets the recording to a custom starting position on the slider
   * @method onPlayPositionChange
   * @param {value} - new starting position
   */
  async function onPlayPositionChange(value) {
    try {
      await recordedSound.playFromPositionAsync(value);
      addEventListener();
      setIsPlaying(true);
    } catch (error) {
      console.log('error onPlayPositionChange: ', error);
    }
  }

  /**
   * Set the recording back to the start
   * @method restart
   */
  function restart() {
    setCurrentTime(0);
    recordedSound.setPositionAsync(0);
    setIsPlaying(false);
  }

  function getRemainingTime() {
    const timeRemaining = getRecordingTimeInSeconds(recordingTime, currentTime);
    return timeRemaining;
  }

  function renderAudioIcons() {
    if (!isPlaying) {
      return (
        <TouchableWithoutFeedback onPress={playSound}>
          <View style={styles.playIconContainer}>
            <PlayAudioIcon style={styles.playBackIcon} />
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={pauseSound}>
          <View style={styles.playIconContainer}>
            <StopAudioIcon
              color={Globals.color.button.blue}
              style={styles.playBackIcon}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }
  }

  function renderProgressBar() {
    return (
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={recordingTime}
        minimumTrackTintColor={Globals.color.button.blue}
        maximumTrackTintColor={'#DADADA'}
        onSlidingStart={pauseSound}
        onSlidingComplete={onPlayPositionChange}
        value={currentTime}
        thumbImage={circleIcon}
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderAudioIcons()}
      {renderProgressBar()}
      <Text style={styles.timeLeft}>{getRemainingTime()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  slider: {
    flex: 1,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioIcon: {
    marginRight: Globals.dimension.margin.mini,
  },
  timeLeft: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    marginLeft: Globals.dimension.margin.mini,
  },
  playIconContainer: {
    height: 40,
    width: 30,
    justifyContent: 'center',
  },
  playBackIcon: {
    right: -1,
  },
});
