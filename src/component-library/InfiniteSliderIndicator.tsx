import React from 'react';
import { View, StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';
import Globals from './Globals';

const ANIMATION_DURATION = 400;

interface Props {
  slide: number;
  infinite?: boolean;
  style?: StyleProp<ViewStyle>;
}

interface State {
  previousSlide: number;
}

const backgroundColorInterpolations = {};

export default class InfiniteSliderIndicator extends React.Component<
  Props,
  State
> {
  constructor(props) {
    super(props);
    this.setupAnimationValues();
  }

  state = {
    previousSlide: 0,
  };

  animatedValues = {};

  dotKeys = [
    'left3',
    'left2',
    'left1',
    'current',
    'right1',
    'right2',
    'right3',
  ];

  componentDidMount() {
    this.initiateDots();
  }

  componentDidUpdate() {
    this.autoAnimate();
  }

  render() {
    return (
      <View style={[this.props.style || {}]}>
        <View style={styles.container}>
          {this.dotKeys.map(dotKey => (
            <Animated.View style={this.buildDotStyles(dotKey)} key={dotKey} />
          ))}
        </View>
      </View>
    );
  }

  buildDotStyles = (dotKey: string) => ({
    ...styles.dot,
    opacity: this.animatedValues[dotKey].opacity,
    backgroundColor: backgroundColorInterpolations[dotKey],
    transform: [
      { translateX: this.animatedValues[dotKey].left },
      { scale: this.animatedValues[dotKey].scale },
    ],
  });

  initiateDots = () => {
    this.dotKeys.map(dotKey => {
      backgroundColorInterpolations[dotKey] = this.animatedValues[
        dotKey
      ].backgroundColor.interpolate({
        inputRange: [0, 100],
        outputRange: [
          Globals.color.background.grey,
          Globals.color.brand.primary,
        ],
      });
    });
    this.forceUpdate();
  };

  autoAnimate = () => {
    const { slide, infinite } = this.props;
    const { previousSlide } = this.state;
    if (!Number.isNaN(slide) && slide !== previousSlide) {
      let direction = 'left';
      if (
        (infinite && slide > previousSlide + 1) ||
        (!infinite && slide < previousSlide - 1) ||
        slide === previousSlide - 1
      ) {
        direction = 'right';
      }
      this.animateSlide(direction);
      this.setState({
        previousSlide: slide,
      });
    }
  };

  animateSlide = (direction: string) => {
    const animations = this.dotKeys.map((dotKey, index) => {
      const dotAnimations = [];
      let toValue = Globals.dimension.margin.tiny * 2 + 9;
      if (direction === 'left') {
        toValue = toValue * -1;
      }
      dotAnimations.push(
        Animated.timing(this.animatedValues[dotKey].left, {
          toValue,
          duration: ANIMATION_DURATION,
        }),
      );
      ['scale', 'backgroundColor', 'opacity'].map(property => {
        dotAnimations.push(
          Animated.timing(this.animatedValues[dotKey][property], {
            toValue: this.getCurrentAnimatedValue(
              property,
              this.dotKeys[direction === 'right' ? index + 1 : index - 1],
            ),
            duration: ANIMATION_DURATION,
          }),
        );
      });

      return dotAnimations;
    });

    const animationStack = Animated.parallel([].concat.apply([], animations));
    animationStack.start(() => this.resetAnimationValues());
  };

  setupAnimationValues = () => {
    this.dotKeys.map(dotKey => {
      this.animatedValues[dotKey] = {
        left: new Animated.Value(initialAnimationValues[dotKey].left),
        scale: new Animated.Value(initialAnimationValues[dotKey].scale),
        opacity: new Animated.Value(initialAnimationValues[dotKey].opacity),
        backgroundColor: new Animated.Value(
          initialAnimationValues[dotKey].backgroundColor,
        ),
      };
    });
  };

  resetAnimationValues = () => {
    this.dotKeys.map(dotKey => {
      Object.entries(initialAnimationValues[dotKey]).forEach(
        ([property, initialValue]) => {
          this.animatedValues[dotKey][property].setValue(initialValue);
        },
      );
    });
  };

  getCurrentAnimatedValue = (property: string, dotKey: string) => {
    if (!dotKey) {
      return 0;
    }
    if (this.animatedValues[dotKey]) {
      return (this.animatedValues[dotKey][property] as any)._value;
    }
    return 0;
  };
}

const initialAnimationValues = {
  left3: {
    left: 0,
    opacity: 0,
    backgroundColor: 0,
    scale: 0,
  },
  left2: {
    left: 0,
    opacity: 0.4,
    backgroundColor: 0,
    scale: 0.5,
  },
  left1: {
    left: 0,
    opacity: 0.7,
    backgroundColor: 0,
    scale: 0.8,
  },
  current: {
    left: 0,
    opacity: 1,
    backgroundColor: 100,
    scale: 1,
  },
  right1: {
    left: 0,
    opacity: 0.7,
    backgroundColor: 0,
    scale: 0.8,
  },
  right2: {
    left: 0,
    opacity: 0.4,
    backgroundColor: 0,
    scale: 0.5,
  },
  right3: {
    left: 0,
    opacity: 0,
    backgroundColor: 0,
    scale: 0,
  },
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    borderRadius: 4.5,
    marginHorizontal: Globals.dimension.margin.tiny,
    height: 9,
    width: 9,
  },
});
