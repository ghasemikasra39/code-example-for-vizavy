import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  primaryColor: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class UserProfileIcon extends React.Component<Props> {
  xml = `<svg width="18" height="17" xmlns="http://www.w3.org/2000/svg"><g transform="translate(1 1)" stroke="${
    this.props.primaryColor
  }" stroke-width="1.2" fill="none" fill-rule="evenodd"><circle cx="7.75" cy="4.25" r="4.25"/><path stroke-linecap="round" d="M.5 15h15M10.5 8a8.41 8.41 0 013.561 2.846C15.441 12.754 15.5 15 15.5 15M2.846 9.52c-.813.766-1.403 1.604-1.77 2.513C.708 12.942.516 13.931.5 15"/></g></svg>`;

  render() {
    return (
      <SvgXml
        style={[styles.icon, this.props.style]}
        xml={this.xml}
        width={this.props.width || 18}
        height={this.props.height || 17}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    marginHorizontal: 10,
  },
});
