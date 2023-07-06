import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Globals from '../Globals';
import Shimmer from 'react-native-shimmer';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  visible: boolean;
}

export default function MessageLoadingIndicator(props: Props) {
  const renderLoadingIndicator = useMemo(
    () =>
      props.visible ? (
        <Shimmer style={styles.container} opacity={0.5} duration={200}>
          <LinearGradient
            style={styles.wrapper}
            colors={[Globals.color.text.light, Globals.color.text.light]}>
            <View style={styles.loadingContainer} />
          </LinearGradient>
        </Shimmer>
      ) : null,
    [props.visible],
  );

  return renderLoadingIndicator;
}

const styles = StyleSheet.create({
  container: {
    width: '75%',
    height: 5,
    alignSelf: 'center',
    marginVertical: Globals.dimension.margin.tiny,
  },
  wrapper: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
  },
});
