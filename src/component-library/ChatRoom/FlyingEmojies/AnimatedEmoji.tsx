import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, Dimensions, Animated } from 'react-native';
import Globals from '../../Globals';

interface Props {
  emoji: string;
}

const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;
const ViewOffset = height / 5;

export default function AnimatedEmoji(props: Props) {
  const { emoji } = props;
  const [generatedEmoji, setGeneratedEmoji] = useState(null);
  const slideUp = useRef(new Animated.Value(0)).current;
  const slideHorizontal = useRef(new Animated.Value(0)).current;
  const rotationAngle = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const rotation = rotationAngle.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '90deg'],
  });

  useEffect(() => {
    //Create Emoji object that will animate the movement if the flying emoji
    const newEmoji = {
      time: getRandomTime(),
      translateY: height,
      translateX: getHorizontalMovement(),
      size: getRandomEmojiSize(),
      rotation: getRandomRotationAngle(),
      startPosition: getStartPosition(),
    };
    setGeneratedEmoji(newEmoji);
    animateEmoji(newEmoji);
  }, []);

  /**
   * Animate emoji
   * @method animateEmoji
   * @param {newEmoji : Animated Object} - Emoji will animate based on random generated emoji object
   */
  function animateEmoji(newEmoji) {
    Animated.parallel([
      //Slide up emoji
      Animated.timing(slideUp, {
        toValue: -newEmoji.translateY,
        duration: newEmoji.time,
        useNativeDriver: true,
      }),
      //Slide emoji horizontally
      Animated.timing(slideHorizontal, {
        toValue: newEmoji.translateX,
        duration: newEmoji.time,
        useNativeDriver: true,
      }),
      //Fade in emoji
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      //Rotate emoji
      Animated.timing(rotationAngle, {
        toValue: newEmoji.rotation,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }

  /**
   * Animate emoji in diffent paces
   * @method getRandomTime
   */
  function getRandomTime() {
    const max = 1500;
    const min = 1000;
    return Math.random() * (max - min) + min;
  }

  /**
   * Animate emoji on horizontal line
   * @method getHorizontalMovement
   */
  function getHorizontalMovement() {
    const max = 80;
    const min = -max;
    return Math.random() * (max - min) + min;
  }

  /**
   * Scale emoji randomly
   * @method getRandomEmojiSize
   */
  function getRandomEmojiSize() {
    const max = 80;
    const min = 25;
    return Math.random() * (max - min) + min;
  }

  /**
   * Rotate emoji randomly
   * @method getRandomRotationAngle
   */
  function getRandomRotationAngle() {
    return Math.random();
  }

  /**
   * Set initial starting position of emoji randomly
   * @method getRandomRotationAngle
   */
  function getStartPosition() {
    const max = width / 2;
    const min = -width / 2;
    return Math.random() * (max - min) + min;
  }

  /**
   * Renders the emojies initial starting position
   * @method compileEmojiContainerStyle
   */
  function compileEmojiContainerStyle() {
    let containerStyle = styles.emojiContainer;
    if (generatedEmoji) {
      containerStyle = {
        ...containerStyle,
        left: generatedEmoji.startPosition,
      };
    }
    return containerStyle;
  }

  /**
   * Renders the size of the emoji
   * @method compileEmojiStyle
   */
  function compileEmojiStyle() {
    let emojiStyle = styles.emoji;
    if (generatedEmoji) {
      emojiStyle = {
        fontSize: generatedEmoji.size,
      };
    }
    return emojiStyle;
  }

  const renderAnimatedEmoji = useMemo(() => {
    return (
      <Animated.View
        style={{
          ...compileEmojiContainerStyle(),
          transform: [{ translateY: slideUp }, { translateX: slideHorizontal }],
          opacity: opacity,
        }}>
        <Animated.View style={{ transform: [{ rotate: rotation }] }}>
          <Text style={compileEmojiStyle()}>{emoji}</Text>
        </Animated.View>
      </Animated.View>
    );
  }, [generatedEmoji]);

  return renderAnimatedEmoji;
}

const styles = StyleSheet.create({
  emojiContainer: {
    position: 'absolute',
    bottom: ViewOffset,
    justifyContent: 'flex-end',
  },
  emoji: {
    fontSize: Globals.font.size.xxLarge,
  },
});
