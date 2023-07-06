import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function SendRequestIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="37px" height="26px" viewBox="0 0 37 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>sentRequestIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-289.000000, -108.000000)" fill=${
          color ? color : Globals.color.text.grey
        }>
            <g id="sentRequestIcon" transform="translate(289.000000, 109.000000)">
                <rect id="Rectangle" x="0" y="8.47058824" width="29.6470588" height="7.05882353" rx="3.52941176"></rect>
                <g id="Icons/16px/Arrow-Outline-Left" transform="translate(26.117647, 12.000000) scale(-1, -1) translate(-26.117647, -12.000000) translate(16.941176, 0.000000)" fill-rule="nonzero" stroke="#9A9A9A">
                    <path d="M6.34649245,12 L17.1059034,20.4680549 C18.132515,21.2760362 18.132515,22.5860327 17.1059034,23.394014 C16.0792919,24.2019953 14.4148257,24.2019953 13.3882142,23.394014 L0.769958644,13.4629795 C-0.256652881,12.6549983 -0.256652881,11.3450017 0.769958644,10.5370205 L13.3882142,0.60598597 C14.4148257,-0.201995323 16.0792919,-0.201995323 17.1059034,0.60598597 C18.132515,1.41396726 18.132515,2.72396377 17.1059034,3.53194506 L6.34649245,12 Z" id="Path"></path>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 15} style={style} />;
}
