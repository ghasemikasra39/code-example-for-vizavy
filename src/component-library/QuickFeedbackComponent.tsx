import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Globals from './Globals';
import FadeInOut from '../Animated Hooks/FadeInOut';

interface Props {
  message: string;
  show: boolean;
  toggleView: () => void;
}

export default function QuickFeedbackComponent(props: Props) {
  const { message, show, toggleView } = props;
  const [fadeIn, setFadeIn] = useState(false);
  const ANIMATION_DURATION = 200;

  useEffect(() => {
    if (show) {
      setFadeIn(true);
    }
  }, [show]);

  function fadeOut() {
    const TIME_OUT_DURATION = 1000;
    setTimeout(() => setFadeIn(false), TIME_OUT_DURATION);
    setTimeout(() => toggleView(), TIME_OUT_DURATION + ANIMATION_DURATION);
  }

  return show ? (
    <FadeInOut
      fadeIn={fadeIn}
      style={styles.container}
      done={fadeOut}
      duration={ANIMATION_DURATION}>
      <Text style={styles.message}>{message}</Text>
    </FadeInOut>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    paddingHorizontal: Globals.dimension.padding.small,
    paddingVertical: Globals.dimension.padding.mini,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: Globals.dimension.borderRadius.large,
  },
  message: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
});
