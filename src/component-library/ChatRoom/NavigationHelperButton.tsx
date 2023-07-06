import React, { useMemo, useRef, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, Animated, View } from 'react-native';
import Globals from './../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import { upArrow } from '../graphics/Images';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';

interface Props {
  colors: Array<string>;
  scrollToIndex: () => void;
  replies: Array<object>;
  show: boolean;
  nextReplyAbove: boolean;
}

export default function NavigationHelperButton(props: Props) {
  const increaseWidth = useRef(new Animated.Value(120)).current;
  const spinValue = useRef(new Animated.Value(0)).current;
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  useEffect(() => {
    animateButton();
    rotateArrowAnimation();
  }, [props.replies, props.show, props.nextReplyAbove]);


  /**
* Toogle between scroll down button and scroll to reply button
* @function animateButton
*/
  function animateButton() {
    if (props.show) {
      Animated.spring(increaseWidth, {
        toValue: props.replies?.length ? 0 : 75,
        useNativeDriver: true
      }).start();
    } else {
      Animated.spring(increaseWidth, {
        toValue: 120,
        useNativeDriver: true
      }).start();
    }
  }


  /**
  * Show or hide the button
  * @function toofleButtonAnimation
  */
  function rotateArrowAnimation() {

    if (props.nextReplyAbove && props.replies?.length) {
      Animated.timing(spinValue, {
        toValue: 0,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(spinValue, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    }
  }

  const renderNavigationHelperButton = useMemo(() => {
    const animatedStyle = {
      transform: [{ translateX: increaseWidth }]
    }

    const arrowStyle = {
      transform: [{ rotate: spin }]
    }

    return (
      <View style={styles.container}>
        <Animated.View style={[styles.innerContainer, animatedStyle]}>
          <HapticFeedBackWrapper onPress={() => props.scrollToIndex()}>
            <View style={styles.touchContainer}>
              <LinearGradient style={styles.wrapper} colors={props.colors}>
                <Animated.Image
                  source={upArrow}
                  style={[styles.downArrow, arrowStyle]}
                />
                {props.replies?.length ? (
                  <Text style={styles.reply}>
                    {props.replies?.length}{' '}
                    {props.replies?.length === 1 ? 'Reply' : 'Replies'}
                  </Text>
                ) : null}
              </LinearGradient>
            </View>
          </HapticFeedBackWrapper>
        </Animated.View>
      </View>
    )
  }, [props.scrollToIndex, props.replies]);

  return renderNavigationHelperButton
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: -Dimensions.get("window").width / 20,
    top: '50%',
    alignSelf: 'flex-end',
    width: 130,
    height: 38,
    borderRadius: 100,
    overflow: 'hidden',
    alignItems: 'flex-end',
  },
  innerContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F1004e',
    borderRadius: 100,
    overflow: 'hidden',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end'
  },
  touchContainer: {
    width: '100%',
    height: '100%'
  },
  wrapper: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: Globals.dimension.padding.mini
  },
  downArrow: {
    transform: [{ rotate: '180deg' }],
    width: 10,
    height: 15,
  },
  reply: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
    paddingLeft: Globals.dimension.padding.tiny,
  },
})
