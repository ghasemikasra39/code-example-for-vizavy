import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function CheckMarkIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="34px" height="25px" viewBox="0 0 34 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>checkIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-338.000000, -108.000000)" fill=${
          color ? color : Globals.color.text.grey
        }>
            <g id="checkIcon" transform="translate(338.000000, 108.000000)">
                <rect id="Rectangle" transform="translate(21.539845, 12.500000) rotate(45.000000) translate(-21.539845, -12.500000) " x="19.0398449" y="-2" width="5" height="29" rx="2.5"></rect>
                <rect id="Rectangle-Copy" transform="translate(8.500000, 16.525126) rotate(135.000000) translate(-8.500000, -16.525126) " x="6" y="8.02512627" width="5" height="17" rx="2.5"></rect>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 17} style={style} />;
}
