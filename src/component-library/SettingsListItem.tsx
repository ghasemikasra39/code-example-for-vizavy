import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Globals from './Globals';
import BackArrowIcon from './graphics/Icons/BackArrowIcon';

interface Props {
  title: string;
  onPress: () => void;
}

export default class SettingsListItem extends React.Component<Props> {
  render() {
    const { title, onPress } = this.props;

    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <BackArrowIcon
            style={styles.image}
            primaryColor={Globals.color.brand.neutral1}
          />
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Globals.dimension.padding.small,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  title: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color : Globals.color.text.default,
  },
  image: {
    width: 10,
    height: 16,
    transform : [{ scaleX: -1 }] 
  },
});
