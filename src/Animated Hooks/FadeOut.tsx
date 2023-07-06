import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

interface Props {
  done?: () => void;
  delay?: number;
  children?: any;
  style?: any;
  duration?: number;
  start?: boolean;
}

const FadeOut = (props: Props) => {
  const fadeOut = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (props.start) {
      setTimeout(() => {
        Animated.timing(fadeOut, {
          toValue: 0,
          duration: props.duration,
          useNativeDriver: true,
        }).start(() => {
          props.done && props.done();
        });
      }, props.delay);
    }
  }, [props.start]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeOut,
      }}>
      {props.children}
    </Animated.View>
  );
};

export default FadeOut;
