import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import VibrationPattern from '../services/utility/VibrationPattern';

interface Props {
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  children?: any;
  hitSlop?: Object;
  delayLongPress?: number;
  hapictsEnabled?: boolean;
  vibrationIntensity?:
    | 'selection'
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError';
}

export default function HapticFeedBackWrapper(props: Props) {
  const {
    vibrationIntensity,
    children,
    delayLongPress,
    hitSlop,
    disabled,
    hapictsEnabled,
  } = props;

  function doHapticFeedback() {
    if (!__DEV__ || !hapictsEnabled) {
      VibrationPattern.doHapticFeedback(vibrationIntensity);
    }
  }

  function handleOnPress() {
    if (!props.onPress) return;
    props.onPress();
    doHapticFeedback();
  }

  function handleOnLongPress() {
    if (!props.onLongPress) return;
    props.onLongPress();
    doHapticFeedback();
  }

  return (
    <TouchableWithoutFeedback
      onPress={handleOnPress}
      onLongPress={handleOnLongPress}
      delayLongPress={delayLongPress ? delayLongPress : 200}
      disabled={disabled}
      hitSlop={hitSlop}>
      {children}
    </TouchableWithoutFeedback>
  );
}
