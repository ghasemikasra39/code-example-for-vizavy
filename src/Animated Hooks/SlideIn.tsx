import React, { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';
interface Props {
  done?: () => void;
  delay?: number;
  children?: any;
  style?: any;
  duration?: number;
  fadeIn?: boolean;
  slideOffset?: number;
  slideDirection?: 'vertical' | 'horizontal';
}

const SlideIn = (props: Props) => {
  const slideDirection = useRef(new Animated.Value(props.slideOffset)).current;

  useEffect(() => {
    setTimeout(() => {
      if (props.fadeIn) {
        Animated.parallel([
          Animated.timing(slideDirection, {
            toValue: 0,
            duration: props.duration,
            useNativeDriver: true,
          }),
        ]).start();
      } else {
        Animated.parallel([
          Animated.timing(slideDirection, {
            toValue: props.slideOffset,
            duration: props.duration,
            useNativeDriver: true,
          }),
        ]).start();
      }
    }, props.delay);
  }, [props.fadeIn, props.slideOffset]);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [
          props.slideDirection === 'vertical' 
            ? { translateY: slideDirection }
            : { translateX: slideDirection },
        ],
      }}>
      {props.children}
    </Animated.View>
  );
};

export default SlideIn;
