import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function ThreeDotsIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="86px" height="24px" viewBox="0 0 86 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>threeDotsIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-26.000000, -339.000000)" fill=${
          color ? color : Globals.color.text.grey
        }>
            <g id="threeDotsIcon" transform="translate(26.000000, 339.000000)">
                <circle id="Oval" cx="12" cy="12" r="12"></circle>
                <circle id="Oval-Copy" cx="43" cy="12" r="12"></circle>
                <circle id="Oval-Copy-2" cx="74" cy="12" r="12"></circle>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 20} style={style} />;
}
