import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { Animated } from 'react-native';
import { StyleSheet } from 'react-native';
import Globals from './Globals';

interface Props {
  progress: any;
  size: number;
  thickness?: number;
  color?: string;
  style?: any;
}

const DEFAULT_THICKNESS = 5;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export default class CircularProgressIndicator extends React.Component<Props> {
  render() {
    const { size, progress, color, style } = this.props;
    const thickness = this.props.thickness || DEFAULT_THICKNESS;
    const radius = (size - thickness) / 2;
    const circumference = radius * 2 * Math.PI;
    const currentProgress = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [Math.PI * 2, 0],
    });

    return (
      <Animated.View style={style}>
        <Svg
          width={size + thickness}
          height={size + thickness}
          style={{
            ...styles.container,
            padding: Math.floor(thickness / 2),
            marginTop: Math.ceil(thickness / -1.5),
          }}>
          <AnimatedCircle
            stroke={color || Globals.color.brand.primary}
            fill="none"
            strokeDasharray={`${circumference}, ${circumference}`}
            strokeDashoffset={Animated.multiply(currentProgress, radius)}
            strokeWidth={thickness || DEFAULT_THICKNESS}
            cx={this.props.size / 2}
            cy={this.props.size / 2}
            r={radius}
          />
        </Svg>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    transform: [{ rotateZ: '270deg' }],
  },
});
