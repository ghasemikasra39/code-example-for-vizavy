import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../../helper/CenterView';
import InfiniteSliderIndicator from '../../../src/component-library/InfiniteSliderIndicator';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { Store, State } from '@sambego/storybook-state';

const store = new Store({
  slide: 5,
});

const swipeRight = () => {
  store.set({
    slide: store.get('slide') === 0 ? 10 : store.get('slide') - 1,
  });
};

const swipeLeft = () => {
  store.set({
    slide: store.get('slide') === 10 ? 0 : store.get('slide') + 1,
  });
};

storiesOf('InfiniteSliderIndicator', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Default state', () => (
    <>
      <TouchableOpacity onPress={swipeRight}>
        <Text> Go Left </Text>
      </TouchableOpacity>
      <State store={store}>
        {state => [
          <InfiniteSliderIndicator
            key={'test'}
            slide={state.slide}
            style={{ marginVertical: 20 }}
          />,
          <Text key={'test2'}>(Slide: {state.slide})</Text>,
        ]}
      </State>
      <TouchableOpacity onPress={swipeLeft}>
        <Text> Go Right </Text>
      </TouchableOpacity>
    </>
  ))
  .add('Infinite rotation', () => (
    <>
      <TouchableOpacity onPress={swipeRight}>
        <Text> Go Left </Text>
      </TouchableOpacity>
      <State store={store}>
        {state => [
          <InfiniteSliderIndicator
            infinite
            key={'test3'}
            slide={state.slide}
            style={{ marginVertical: 20 }}
          />,
          <Text key={'test4'}>(Slide: {state.slide})</Text>,
        ]}
      </State>
      <TouchableOpacity onPress={swipeLeft}>
        <Text> Go Right </Text>
      </TouchableOpacity>
    </>
  ));
