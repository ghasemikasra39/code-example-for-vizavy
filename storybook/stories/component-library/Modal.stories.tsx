import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../../helper/CenterView';
import Modal from '../../../src/component-library/Modal';
import Button from '../../../src/component-library/Button';
import { Store, State } from '@sambego/storybook-state';

const store = new Store({
  default: false,
  bottom: false,
  top: false,
  card: false,
  fullscreen: false,
  background: false,
  fullscreenCardImage: false,
});

const toggleModal = key => {
  const changes = {};
  changes[key] = !store.get(key);
  store.set(changes);
};

storiesOf('Modal', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('Default modal', () => (
    <>
      <Button
        key="button"
        onPress={() => toggleModal('default')}
        title="Launch modal"
      />
      <State store={store}>
        {state => [
          <Modal key="modal" isVisible={state.default}>
            <Button
              onPress={() => toggleModal('default')}
              primary
              title="Close me"
            />
          </Modal>,
        ]}
      </State>
    </>
  ))
  .add('Bottom modal', () => (
    <>
      <Button
        key="button"
        onPress={() => toggleModal('bottom')}
        title="Launch modal"
      />
      <State store={store}>
        {state => [
          <Modal key="modal" placement="bottom" isVisible={state.bottom}>
            <Button
              onPress={() => toggleModal('bottom')}
              primary
              title="Close me"
            />
          </Modal>,
        ]}
      </State>
    </>
  ))
  .add('Card modal', () => (
    <>
      <Button
        key="button"
        onPress={() => toggleModal('card')}
        title="Launch modal"
      />
      <State store={store}>
        {state => [
          <Modal card key="modal" isVisible={state.card}>
            <Button
              onPress={() => toggleModal('card')}
              primary
              title="Close me"
            />
          </Modal>,
        ]}
      </State>
    </>
  ))
  .add('Fullscreen modal', () => (
    <>
      <Button
        key="button"
        onPress={() => toggleModal('fullscreen')}
        title="Launch modal"
      />
      <State store={store}>
        {state => [
          <Modal fullscreen key="modal" isVisible={state.fullscreen}>
            <Button
              onPress={() => toggleModal('fullscreen')}
              primary
              title="Close me"
            />
          </Modal>,
        ]}
      </State>
    </>
  ))
  .add('Background image modal', () => (
    <>
      <Button
        key="button"
        onPress={() => toggleModal('background')}
        title="Launch modal"
      />
      <State store={store}>
        {state => [
          <Modal
            fullscreen
            key="modal"
            isVisible={state.background}
            backgroundImage={require('../../../assets/splash.png')}>
            <Button
              onPress={() => toggleModal('background')}
              primary
              title="Close me"
            />
          </Modal>,
        ]}
      </State>
    </>
  ))
  .add('Fullscreen card background image modal', () => (
    <>
      <Button
        key="button"
        onPress={() => toggleModal('fullscreenCardImage')}
        title="Launch modal"
      />
      <State store={store}>
        {state => [
          <Modal
            fullscreen
            card
            key="modal"
            isVisible={state.fullscreenCardImage}
            backgroundImage={require('../../../assets/splash.png')}>
            <Button
              onPress={() => toggleModal('fullscreenCardImage')}
              primary
              title="Close me"
            />
          </Modal>,
        ]}
      </State>
    </>
  ));
