import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function WriteIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="32px" height="31px" viewBox="0 0 32 31" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>writeIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-68.000000, -103.000000)">
            <g id="writeIcon" transform="translate(69.000000, 103.000000)">
                <g fill=${
                  color ? color : Globals.color.text.grey
                } font-family="CeraRoundPro-Bold, Cera Round Pro" font-size="25.2" font-weight="bold" id="Aa">
                    <text>
                        <tspan x="0" y="25">Aa</tspan>
                    </text>
                </g>
                <path d="M0,29.5 C0,29.5 30,29.5 30,29.5" id="Line" stroke=${
                  color ? color : Globals.color.text.grey
                } stroke-width="3" stroke-linecap="round"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 25} style={style} />;
}
