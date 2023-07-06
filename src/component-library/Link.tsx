import React from 'react';
import { Text, TextProps, GestureResponderEvent } from 'react-native';
// import { Linking } from 'expo';

interface Props extends TextProps {
  href: string;
}

export default class Link extends React.Component<Props> {
  handleOnPress = (event: GestureResponderEvent) => {
    // Linking.openURL(this.props.href);
    this.props.onPress && this.props.onPress(event);
  };

  render() {
    return (
      <Text {...this.props} onPress={this.handleOnPress}>
        {this.props.children}
      </Text>
    );
  }
}
