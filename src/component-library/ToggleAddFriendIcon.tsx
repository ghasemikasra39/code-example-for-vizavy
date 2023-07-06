import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Globals from './Globals';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';
import PlusIcon from './graphics/Icons/PlusIcon';

interface Props {
  status: string;
  onPress: () => void;
}

export const ADD = 'Add';
export const PENDING = 'Sent';
export const FRIENDS = 'Friends';

export default function ToggleAddFriendIcon(props) {
  const { status } = props;
  return (
    <HapticFeedBackWrapper
      onPress={props.onPress}
      vibrationIntensity={'impactLight'}
      disabled={status === (PENDING || FRIENDS)}>
      <View style={styles.container}>
        <PlusIcon size={8} />
      </View>
    </HapticFeedBackWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 20,
    aspectRatio: 1,
    backgroundColor: Globals.color.brand.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    paddingHorizontal: Globals.dimension.margin.tiny,
  },
  buttonTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
    marginLeft: Globals.dimension.margin.tiny * 0.5,
  },
  plusIcon: {
    width: 10,
    height: 10,
  },
});
