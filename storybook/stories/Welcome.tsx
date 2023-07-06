import React from 'react';
import { Text } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../helper/CenterView';

storiesOf('Welcome', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('hi ho', () => <Text>Welcome to the Youpendo storybook.</Text>);
