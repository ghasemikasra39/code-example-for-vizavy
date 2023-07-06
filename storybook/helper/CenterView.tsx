import React from 'react';
import { View } from 'react-native';

interface Props {
  dark?: boolean;
}

export default class CenterView extends React.Component<Props> {
  render() {
    return (
      <View style={this.props.dark ? style.centerViewDark : style.centerView}>
        {this.props.children}
      </View>
    );
  }
}

const style = {
  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  centerViewDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555555',
  },
};
