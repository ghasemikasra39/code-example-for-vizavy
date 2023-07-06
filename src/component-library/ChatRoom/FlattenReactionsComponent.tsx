import React, {useMemo, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import Globals from '../Globals';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';

interface Props {
  data: Array<string>;
  totalUsersReacted: number;
  onPress: () => void;
}

export default function FlattenReactionsComponent(props: Props) {
  const {data, totalUsersReacted, onPress} = props;

  const listFooterComponent = useMemo(
    () => <Text style={styles.totalStyle}>{totalUsersReacted}</Text>,
    [totalUsersReacted],
  );

  function renderItem({item}) {
    return <Text style={styles.emoji}>{item}</Text>;
  }

  const renderFlattenReactions = useMemo(
    () =>
      data?.length > 0 ? (
        <HapticFeedBackWrapper
          onPress={onPress}
          hitSlop={{top: 25, bottom: 5, left: 10}}>
          <View style={styles.container}>
            <FlatList
              data={data}
              renderItem={renderItem}
              ListFooterComponent={listFooterComponent}
              keyExtractor={(index) => index.toString()}
              horizontal
              contentContainerStyle={styles.flatListWrapper}
            />
          </View>
        </HapticFeedBackWrapper>
      ) : null,
    [props.data, onPress],
  );

  return renderFlattenReactions;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Globals.dimension.borderRadius.large,
    padding: Globals.dimension.padding.tiny,
    paddingVertical: Globals.dimension.padding.tiny * 0.3,
    backgroundColor: Globals.color.background.light,
    elevation: 8,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.10,
    overflow: 'visible',
  },
  flatListWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emoji: {
    fontSize: Globals.font.size.tiny * 0.8,
  },
  totalStyle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xTiny,
    color: Globals.color.text.default,
    paddingLeft: Globals.dimension.padding.tiny * 0.5,
  },
});
