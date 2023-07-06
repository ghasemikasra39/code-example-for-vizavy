import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

interface Props {
  colors: Array<string>;
  style?: any;
}

export default function AddFriendsIcon(props: Props) {
  const { colors, style } = props;
  function buildXml(): string {
    return `
    <svg width="36px" height="26px" viewBox="0 0 36 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>addFriendsIcon</title>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[1] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[1] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-3">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[1] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-4">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[1] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-207.000000, -108.000000)" fill-rule="nonzero">
            <g id="addFriendsIcon" transform="translate(208.000000, 109.000000)">
                <g id="meIcon-Copy" transform="translate(11.000000, 0.000000)" stroke-width="2">
                    <path d="M11.1986438,13.5128271 C3.99041882,13.5128271 4.08562073e-14,16.8079934 4.08562073e-14,23 C4.08562073e-14,23.4836034 0.412569281,23.9904 0.896172638,23.9904 L21.501068,23.9904 C21.9846714,23.9904 22.3766239,23.5984475 22.3766239,23.1148441 C22.3766239,16.9231655 18.4068687,13.5128271 11.1986438,13.5128271 Z" id="Path" stroke="url(#linearGradient-1)" fill="url(#linearGradient-1)"></path>
                    <path d="M11.5,0 C8.64947842,0 6.5,2.08286554 6.5,4.84475643 C6.5,7.68753568 8.74298311,10 11.5,10 C14.2570169,10 16.5,7.68753568 16.5,4.84498634 C16.5,2.08286554 14.3505216,0 11.5,0 Z" id="Path" stroke="url(#linearGradient-2)" fill="url(#linearGradient-2)"></path>
                </g>
                <path d="M5.5,4.02253521 C5.5,3.45780461 5.99248678,3 6.6,3 C7.20751322,3 7.7,3.45780461 7.7,4.02253521 L7.7,15.1774648 C7.7,15.7421954 7.20751322,16.2 6.6,16.2 C5.99248678,16.2 5.5,15.7421954 5.5,15.1774648 L5.5,4.02253521 Z" id="Path" stroke="url(#linearGradient-3)" stroke-width="0.55" fill="url(#linearGradient-3)"></path>
                <path d="M12.1774648,8.5 C12.7421954,8.5 13.2,8.99248678 13.2,9.6 C13.2,10.2075132 12.7421954,10.7 12.1774648,10.7 L1.02253521,10.7 C0.457804608,10.7 0,10.2075132 0,9.6 C0,8.99248678 0.457804608,8.5 1.02253521,8.5 L12.1774648,8.5 Z" id="Path" stroke="url(#linearGradient-4)" stroke-width="0.55" fill="url(#linearGradient-4)"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return (
    <View style={[style, styles.container]}>
      <SvgXml xml={buildXml()} width={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
