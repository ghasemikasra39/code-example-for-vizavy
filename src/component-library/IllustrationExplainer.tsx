import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Globals from './Globals';

interface Props {
  image: any;
  headline: string;
  description: string;
}

export default function IllustrationExplainer(props: Props) {
  const { image, headline, description } = props;
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>{image}</View>
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  imageContainer: {
    height: 160,
    justifyContent: 'center',
  },
  headline: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    paddingTop: Globals.dimension.padding.mini,
  },
  description: {
    marginTop: Globals.dimension.margin.tiny,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.padding.large,
    textAlign: 'center',
  },
});
