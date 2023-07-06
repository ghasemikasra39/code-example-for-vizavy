import React, { useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import Globals from '../Globals';
import { reactionsData } from '../../screens/ChatRoom/ChatRoomConstants';
import ScaleInOut from '../../Animated Hooks/ScaleInOut';
import EmojiComponent from './EmojiComponent';

interface Props {
  showReactions: boolean;
  onEmojiPressed: (item: string) => void;
}

export default function ReactionsComponent(props: Props) {
  const [activeEmojiIndex, setActiveEmojiIndex] = useState(null);
  const { onEmojiPressed } = props;

  /**
   * Perform action when clicking on a single emoji
   * @method handleOnPress
   */
  function handleOnPress(item, index) {
    onEmojiPressed(item);
    setActiveEmojiIndex(index);
  }

  function renderItem({ item, index }) {
    return (
      <EmojiComponent
        emoji={item}
        index={index}
        onEmojiPressed={handleOnPress}
        currentlyActive={index === activeEmojiIndex}
      />
    );
  }

  return (
    <ScaleInOut
      start={!props.showReactions}
      scaleValue={0}
      initialScale={0.001}
      duration={200}
      style={styles.container}>
      <FlatList
        data={reactionsData}
        renderItem={renderItem}
        horizontal={true}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContainer}
        keyExtractor={(index) => index.toString()}
        keyboardShouldPersistTaps={'handled'}
      />
    </ScaleInOut>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: Globals.color.background.light,
    borderTopEndRadius: Globals.dimension.borderRadius.mini,
    borderTopLeftRadius: Globals.dimension.borderRadius.mini,
  },
  emoji: {
    fontSize: Globals.font.size.xxLarge,
    textAlign: 'center',
  },
});
