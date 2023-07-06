import React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';
import Globals from '../../Globals';

interface Props {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  color?: string;
}

export default function TinyArrow(props: Props) {
  const { style, width, height, color } = props;
  function buildXml() {
    return `
    <svg width="10px" height="7px" viewBox="0 0 10 7" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>Path</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-229.000000, -96.000000)" 
        fill=${color ? color : Globals.color.text.grey} 
        fill-rule="nonzero">
            <g id="Icons/16px/Arrow--Glyph-Down" transform="translate(228.000000, 96.000000)">
                <g id="small-triangle-down">
                    <path d="M1.41496403,1.65079137 L5.2407434,6.11420063 C5.60016555,6.53352647 6.23146553,6.58208801 6.65079137,6.22266586 C6.68967018,6.18934117 6.72593191,6.15307944 6.7592566,6.11420063 L10.585036,1.65079137 C10.9444581,1.23146553 10.8958966,0.600165549 10.4765707,0.240743398 C10.2953276,0.085392161 10.0644906,-9.52081778e-16 9.82577936,0 L2.17422064,0 C1.62193589,-2.31613845e-16 1.17422064,0.44771525 1.17422064,1 C1.17422064,1.23871127 1.2596128,1.46954826 1.41496403,1.65079137 Z" id="Path"></path>
                </g>
            </g>
        </g>
    </g>
    </svg>
    `;
  }

  return (
    <SvgXml
      style={style}
      xml={buildXml()}
      width={width || 8}
      height={height || 8}
    />
  );
}
