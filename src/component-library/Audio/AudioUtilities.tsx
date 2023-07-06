import {
  RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
  RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
  RecordingOptions,
} from 'expo-av/build/Audio';
import { Audio } from 'expo-av';

export const LOCK_ICON_OFFSET = -40;
export const ANIMATION_DURATION = 450;
export default function getRecordingTimeInSeconds(
  recordingTime: number,
  currentTime?: number,
) {
  let timeDifference = recordingTime;
  if (currentTime !== undefined) {
    timeDifference = recordingTime - currentTime;
  }
  var minutes = Math.floor(timeDifference / 60000);
  var seconds = ((timeDifference % 60000) / 1000).toFixed(0);
  const time = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  return time;
}

export const RECORDING_OPTIONS_PRESET_HIGH_QUALITY: RecordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MEDIUM,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 96400,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
