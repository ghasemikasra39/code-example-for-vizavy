import React, { useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import Globals from '../Globals';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';


interface Props {
  emoji: string;
  index: number;
  onEmojiPressed: (emoji: string, index: number) => void;
  currentlyActive: boolean;
}

export default function EmojiComponent(props: Props) {
  const [count, setCount] = useState(0);
  const { emoji, onEmojiPressed, index, currentlyActive } = props;

  /**
   * Perform action when clicking on a single emoji
   * @method handleOnpress
   */
  function handleOnpress() {
    onEmojiPressed(emoji, index);
    setCount(count + 1);
  }

  /**
   * Return background style of container style 
   * @method compileBackgroundStyle
   */
  function compileBackgroundStyle() {
    let backgroundStyle = styles.container;
    if (currentlyActive) {
      backgroundStyle = {
        ...backgroundStyle,
        backgroundColor: Globals.color.background.mediumgrey,
      }
    }
    return backgroundStyle;
  }

  return (
    <HapticFeedBackWrapper onPress={handleOnpress}>
      <View style={styles.parentContainer}>
        <View style={compileBackgroundStyle()}>
          <Text style={styles.emoji}>{emoji}</Text>
          {count > 0 ? (
            <View style={styles.countContainer}>
              <Text style={styles.count}>{count}x</Text>
            </View>
          ) : null}
        </View>
      </View>
    </HapticFeedBackWrapper>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    width: Dimensions.get('window').width / 6,
    paddingVertical: Globals.dimension.padding.tiny * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: 42,
    aspectRatio: 1,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    padding: 3,
    elevation: 8,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.15,
    overflow: 'visible',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: Globals.font.size.xlarge,
    textAlign: 'center',
  },
  countContainer: {
    position: 'absolute',
    bottom: 5,
    alignSelf: 'flex-end',
    right: -3,
    backgroundColor: Globals.color.background.light,
    padding: 2,
    borderRadius: 100,
  },
  count: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xTiny,
    color: Globals.color.text.default,
  }
});
