import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Globals from '../../component-library/Globals';
import LocationIcon from '../../component-library/graphics/Icons/LocationIcon';
import { locationIllustration } from '../../component-library/graphics/Images';

export default function EnablePermissionsComponent() {
  const screenHeight = Dimensions.get('window').height;
  return (
    <ImageBackground style={styles.wrapper} source={locationIllustration}>
      <Text style={styles.title}>One last thing...</Text>
      <View style={styles.illustrationWrapper}>
        <LocationIcon style={styles.locationIcon} size={screenHeight * 0.2} />
        <Text style={styles.subTitle}>Enable Location</Text>
        <Text style={styles.paragraph}>
          Youpendo needs your location to connect you with new people around the
          world.
      </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  illustrationWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationIcon: {
    marginVertical: Globals.dimension.margin.small,
  },
  subTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.medium,
    width: '100%',
    textAlign: 'center',
    marginTop: Globals.dimension.margin.tiny,
  },
  paragraph: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    textAlign: 'center',
  },
});
