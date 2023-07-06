import React from 'react';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import Globals from './Globals';
import CircularProgressIndicator from './CircularProgressIndicator';
interface Props {
  onTakePicture?: () => void;
  onStartVideoRecording?: () => void;
  onEndVideoRecording?: () => void;
}

interface State {
  isRecording: boolean;
  isPressed: boolean;
  recordingEndTimeout?: number;
}

export default class PaperPlaneRecordingButton extends React.Component<
  Props,
  State
> {
  state = {
    isRecording: false,
    isPressed: false,
  };

  recordingTimeout: ReturnType<typeof setTimeout>;
  animatedValues = {
    innerScale: new Animated.Value(1),
    outerScale: new Animated.Value(1),
    outerOpacity: new Animated.Value(1),
    progressOpacity: new Animated.Value(0),
    recordingProgress: new Animated.Value(0.5),
  };

  componentWillUnmount() {
    if (this.recordingTimeout) {
      clearTimeout(this.recordingTimeout);
    }
  }

  render() {
    return (
      <View>
        <Animated.View style={this.compileContainerStyles()}>
          <Animated.View style={this.compileOuterButtonStyles()} />
          <CircularProgressIndicator
            size={Globals.dimension.mainButtonWidth}
            progress={this.animatedValues.recordingProgress}
            color={'red'}
            thickness={2}
            style={this.compileProgressIndicatorStyles()}
          />
          <TouchableWithoutFeedback
            onPress={this.handlePress}
            onPressIn={this.handlePressIn}
            onPressOut={this.handlePressOut}
            onLongPress={this.handleLongPress}
            hitSlop={{
              top: 20,
              left: 20,
              right: 20,
              bottom: 20,
            }}>
            <Animated.View style={this.compileInnerButtonStyles()} />
          </TouchableWithoutFeedback>
        </Animated.View>
      </View>
    );
  }

  handlePress = () => {
    this.props.onTakePicture && this.props.onTakePicture();
  };

  handleLongPress = () => {
    this.setState({ isRecording: true });
    this.startVideoRecording();
  };

  handlePressIn = () => {
    this.setState({ isPressed: true });
  };

  handlePressOut = () => {
    this.setState({ isPressed: false });
    this.endVideoRecording();
  };

  startVideoRecording = () => {
    this.props.onStartVideoRecording && this.props.onStartVideoRecording();
    this.recordingTimeout = setTimeout(this.endVideoRecording, 30000);
    this.animateVideoRecordingStart();
  };

  endVideoRecording = () => {
    if (this.state.isRecording) {
      if (this.recordingTimeout) {
        clearTimeout(this.recordingTimeout);
      }
      this.setState({ isRecording: false });
      this.animateVideoRecordingEnd();
      this.props.onEndVideoRecording && this.props.onEndVideoRecording();
    }
  };

  animateVideoRecordingStart = () => {
    this.animatedValues.recordingProgress.setValue(0);
    Animated.parallel([
      Animated.spring(this.animatedValues.innerScale, {
        toValue: 0.3,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.outerScale, {
        toValue: 1.6,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.outerOpacity, {
        toValue: 0.3,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.progressOpacity, {
        toValue: 0.7,
        useNativeDriver: true,
      }),
    ]).start();
    Animated.timing(this.animatedValues.recordingProgress, {
      toValue: 1,
      easing: Easing.linear,
      duration: 30000,
      useNativeDriver: true,
    }).start();
  };

  animateVideoRecordingEnd = () => {
    Animated.parallel([
      Animated.spring(this.animatedValues.innerScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.outerScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.outerOpacity, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.progressOpacity, {
        toValue: 0,
        useNativeDriver: true,
      }),
    ]).start();
  };

  compileContainerStyles = () => {
    return {
      ...styles.container,
      transform: [{ scale: this.animatedValues.outerScale }],
    };
  };

  compileProgressIndicatorStyles = () => {
    return {
      ...styles.progressIndicator,
      opacity: this.animatedValues.progressOpacity,
    };
  };

  compileOuterButtonStyles = () => {
    return {
      ...styles.outerButton,
      opacity: this.animatedValues.outerOpacity,
    };
  };

  compileInnerButtonStyles = () => {
    let style = {
      ...styles.innerButton,
      transform: [{ scale: this.animatedValues.innerScale }],
    };
    if (this.state.isPressed) {
      style = {
        ...style,
        ...styles.innerButtonPressed,
      };
    }

    return style;
  };
}

const styles = StyleSheet.create({
  container: {
    width: Globals.dimension.mainButtonWidth,
    height: Globals.dimension.mainButtonWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerButton: {
    width: Globals.dimension.mainButtonWidth,
    height: Globals.dimension.mainButtonWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.mainButtonWidth,
    elevation: 0,
  },
  progressIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    opacity: 0.7,
  },
  innerButton: {
    width: Globals.dimension.mainButtonWidth - 20,
    height: Globals.dimension.mainButtonWidth - 20,
    margin: 10,
    borderRadius: 100,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 6,
    shadowOpacity: 0.5,
    elevation: 3,
  },
  innerButtonPressed: {
    backgroundColor: 'darkred',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowOpacity: 0.4,
    elevation: 1,
  },
});
