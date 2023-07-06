import React, { useMemo } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Globals from './Globals';
import HeartIcon from './graphics/Icons/HeartIcon';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';

interface Props {
  count: number;
  upvoted: boolean;
  onPress: () => void;
  style?: any;
  heartPositionStyle?: any;
  color?: string;
}

export default function UpVoteWidget(props: Props) {
  const { count, upvoted, onPress, style, color } = props;

  const renderHeartButton = useMemo(() => {
    function compileTextStyle() {
      let textStyle = styles.counter;
      if (color) {
        textStyle = {
          ...textStyle,
          color: color,
        }
      }
      return textStyle;
    }
    return (
      <View style={style ? style : null}>
        <HapticFeedBackWrapper onPress={() => onPress()}>
          <View style={styles.button}>
            <HeartIcon isLiked={upvoted} size={26} color={color} />
            <Text style={compileTextStyle()}>{count}</Text>
          </View>
        </HapticFeedBackWrapper>
      </View>
    );
  }, [count, upvoted, color]);

  return renderHeartButton;
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
  },
  counter: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
    textAlign: 'center',
    marginTop: Globals.dimension.margin.tiny,
  },
});
