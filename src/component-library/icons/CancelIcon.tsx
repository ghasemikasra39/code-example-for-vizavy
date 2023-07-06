import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  primaryColor: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class CancelIcon extends React.Component<Props> {
  static defaultProps: Props = {
    primaryColor: null,
    style: {},
    width: 16,
    height: 16,
  };

  xml = `
  <svg width="${this.props.width}" height="${
    this.props.height
  }" viewBox="0 0 8 8" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.766.234a.799.799 0 00-1.13 0L4.005 2.865 1.374.234a.799.799 0 00-1.13 1.13l2.631 2.631L.244 6.626a.799.799 0 101.13 1.13l2.631-2.631 2.631 2.631a.799.799 0 001.13-1.13L5.135 3.995l2.631-2.631a.799.799 0 000-1.13z" fill="${
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
}

const styles = StyleSheet.create({
  icon: {},
});
