import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  primaryColor: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class RemoveIcon extends React.Component<Props> {
  xml = `
  <svg height="32" width="32" xmlns="http://www.w3.org/2000/svg">
    <g clip-rule="evenodd" fill="${
      this.props.primaryColor
    }" fill-rule="evenodd">
        <path d="M29.98 6.819A2.99 2.99 0 0027 4.003h-3V3.001a3 3 0 00-3-3H11a3 3 0 00-3 3v1.001H5a2.99 2.99 0 00-2.981 2.816H2v2.183a2 2 0 002 2v17a4 4 0 004 4h16a4 4 0 004-4v-17a2 2 0 002-2V6.819zM10 3.002a1 1 0 011-1h10a1 1 0 011 1v1H10zm16 25c0 1.102-.898 2-2 2H8c-1.103 0-2-.898-2-2v-17h20zm2-20.001v1H4V7.002a1 1 0 011-1h22a1 1 0 011 1z"/>
        <path d="M9 28.006h2a1 1 0 001-1v-13a1 1 0 00-1-1H9a1 1 0 00-1 1v13a1 1 0 001 1zm0-14.001h2v13H9zM15 28.006h2a1 1 0 001-1v-13a1 1 0 00-1-1h-2a1 1 0 00-1 1v13a1 1 0 001 1zm0-14.001h2v13h-2zM21 28.006h2a1 1 0 001-1v-13a1 1 0 00-1-1h-2a1 1 0 00-1 1v13a1 1 0 001 1zm0-14.001h2v13h-2z"/>
    </g>
  </svg>`;

  render() {
    return (
      <SvgXml
        style={[styles.icon, this.props.style]}
        xml={this.xml}
        width={this.props.width || 32}
        height={this.props.height || 32}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {},
});
