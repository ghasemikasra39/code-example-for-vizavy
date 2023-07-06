import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import Globals from '../Globals';

interface Props {
  primaryColor?: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class SendPaperPlaneIcon extends React.Component<Props> {
  static defaultProps: Props = {
    primaryColor: Globals.color.background.light,
    style: {},
    width: 21,
    height: 21,
  };

  xml = `
  <svg width="${this.props.width}" height="${
    this.props.height
  }" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.975 1.025A1.258 1.258 0 0018.663.73L1.053 7.02a1.256 1.256 0 00-.139 2.308l5.769 2.883 7.372-5.266-5.267 7.374 2.883 5.768c.215.426.652.694 1.126.694l.077-.002c.503-.03.94-.357 1.109-.833l6.29-17.61a1.261 1.261 0 00-.298-1.311z" fill="${
        this.props.primaryColor
      }" fill-rule="nonzero"/>
  </svg>
  `;

  render() {
    return (
      <SvgXml
        style={[styles.icon, this.props.style]}
        xml={this.xml}
        width={this.props.width}
        height={this.props.height}
      />
    );
  }

  calculateScale() {
    return this.props.width / 21;
  }
}

const styles = StyleSheet.create({
  icon: {},
});
