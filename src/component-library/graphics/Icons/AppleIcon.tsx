import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function AppleIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="438px" height="512px" viewBox="0 0 438 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>apple</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="apple" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <path d="M314.98,0 C287.684,1.888 255.78,19.36 237.188,42.112 C220.228,62.752 206.276,93.408 211.716,123.2 C241.54,124.128 272.356,106.24 290.212,83.104 C306.916,61.568 319.556,31.104 314.98,0 Z" id="Path"></path>
            <path d="M422.852,171.776 C396.644,138.912 359.812,119.84 325.028,119.84 C279.108,119.84 259.684,141.824 227.78,141.824 C194.884,141.824 169.892,119.904 130.18,119.904 C91.172,119.904 49.636,143.744 23.3,184.512 C-13.724,241.92 -7.388,349.856 52.612,441.792 C74.084,474.688 102.756,511.68 140.26,512.0035 C173.636,512.32 183.044,490.592 228.26,490.368 C273.476,490.112 282.052,512.288 315.364,511.936 C352.9,511.648 383.14,470.656 404.612,437.76 C420.004,414.176 425.732,402.304 437.668,375.68 C350.852,342.624 336.932,219.168 422.852,171.776 Z" id="Path"></path>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 17} style={style} />;
}
