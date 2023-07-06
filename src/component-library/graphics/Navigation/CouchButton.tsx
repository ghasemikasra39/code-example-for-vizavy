import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

interface Props {
  focused?: boolean;
  fade?: boolean;
  style?: any;
}

export default class CouchButton extends React.Component<Props> {
  buildXml = (): string => {
    return `
    <svg width="21px" height="21px" viewBox="0 0 21 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>roomsIcon</title>
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
    </defs>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-64.000000, -75.000000)" fill="url(#linearGradient-1)" fill-rule="nonzero">
            <g id="roomsIcon" transform="translate(64.000000, 75.000000)">
                <g id="Group-5">
                    <rect id="Rectangle" x="0" y="11" width="10" height="10" rx="2"></rect>
                    <rect id="Rectangle-Copy-4" x="0" y="0" width="10" height="10" rx="2"></rect>
                    <rect id="Rectangle-Copy-3" x="11" y="11" width="10" height="10" rx="2"></rect>
                    <rect id="Rectangle-Copy-5" x="11" y="0" width="10" height="10" rx="2"></rect>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  };
  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <SvgXml xml={this.buildXml()} width={20} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 1,
  },
});
