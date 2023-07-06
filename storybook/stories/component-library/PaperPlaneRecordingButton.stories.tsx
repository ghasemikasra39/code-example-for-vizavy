import React from 'react';
import PaperPlaneRecordingButton from '../../../src/component-library/PaperPlaneRecordingButton';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../../helper/CenterView';
import { action } from '@storybook/addon-actions';

storiesOf('PaperPlaneRecordingButton', module)
  .addDecorator(getStory => <CenterView dark>{getStory()}</CenterView>)
  .add('Default state', () => (
    <PaperPlaneRecordingButton
      onTakePicture={action('take picture')}
      onStartVideoRecording={action('start video recording')}
      onEndVideoRecording={action('end video recording')}
    />
  ));
