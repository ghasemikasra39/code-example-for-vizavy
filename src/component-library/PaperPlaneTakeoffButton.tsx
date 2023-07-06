import React from 'react';
import { StyleProp, StyleSheet, ViewStyle, View, Text } from 'react-native';
import Button from '../component-library/Button';
import Globals from '../component-library/Globals';
import SendPaperPlaneIcon from './graphics/Icons/SendPaperPlaneIcon';

interface Props {
  title?: string;
  style?: StyleProp<ViewStyle> | {};
  onLockIn?: () => void;
  uploading?: boolean;
}

export default class PaperPlaneTakeoffButton extends React.Component<Props> {
  static defaultProps: Props = {
    onLockIn: () => {},
  };

  render() {
    const { title, uploading } = this.props;
    return (
      <View style={this.compileButtonStyles()}>
        <Button
          title={<Text style={styles.buttonLabel}>{title}</Text>}
          primary
          onPress={this.handleLockIn}
          style={styles.shadowAndroid}
          loading={uploading}
          iconRight={
            <SendPaperPlaneIcon
              color={Globals.color.text.light}
              style={{ marginLeft: Globals.dimension.margin.tiny }}
            />
          }
        />
      </View>
    );
  }

  handleLockIn = () => {
    this.props.onLockIn && this.props.onLockIn();
  };

  compileButtonStyles = () => ({
    ...styles.buttonWrapper,
    ...(this.props.style || {}),
  });
}

const styles = StyleSheet.create({
  buttonWrapper: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: Globals.dimension.margin.mini,
    marginBottom: Globals.dimension.margin.tiny,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonLabel: {
    fontFamily: Globals.font.family.bold,
    marginHorizontal: Globals.dimension.padding.small,
  },
  shadowAndroid: {
    backgroundColor: Globals.color.brand.primary,
    elevation: 15,
    borderRadius: Globals.dimension.borderRadius.large,
  },
});
