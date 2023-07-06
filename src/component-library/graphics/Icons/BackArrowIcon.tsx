import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function BackArrowIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="15px" height="24px" viewBox="0 0 15 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>backIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-218.000000, -63.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <g id="backIcon" transform="translate(218.000000, 63.000000)">
                <path d="M4.99492461,12 L13.4629795,20.4680549 C14.2709608,21.2760362 14.2709608,22.5860327 13.4629795,23.394014 C12.6549983,24.2019953 11.3450017,24.2019953 10.5370205,23.394014 L0.60598597,13.4629795 C-0.201995323,12.6549983 -0.201995323,11.3450017 0.60598597,10.5370205 L10.5370205,0.60598597 C11.3450017,-0.201995323 12.6549983,-0.201995323 13.4629795,0.60598597 C14.2709608,1.41396726 14.2709608,2.72396377 13.4629795,3.53194506 L4.99492461,12 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 9} style={style} />;
}
