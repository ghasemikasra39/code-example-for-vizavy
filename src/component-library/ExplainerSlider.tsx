import React, { useMemo } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Globals from './Globals';
import Swiper from 'react-native-swiper';

interface Props {
  data: any;
}

export default function ExplainerSlider(props: Props) {
  const inActiveDot = useMemo(() => <View style={styles.dotContainer} />, []);

  const activeDot = useMemo(
    () => <View style={styles.activeDotContainer} />,
    [],
  );

  return (
    <Swiper
      style={styles.container}
      horizontal={true}
      dot={inActiveDot}
      paginationStyle={{marginBottom: -15}}
      activeDot={activeDot}>
      {props.data.map((item, index) => {
        return (
          <View
            key={index.toString()}
            style={styles.explainerContainer}>
            <Text style={styles.explainerText}>{item}</Text>
          </View>
        );
      })}
    </Swiper>
  );
}

const styles = StyleSheet.create({
  container: {},
  explainerContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: Globals.dimension.padding.medium,
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  explainerText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    textAlign: 'center',
    lineHeight: Globals.dimension.padding.small,
  },
  dotContainer: {
    width: 7,
    height: 7,
    backgroundColor: Globals.color.background.grey,
    borderRadius: 100,
    marginHorizontal: Globals.dimension.margin.tiny,
  },
  activeDotContainer: {
    width: 9,
    height: 9,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    marginHorizontal: Globals.dimension.margin.tiny,
  },
});
