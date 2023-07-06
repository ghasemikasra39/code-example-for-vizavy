import React, {useMemo} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import Globals from '../../component-library/Globals';
import {
  iPhoneSettingsIcon,
  youpendoIcon,
  iPhoneLocationIcon,
  switchIcon,
} from '../../component-library/graphics/Images';

const enableLocationSteps = [
  {
    step: '1. Go to Settings',
    icon: iPhoneSettingsIcon,
  },
  {
    step: '2. Go to Youpendo',
    icon: youpendoIcon,
  },
  {
    step: '3. Go to Location',
    icon: iPhoneLocationIcon,
  },
  {
    step: '4. Enable Location',
    icon: switchIcon,
  },
];

interface Props {
  name: string;
}

export default function LocationDeniedComponent(props: Props) {
  const renderLocationDeniedScreen = useMemo(
    () => (
      <View style={styles.wrapper}>
        <Text style={styles.title}>Ooops {props.name}... </Text>
        <Text style={styles.subTitle}>
          you need to enable your {<Text style={styles.beKind}>location</Text>}{' '}
          to use Youpendo.
        </Text>
        <Text style={styles.paragraph}>
          We wouldn't ask you twice if it's not important.
        </Text>

        <View style={styles.rulesContainer}>
          <FlatList
            data={enableLocationSteps}
            renderItem={({item}) => (
              <View style={styles.stepsWrapper}>
                <Text style={styles.steps}>{item.step}</Text>
                <Image source={item.icon} style={styles.stepsIcon}/>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </View>
    ),
    [props.name, enableLocationSteps],
  );

  return renderLocationDeniedScreen;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
  },
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xxLarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  subTitle: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    width: '100%',
  },
  paragraph: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    width: '100%',
  },
  beKind: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
  },
  rulesContainer: {
    width: '100%',
    marginTop: Globals.dimension.margin.medium,
  },
  rulesWrapper: {
    flexDirection: 'row',
    paddingVertical: Globals.dimension.padding.tiny,
    alignItems: 'center',
  },
  rules: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginLeft: Globals.dimension.margin.mini,
  },
  steps: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },

  stepsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Globals.dimension.padding.mini,
  },
  stepsIcon: {
    marginRight: Globals.dimension.padding.small,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.15,
    overflow: 'visible',
  },
});
