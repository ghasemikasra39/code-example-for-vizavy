import React, { useMemo } from 'react';
import { StyleSheet, View, FlatList, Dimensions } from 'react-native';
import AnimatedEmoji from './AnimatedEmoji';
import { FLYING_EMOJI_COUNT } from '../../../screens/ChatRoom/ChatRoomConstants';

interface Props {
  emoji: string;
  index: number;
}

export default function FlyingUpEmojies(props: Props) {
  const { emoji } = props;

  function renderItem({ item }) {
    return <AnimatedEmoji emoji={item} />;
  }

  const renderFlyingUpEmojies = useMemo(() => {
    const animatedEmojiList = Array(FLYING_EMOJI_COUNT).fill(emoji);
    return (
      <View style={styles.container}>
        <FlatList
          data={animatedEmojiList}
          renderItem={renderItem}
          horizontal
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    );
  }, [emoji]);

  return renderFlyingUpEmojies;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});
