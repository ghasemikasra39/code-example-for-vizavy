import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';
import Globals from '../../Globals';

interface Props {
  isLiked?: boolean;
  style?: StyleProp<ViewStyle>;
  size?: number;
  color?: string;
}

export default function HeartIcon(props: Props) {
  const { isLiked, style, size, color } = props;

  function compileColor() {
    if (color) {
      return color;
    }
    if (isLiked) {
      return Globals.color.brand.primary;
    } else {
      return Globals.color.background.light;
    }
  }

  function buildXml() {
    return `
    <svg width="27px" height="25px" viewBox="0 0 27 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>heartnewIcon</title>
    <g id="Icons/-Popups" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-249.000000, -167.000000)" fill="${compileColor()}" fill-rule="nonzero" stroke="#8A8A8A" stroke-width="0.5">
            <g id="heartnewIcon" transform="translate(250.000000, 168.000000)">
                <path d="M12.4059039,23.5824753 C19.1280467,18.7494753 22.4910467,14.328761 24.0724753,10.956761 C25.9200467,7.01690384 24.3129039,2.13290384 20.281761,0.494046695 C15.5434753,-1.43152473 12.4059039,3.0110467 12.4059039,3.0110467 C12.4059039,3.0110467 9.29061815,-1.44309616 4.55276101,0.48333241 C0.521618152,2.12218955 -1.0855247,7.00618955 0.762046724,10.9460467 C2.3434753,14.3176181 5.68376101,18.7499038 12.4059039,23.5824753 Z" id="Path"></path>
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
      width={size || 20}
      height={size || 20}
    />
  );
}
