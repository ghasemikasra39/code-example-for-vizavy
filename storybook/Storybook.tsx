import React from 'react';
import { registerRootComponent, AppLoading } from 'expo';
import Storybook from '../storybook';
import { InitialProps } from 'expo/build/launch/withExpoRoot.types';
import AppPreloader from '../src/services/utility/AppPreloader';

export default class App extends React.Component<InitialProps> {
  state = {
    isReady: false,
  };

  render() {
    if (!this.state.isReady) {
      return (
        <AppLoading
          startAsync={AppPreloader.preloadAssets}
          onFinish={() => this.setState({ isReady: true })}
        />
      );
    }
    return <Storybook />;
  }
}

registerRootComponent(App);
