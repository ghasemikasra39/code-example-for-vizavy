import React, { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';
import { Value } from 'react-native-reanimated';
interface Props {
  done?: () => void;
  start?: () => void;
  delay?: number;
  children?: any;
  style?: any;
  duration?: number;
  fadeIn?: boolean;
}

const FadeInOut = (props: Props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      if (props.fadeIn) {
        Animated.timing(opacity, {
          toValue: 1,
          duration: props.duration,
          useNativeDriver: true,
        }).start(() => props.done && props.done());
      } else {
        Animated.timing(opacity, {
          toValue: 0,
          duration: props.duration,
          useNativeDriver: true,
        }).start(() => props.start && props.start());
      }
    }, props.delay);
  }, [props.fadeIn, opacity, props.duration]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: opacity,
      }}>
      {props.children}
    </Animated.View>
  );
};

export default FadeInOut;
