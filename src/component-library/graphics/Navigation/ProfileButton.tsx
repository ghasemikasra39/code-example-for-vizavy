import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

interface Props {
  focused: boolean;
  style?: any;
  fade?: boolean;
}

export default class ProfileButton extends React.Component<Props> {
  buildXml = (): string => {
    return `
    <svg width="37px" height="38px" viewBox="0 0 37 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>user</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="100%" y1="0%" x2="0%" y2="100%" id="linearGradient-1">
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.brand.accent1
            : this.props.fade
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="0%"></stop>
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.brand.accent3
            : this.props.fade
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="100%" y1="38.8503086%" x2="0%" y2="61.1496914%" id="linearGradient-2">
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.brand.accent1
            : this.props.fade
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="0%"></stop>
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.brand.accent3
            : this.props.fade
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Youpendo-Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-Room_Tab-" transform="translate(-176.000000, -708.000000)" fill-rule="nonzero">
            <g id="user" transform="translate(176.000000, 708.000000)">
                <path d="M19,0 C14.0374,0 10,4.0374 10,9 C10,13.9626 14.0374,18 19,18 C23.9626,18 28,13.9626 28,9 C28,4.0374 23.9626,0 19,0 Z" id="Path" fill="url(#linearGradient-1)"></path>
                <path d="M31.9548581,25.6665802 C28.9980581,22.6572594 25.0782981,21 20.9175781,21 L16.1175781,21 C11.9569381,21 8.03709812,22.6572594 5.08029812,25.6665802 C2.13797813,28.6611462 0.517578125,32.613967 0.517578125,36.7971698 C0.517578125,37.4614528 1.05485812,38 1.71757812,38 L35.3175781,38 C35.9802981,38 36.5175781,37.4614528 36.5175781,36.7971698 C36.5175781,32.613967 34.8971781,28.6611462 31.9548581,25.6665802 Z" id="Path" fill="url(#linearGradient-2)"></path>
            </g>
        </g>
    </g>
</svg>`;
  };

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <SvgXml xml={this.buildXml()} width={22} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
