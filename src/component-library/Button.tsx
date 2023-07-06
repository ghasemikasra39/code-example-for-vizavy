import React from 'react';
import {
  View,
  TouchableOpacityProps,
  StyleSheet,
  Text,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  TouchableNativeFeedback,
} from 'react-native';
import Globals from './Globals';
import VibrationPattern from '../services/utility/VibrationPattern';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';

interface Props extends TouchableOpacityProps {
  title?: any;
  icon?: any;
  primary?: boolean;
  grow?: boolean;
  disabled?: boolean;
  flat?: boolean;
  dark?: boolean;
  light?: boolean;
  translucent?: boolean;
  wrapStyle?: StyleProp<ViewStyle>;
  small?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  square?: boolean;
  iconRight?: any;
  unremarkableButtonFirstChoice?: boolean;
  unremarkableButtonSecondChoice?: boolean;
  loading?: boolean;
  onPress?: () => void;
  hapticFeedback?: boolean;
  vibrationIntensity?:
    | 'selection'
    | 'impactLight'
    | 'impactMedium'
    | 'impactHeavy'
    | 'notificationSuccess'
    | 'notificationWarning'
    | 'notificationError';
  buttonTextStyle?: any;
}

export default function Button(props: Props) {
  const {
    icon,
    title,
    iconRight,
    loading,
    hapticFeedback,
    vibrationIntensity,
  } = props;

  function compileButtonStyles() {
    const {
      primary,
      disabled,
      dark,
      translucent,
      small,
      buttonStyle,
      square,
      light,
    } = props;
    let buttonStyles = styles.button;
    if (primary) {
      buttonStyles = {
        ...buttonStyles,
        ...styles.primaryButton,
      };
    }
    if (square) {
      buttonStyles = {
        ...buttonStyles,
        ...styles.squareButton,
      };
    }
    if (disabled) {
      buttonStyles = {
        ...buttonStyles,
        ...styles.disabledButton,
      };
    }
    if (dark) {
      buttonStyles = {
        ...buttonStyles,
        ...styles.darkButton,
      };
    }
    if (translucent) {
      buttonStyles = {
        ...buttonStyles,
        ...styles[dark ? 'translucentDarkButton' : 'translucentLightButton'],
      };
    }
    if (small) {
      buttonStyles = {
        ...buttonStyles,
        ...styles.smallButton,
      };
    }
    if (light) {
      buttonStyles = {
        ...buttonStyles,
        ...styles.lightButton,
      };
    }
    if (buttonStyle) {
      buttonStyles = {
        ...buttonStyles,
        ...buttonStyle,
      };
    }
    return buttonStyles;
  }

  function compileTextStyles() {
    const {
      primary,
      dark,
      translucent,
      disabled,
      unremarkableButtonFirstChoice,
      unremarkableButtonSecondChoice,
      buttonTextStyle,
    } = props;
    let textStyles = styles.buttonText;
    if (primary) {
      textStyles = {
        ...textStyles,
        ...styles.primaryButtonText,
        ...buttonTextStyle,
      };
    }
    if (dark) {
      textStyles = {
        ...textStyles,
        ...styles.darkButtonText,
      };
    }
    if (translucent) {
      textStyles = {
        ...textStyles,
        ...{ color: Globals.color.brand.primary },
      };
    }
    if (disabled) {
      textStyles = {
        ...textStyles,
        ...{ color: Globals.color.text.lightgrey },
      };
    }
    if (unremarkableButtonFirstChoice) {
      textStyles = {
        ...textStyles,
        ...styles.unremarkableButtonFirstChoiceText,
      };
    }
    if (unremarkableButtonSecondChoice) {
      textStyles = {
        ...textStyles,
        ...styles.unremarkableButtonSecondChoiceText,
      };
    }
    return textStyles;
  }

  function compileWrapStyles() {
    const {
      grow,
      primary,
      disabled,
      flat,
      wrapStyle,
      unremarkableButtonFirstChoice,
      unremarkableButtonSecondChoice,
    } = props;
    let wrapStyles = styles.wrap;
    if (grow) {
      wrapStyles = {
        ...wrapStyles,
        ...styles.growingWrap,
      };
    }
    if (primary) {
      wrapStyles = {
        ...wrapStyles,
        ...styles.primaryWrap,
      };
    }
    if (disabled) {
      wrapStyles = {
        ...wrapStyles,
        ...styles.disabledWrap,
      };
    }
    if (flat) {
      wrapStyles = {
        ...wrapStyles,
        ...styles.flatWrap,
      };
    }
    if (wrapStyle) {
      wrapStyles = {
        ...wrapStyles,
        ...wrapStyle,
      };
    }
    if (unremarkableButtonFirstChoice || unremarkableButtonSecondChoice) {
      wrapStyles = {
        ...wrapStyles,
        ...styles.unremarkableButton,
      };
    }
    return wrapStyles;
  }

  function handleOnPress() {
    props.onPress();
    if (hapticFeedback) {
      VibrationPattern.doHapticFeedback(vibrationIntensity);
    }
  }

  return (
    <View style={compileWrapStyles()}>
      <TouchableNativeFeedback
        onPress={handleOnPress}
        disabled={props.disabled}>
        <View {...props}>
          {!loading ? (
            <View style={compileButtonStyles()}>
              {icon}
              <Text style={compileTextStyles()}>{title}</Text>
              {iconRight}
            </View>
          ) : (
            <View style={compileButtonStyles()}>
              <ActivityIndicator color={Globals.color.background.light} />
            </View>
          )}
        </View>
      </TouchableNativeFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    margin: Globals.dimension.margin.mini,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowColor: Globals.color.background.dark,
  },
  growingWrap: {
    flexGrow: 1,
  },
  pressedWrap: {
    shadowRadius: 5,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },
  flatWrap: {
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  primaryWrap: {
    shadowOpacity: 0.4,
    shadowColor: Globals.color.brand.primary,
  },
  button: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Globals.color.brand.neutral4,
    borderRadius: Globals.dimension.borderRadius.large,
    padding: Globals.dimension.padding.mini,
    height: 50,
  },
  squareButton: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    padding: Globals.dimension.padding.mini,
    height: 50,
    backgroundColor: Globals.color.brand.primary,
  },
  darkButton: {
    backgroundColor: Globals.color.background.dark,
  },
  lightButton: {
    backgroundColor: Globals.color.background.light,
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  translucentLightButton: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  translucentDarkButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  primaryButton: {
    backgroundColor: Globals.color.brand.primary,
  },
  pressedButton: {
    backgroundColor: Globals.color.brand.neutral3,
    marginTop: 1,
    marginBottom: -1,
  },
  primaryPressedButton: {
    backgroundColor: Globals.color.brand.primary,
  },
  buttonText: {
    fontFamily: Globals.font.family.bold,
    textAlign: 'center',
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
  },
  darkButtonText: {
    color: Globals.color.text.light,
  },
  primaryButtonText: {
    color: Globals.color.text.light,
  },
  disabledButton: {
    backgroundColor: Globals.color.button.disabled,
  },
  disabledWrap: {
    shadowOpacity: 0,
  },
  smallButton: {
    height: 40,
    width: 40,
  },
  unremarkableButton: {
    shadowRadius: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowColor: null,
    margin: null,
  },
  unremarkableButtonFirstChoiceText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.button.blue,
  },
  unremarkableButtonSecondChoiceText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.brand.primary,
  },
});
