import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function PollIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="37px" height="20px" viewBox="0 0 37 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>pollIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-24.000000, -112.000000)" fill=${color ?color :Globals.color.text.grey} fill-rule="nonzero">
            <g id="pollIcon" transform="translate(24.000000, 112.000000)">
                <g id="Icon-Poll">
                    <rect id="Rectangle" x="0.704235294" y="0.390235294" width="30.2202353" height="5.68905882" rx="1"></rect>
                    <rect id="Rectangle" x="0.704235294" y="7.244" width="35.6255294" height="5.68905882" rx="1"></rect>
                    <rect id="Rectangle" x="0.704235294" y="13.8256471" width="24.4517647" height="5.69223529" rx="1"></rect>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 25} />;
}
