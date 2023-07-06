import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import FlyingUpEmojies from './FlyingUpEmojies';

interface Props {
  reactions: Array<Object>;
}

interface emoji {
  emoji: string;
}

export default function FlyingUpEmojiesList(props: Props) {
  const { reactions } = props;
  const renderFlyingUpEmojiesList = useMemo(
    () =>
      reactions.map((item: emoji, index) => (
        <View style={styles.container}>
          <FlyingUpEmojies emoji={item.emoji} index={index} />
        </View>
      )),
    [reactions],
  );

  return renderFlyingUpEmojiesList;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
