import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function NextIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="29px" height="22px" viewBox="0 0 29 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>nextIcon</title>
    <g id="privateMessages" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="newWorld" transform="translate(-330.000000, -719.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <g id="next" transform="translate(321.000000, 707.000000)">
                <g id="nextIcon" transform="translate(23.000000, 23.000000) rotate(-90.000000) translate(-23.000000, -23.000000) translate(12.627451, 9.019608)">
                    <path d="M10.4627451,27.8405229 C10.0682876,27.8405229 9.69114771,27.6788915 9.41983791,27.3941124 L1.21199477,16.8712366 C0.336491503,15.9553255 0.986865359,14.4313725 2.25490196,14.4313725 L5.65228758,14.3712418 L6.76470588,3.15686275 C6.76470588,1.83110065 7.84417255,0.751633987 9.16993464,0.751633987 L11.124183,0.751633987 C12.4499451,0.751633987 13.5294118,1.83110065 13.5294118,3.15686275 L15.2732026,14.3712418 L18.8002301,14.2464105 C20.0682667,14.2464105 20.7186405,15.7703634 19.8431373,16.6862745 L11.5056523,27.3941124 C11.2343425,27.6788915 10.8572026,27.8405229 10.4627451,27.8405229 Z" id="Path"></path>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 20} style={style} />;
}
