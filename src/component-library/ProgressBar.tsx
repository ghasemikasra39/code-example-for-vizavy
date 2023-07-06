import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, Animated } from 'react-native';
import Globals from './Globals';

interface Props {
  total: number;
  progressIndex: number;
  duration?: number;
}

export default function ProgressBar(props: Props) {
  const { total, progressIndex, duration } = props;
  const screenWidth = Dimensions.get('window').width;
  const progress = useRef(new Animated.Value(0)).current;
  const progressInterpolate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  const progressStyle = {
    width: progressInterpolate,
    backgroundColor: Globals.color.brand.accent1,
    bottom: 0,
  };

  useEffect(() => {
    Animated.timing(progress, {
      toValue: progressIndex / (total - 1),
      duration: duration ? duration : 1000,
    }).start();
  }, [props.total, props.progressIndex]);

  function renderSeperator() {
    const seperatorLength = total - 2;
    const data = new Array(seperatorLength).fill('a');
    const seperatorSpace = screenWidth / (total - 1);
    const offset = 10;
    return (
      <View style={styles.seperatorContainer}>
        {data.map((item, index) => (
          <View
            style={{
              ...styles.seperator,
              left: (seperatorSpace - offset) * (index + 1),
            }}
          />
        ))}
      </View>
    );
  };


  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, styles.progressBarWrapper]}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>
      {renderSeperator()}
    </View>
  );
}
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.mediumgrey,
  },
  progressBarWrapper: {
    width: '100%',
    height: '100%',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
  },
  seperatorContainer: {
    width: width,
    height: 7,
    flexDirection: 'row',
  },
  seperator: {
    height: '100%',
    width: 10,
    backgroundColor: Globals.color.background.light,
  },
});
