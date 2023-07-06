import React from 'react';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import Globals from './Globals';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';

interface Props {
  changeColor?: boolean;
  message: string;
  handleOnPress?: () => void;
}

export default class AddReplyBox extends React.Component<Props> {

  render() {
    const {message} = this.props;
    return (
      <HapticFeedBackWrapper onPress={() => this.props.handleOnPress()}>
        <View style={this.compileBorderStyle()}>
          <Text style={this.compileTextStyle()}>{message}</Text>
        </View>
      </HapticFeedBackWrapper>
    );
  }

  compileBorderStyle = () => {
    const {changeColor} = this.props;
    let style = styles.replyContainer;

    if (changeColor) {
      style = {
        ...style,
        ...styles.shaddow,
      };
    }

    return style;
  };

  compileTextStyle = () => {
    const {changeColor} = this.props;
    let style = styles.replyText;

    if (changeColor) {
      style = {
        ...style,
        ...{color: Globals.color.text.default},
      };
    }

    return style;
  };
}

const styles = StyleSheet.create({
  replyContainer: {
    flex: 1,
    flexDirection: 'row',
    height: 42,
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    zIndex: 10,
    alignItems: 'center',
  },
  cameraContainer: {
    justifyContent: 'center',
    marginLeft: 5,
  },
  cameraIcon: {
    width: 20,
    height: 15,
  },
  replyText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  shaddow: {
    backgroundColor: Globals.color.background.light,
    borderWidth: 2,
    borderColor: Globals.color.text.default,
  },
});
