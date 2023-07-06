import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function CopyIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="19px" height="24px" viewBox="0 0 19 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>copyIcon</title>
    <g id="Icons/-Popups" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-31.000000, -604.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <g id="copyIcon" transform="translate(31.000000, 604.000000)">
                <path d="M11.8519182,23.04 L3.49872123,23.04 C1.56947032,23.04 0,21.4250976 0,19.44 L0,7.245 C0,5.25990236 1.56947032,3.645 3.49872123,3.645 L11.8519182,3.645 C13.7811691,3.645 15.3506394,5.25990236 15.3506394,7.245 L15.3506394,19.44 C15.3506394,21.4250976 13.7811691,23.04 11.8519182,23.04 Z M3.49872123,5.445 C2.53418116,5.445 1.74936061,6.25253904 1.74936061,7.245 L1.74936061,19.44 C1.74936061,20.432461 2.53418116,21.24 3.49872123,21.24 L11.8519182,21.24 C12.8164582,21.24 13.6012788,20.432461 13.6012788,19.44 L13.6012788,7.245 C13.6012788,6.25253904 12.8164582,5.445 11.8519182,5.445 L3.49872123,5.445 Z M18.8493606,17.19 L18.8493606,3.6 C18.8493606,1.61490236 17.2798903,0 15.3506394,0 L5.64168798,0 C5.15856378,0 4.76700767,0.402890625 4.76700767,0.9 C4.76700767,1.39710937 5.15856378,1.8 5.64168798,1.8 L15.3506394,1.8 C16.3151794,1.8 17.1,2.60753904 17.1,3.6 L17.1,17.19 C17.1,17.6871094 17.4915561,18.09 17.9746803,18.09 C18.4578045,18.09 18.8493606,17.6871094 18.8493606,17.19 Z" id="Shape"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 15} style={style} />;
}
