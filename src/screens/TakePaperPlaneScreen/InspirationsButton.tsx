import React, { Fragment } from 'react';
import {
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  View,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import Globals from '../../component-library/Globals';
import CircularProgressIndicator from '../../component-library/CircularProgressIndicator';
import InspirationsText from './InspirationsText';
import { useNavigation } from '@react-navigation/native';
import VibrationPattern from '../../services/utility/VibrationPattern';

interface Props {
  onTakePicture?: (inspirationID?: number) => void;
  onStartVideoRecording?: (inspirationID?: number) => void;
  onEndVideoRecording?: () => void;
  inspirations: Array<any>;
}

interface State {
  isRecording: boolean;
  isPressed: boolean;
  scrollEnabled: boolean;
  inspirationText: string;
  inspirationID: number;
  iconLoading: boolean;
  inspirations: Array<any>;
}

export default function (props) {
  const navigation = useNavigation();
  return <InspirationsButton {...props} navigation={navigation} />;
}

class InspirationsButton extends React.Component<Props, State> {
  carousel: any;
  state = {
    isRecording: false,
    isPressed: false,
    scrollEnabled: true,
    inspirationText: null,
    inspirationID: 0,
    iconLoading: true,
    inspirations: [],
  };
  onDidFocusUnsubscriber: any;
  recordingTimeout: ReturnType<typeof setTimeout>;
  animatedValues = {
    innerScale: new Animated.Value(1),
    outerScale: new Animated.Value(1),
    outerOpacity: new Animated.Value(1),
    progressOpacity: new Animated.Value(0),
    recordingProgress: new Animated.Value(0.5),
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.onDidFocusUnsubscriber = navigation.addListener('focus', () =>
      this.resetCarousel(),
    );
    setTimeout(
      () => this.setState({ inspirations: this.props.inspirations }),
      200,
    );
  }


  UNSAFE_componentWillUnmount() {
    if (this.recordingTimeout) {
      clearTimeout(this.recordingTimeout);
    }
    this.onDidFocusUnsubscriber();
  }

  renderInspiration = ({ item, index }) => {
    const { inspirationID, iconLoading } = this.state;
    const isClickable = inspirationID === index;
    return (
      <TouchableOpacity
        onPress={
          isClickable ? this.handlePress : () => this.selectNonActive(index)
        }
        onPressIn={isClickable ? this.handlePressIn : null}
        onPressOut={isClickable ? this.handlePressOut : null}
        onLongPress={isClickable ? this.handleLongPress : null}
        hitSlop={{
          top: 20,
          left: 20,
          right: 20,
          bottom: 20,
        }}
        style={styles.itemWrapper}>
        {item.icon && (
          <Animated.Image
            source={{ uri: item.icon }}
            style={this.compileInnerButtonStyles()}
            onLoadEnd={() => {
              this.setState({
                iconLoading: false,
              });
            }}
          />
        )}
        {iconLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  onSnapToItem = item => {
    const { inspirations } = this.props;
    this.setState({
      inspirationText: inspirations[item].text,
      inspirationID: item,
    });
    VibrationPattern.doHapticFeedback();
  };

  onBeforeSnapToItem = () => {
    this.setState({
      inspirationText: null,
    });
  };

  getInputRangeFromIndexes = (range, index, carouselProps) => {
    const sizeRef = carouselProps.vertical
      ? carouselProps.itemHeight
      : carouselProps.itemWidth;
    let inputRange = [];

    for (let i = 0; i < range.length; i++) {
      inputRange.push((index - range[i]) * sizeRef);
    }

    return inputRange;
  };

  scrollInterpolator = (index, carouselProps) => {
    const range = [2, 1.5, 0, -1.5, -2];
    const inputRange = this.getInputRangeFromIndexes(
      range,
      index,
      carouselProps,
    );
    const outputRange = [-1.5, 0, 1, 0, -1.5];

    return { inputRange, outputRange, extrapolate: 'clamp' };
  };

  resetCarousel = () => {
    this.carousel.snapToItem(0);
  };

  selectNonActive = index => {
    this.carousel.snapToItem(index);
  };

  render() {
    const {
      scrollEnabled,
      inspirationText,
      inspirationID,
      isRecording,
      inspirations,
    } = this.state;
    const { width } = Dimensions.get('screen');
    return (
      <Fragment>
        {!isRecording && inspirationID > 0 && (
          <InspirationsText inspiration={inspirationText} />
        )}
        <Animated.View style={this.compileContainerStyles()}>
          <Animated.View style={this.compileOuterButtonStyles()} />
          <CircularProgressIndicator
            size={Globals.dimension.mainButtonWidth}
            progress={this.animatedValues.recordingProgress}
            color={'red'}
            thickness={2}
            style={this.compileProgressIndicatorStyles()}
          />
          {inspirations && (
            <Carousel
              ref={c => {
                this.carousel = c;
              }}
              onLayout={this.resetCarousel}
              scrollEnabled={scrollEnabled}
              data={inspirations}
              inactiveSlideOpacity={1}
              renderItem={this.renderInspiration}
              sliderWidth={width}
              scrollInterpolator={this.scrollInterpolator}
              itemWidth={Globals.dimension.mainButtonWidth}
              onBeforeSnapToItem={this.onBeforeSnapToItem}
              onSnapToItem={this.onSnapToItem}
              extraData={this.state}
            />
          )}
        </Animated.View>



      </Fragment>
    );
  }


  handlePress = () => {
    const { onTakePicture } = this.props;
    const { inspirationID } = this.state;
    onTakePicture && onTakePicture(inspirationID);
  };

  handleLongPress = () => {
    this.setState({
      isRecording: true,
      scrollEnabled: false,
    });
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
    const { onStartVideoRecording } = this.props;
    const { inspirationID } = this.state;
    onStartVideoRecording && onStartVideoRecording(inspirationID);
    this.recordingTimeout = setTimeout(this.endVideoRecording, 30000);
    this.animateVideoRecordingStart();
  };

  endVideoRecording = () => {
    if (this.state.isRecording) {
      if (this.recordingTimeout) {
        clearTimeout(this.recordingTimeout);
      }
      this.setState({
        isRecording: false,
        scrollEnabled: true,
      });
      this.animateVideoRecordingEnd();
      this.props.onEndVideoRecording && this.props.onEndVideoRecording();
    }
  };

  animateVideoRecordingStart = () => {
    this.animatedValues.recordingProgress.setValue(0);
    Animated.parallel([
      Animated.spring(this.animatedValues.innerScale, {
        toValue: 0.6,
        useNativeDriver: true,
      }),
      Animated.spring(this.animatedValues.outerScale, {
        toValue: 1.3,
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

const { width } = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    bottom: 0,
  },
  outerButton: {
    width: Globals.dimension.mainButtonWidth,
    height: Globals.dimension.mainButtonWidth,
    position: 'absolute',
    borderWidth: 6,
    borderColor: Globals.color.background.light,
    borderRadius: 100,
  },
  progressIndicator: {
    position: 'absolute',
    opacity: 0.7,
  },
  innerButton: {
    width: Globals.dimension.mainButtonWidth - 16,
    height: Globals.dimension.mainButtonWidth - 16,
    margin: 25,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerButtonPressed: {
    backgroundColor: 'darkred',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 1,
    shadowOpacity: 0.4,
  },
  linearGradient: {
    bottom: -10,
  },
  itemWrapper: {
    alignItems: 'center',
  },
  touchResetIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 5,
  },
  resetIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 23,
    height: 23,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
  },
  resetIconWrapperTransparent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 23,
    height: 23,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.0)',
  },
  activityIndicator: {
    flex: 1,
    width: Globals.dimension.mainButtonWidth - 16,
    height: Globals.dimension.mainButtonWidth - 16,
    margin: 25,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
