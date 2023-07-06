/**
 * @see https://docs.expo.io/versions/latest/react-native/vibration/
 */
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const PaperPlaneReceived = [0, 100, 50, 200];
export const PaperPlaneUploaded = [0, 200];
export const PaperPlaneCommentReceived = [0, 100, 50, 200];
export const PaperPlaneCommentReplyReceived = [0, 100, 50, 200];
export const ChangeSlideIndex = [0.5];

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

class VibrationPattern {
  doHapticFeedback = (
    vibrationIntensity?:
      | 'selection'
      | 'impactLight'
      | 'impactMedium'
      | 'impactHeavy'
      | 'notificationSuccess'
      | 'notificationWarning'
      | 'notificationError',
  ) => {
    ReactNativeHapticFeedback.trigger(
      vibrationIntensity ? vibrationIntensity : 'impactLight',
      options,
    );
  };
}

export default new VibrationPattern();
