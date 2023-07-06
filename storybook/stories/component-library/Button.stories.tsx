import React from 'react';
import { action } from '@storybook/addon-actions';
import Button from '../../../src/component-library/Button';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../../helper/CenterView';

storiesOf('Button', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Default state', () => (
    <Button onPress={action('clicked-text')} title="Youpendo" />
  ))
  .add('Primary', () => (
    <Button primary onPress={action('clicked-text')} title="Youpendo" />
  ));
