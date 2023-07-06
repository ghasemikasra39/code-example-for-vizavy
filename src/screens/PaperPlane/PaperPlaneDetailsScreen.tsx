import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import PaperPlaneDetailsItem from './PaperPlaneDetailsItem';
import Globals from '../../component-library/Globals';


export default function PaperPlaneDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    addEventListener();
    return () => removeEventListener();
  }, []);

  function addEventListener() {
    navigation.addListener('focus', () => setIsFocused(true));
    navigation.addListener('blur', () => setIsFocused(false));
  }

  function removeEventListener() {
    navigation.removeListener('focus', () => setIsFocused(true));
    navigation.removeListener('blur', () => setIsFocused(false));
  }
  return (
    <View style={styles.container}>
      <PaperPlaneDetailsItem
        item={route?.params?.item}
        navigation={navigation}
        isFocused={isFocused}
        returnRoute={route?.params?.returnRoute}
        userProfile={route?.params?.userProfile}
      />
    </View>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: Globals.color.background.dark,
  },
  loadingContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Globals.color.background.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingFooterContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: Globals.color.background.dark,
    alignItems: 'center',
  },
});
