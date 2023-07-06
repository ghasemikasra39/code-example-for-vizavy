import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

const FadeUp = (props) => {
  const fadeDown = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeDown, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideUp, {
          toValue: 20,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start();
    }, props.delay);
  }, []);

  return (
    <Animated.View
      style={{
        ...props.style,
        transform: [{ translateY: slideUp }],
        opacity: fadeDown,
      }}>
      {props.children}
    </Animated.View>
  );
};

export default FadeUp;
