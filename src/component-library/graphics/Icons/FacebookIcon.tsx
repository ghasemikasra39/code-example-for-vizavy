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

export default function FacebookIcon(props: Props) {
  const { style, width, height, color } = props;
  function buildXml() {
    return `
    <svg width="168px" height="168px" viewBox="0 0 168 168" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>facebook-circular-logo</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="facebook-circular-logo" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <path d="M83.829,0.349 C37.532,0.349 0,37.881 0,84.178 C0,125.701 30.222,160.089 69.848,166.748 L69.848,101.667 L49.626,101.667 L49.626,78.247 L69.848,78.247 L69.848,60.978 C69.848,40.941 82.086,30.022 99.963,30.022 C108.525,30.022 115.883,30.66 118.019,30.941 L118.019,51.885 L105.62,51.891 C95.9,51.891 94.026,56.509 94.026,63.288 L94.026,78.235 L117.219,78.235 L114.194,101.655 L94.026,101.655 L94.026,167.308 C135.502,162.26 167.657,126.996 167.657,84.154 C167.657,37.881 130.125,0.349 83.829,0.349 Z" id="Path"></path>
        </g>
    </g>
</svg>
    `;
  }

  return (
    <SvgXml
      style={style}
      xml={buildXml()}
      width={width || 20}
      height={height || 20}
    />
  );
}
