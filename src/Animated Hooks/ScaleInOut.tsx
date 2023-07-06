import React, { useRef, useEffect } from 'react';
import { Animated, Dimensions, Easing } from 'react-native';
import Globals from '../component-library/Globals';

interface Props {
  start?: boolean;
  delay?: number;
  style?: any;
  children?: any;
  scaleValue: number;
  initialScale?: number;
  duration?: number;
  disableBorderRadius?: boolean;
  onDone?: () => void;
  onStart?: () => void;
}

const ScaleInOut = (props: Props) => {
  const scale = useRef(
    new Animated.Value(props.initialScale ? props.initialScale : 1),
  ).current;
  const radius = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      if (props.start) {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: props.scaleValue,
            useNativeDriver: true,
          }),
          Animated.spring(radius, {
            toValue: Globals.dimension.borderRadius.large,
            useNativeDriver: true,
          }),
        ]).start((finished) => {
          props.onDone && props.onDone();
        });
      } else {
        Animated.parallel([
          Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.spring(radius, {
            toValue: 0,
            useNativeDriver: true,
          }),
        ]).start((finished) => {
          props.onStart && props.onStart();
        });
      }
    }, props.delay);
  }, [props.delay, props.duration, props.scaleValue, props.start]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ scale: scale }],
        ...(!props.disableBorderRadius ? { borderRadius: radius } : null),
        overflow: 'hidden',
      }}>
      {props.children}
    </Animated.View>
  );
};

export default ScaleInOut;
