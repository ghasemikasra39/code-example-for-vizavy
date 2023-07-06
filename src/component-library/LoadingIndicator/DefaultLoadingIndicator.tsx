import React from 'react';
import { StyleSheet, View } from 'react-native';
import Globals from '../Globals';
import LottieView from 'lottie-react-native';
import { defaultLoadingIndicator } from '../graphics/Images';
import ScaleInOut from '../../Animated Hooks/ScaleInOut';

interface Props {
  show: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function DefaultLoadingIndicator(props: Props) {
  const { size, show } = props;
  function compileSize() {
    let sizeStyle = styles.container;
    switch (size) {
      case 'small':
        sizeStyle = {
          ...sizeStyle,
          width: 20,
        };
        break;
      case 'medium':
        sizeStyle = {
          ...sizeStyle,
          width: 30,
        };
        break;
      case 'large':
        sizeStyle = {
          ...sizeStyle,
          width: 40,
        };
        break;
    }
    return sizeStyle;
  }

  function compileIconSize() {
    let iconStyle = styles.loadingIcon;
    switch (size) {
      case 'small':
        iconStyle = {
          ...iconStyle,
          width: 20,
        };
        break;
      case 'medium':
        iconStyle = {
          ...iconStyle,
          width: 30,
        };
        break;
      case 'large':
        iconStyle = {
          ...iconStyle,
          width: 40,
        };
        break;
    }
    return iconStyle;
  }
  return (
    <ScaleInOut
      start={!show}
      scaleValue={0}
      initialScale={0.001}
      style={compileSize()}>
      <View style={styles.wrapper}>
        <LottieView
          source={defaultLoadingIndicator}
          style={compileIconSize()}
          autoPlay
          loop
          speed={0.7}
        />
      </View>
    </ScaleInOut>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 100,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.text.grey,
    borderRadius: 100,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: 40,
    aspectRatio: 1,
  }
});
