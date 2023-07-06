import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function ReportIcon(props: Props) {
  const { color, style, size } = props;

  function buildXml(): string {
    return `
    <svg width="22px" height="26px" viewBox="0 0 22 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>reportIcon</title>
    <g id="Icons/-Popups" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-139.000000, -167.000000)">
            <g id="reportIcon" transform="translate(140.000000, 168.000000)">
                <line x1="0.6" y1="0.6" x2="0.6" y2="23.4" id="Line-6" stroke=${
                  color ? color : Globals.color.text.grey
                } stroke-width="2" stroke-linecap="round"></line>
                <path d="M2.67214241,2.25756733 C6.24908308,0.426559144 9.59518535,0.338636312 12.7104492,1.99379883 C15.5219197,3.48755368 17.8445591,3.771412 19.6783675,2.8453738 C19.9247053,2.72518003 20.2231815,2.82335498 20.3467235,3.06800196 C20.3817513,3.1373665 20.4,3.21398758 20.4,3.29169463 L20.4,11.8591228 C20.3999906,12.0741595 20.2624977,12.2651115 20.0585605,12.3333054 C17.3609586,13.2353484 14.4747718,13.0566685 11.4,11.7972656 C8.4913498,10.6059049 5.75145753,10.8809204 3.1803232,12.622312 C2.95167904,12.7770934 2.64083756,12.7172866 2.48600409,12.4886777 C2.42995703,12.4059252 2.4,12.3082731 2.4,12.2083269 L2.4,2.70269537 C2.39994195,2.51499184 2.5050576,2.34309675 2.67214241,2.25756733 Z" id="Rectangle" fill="#9A9A9A"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return (
    <SvgXml
      xml={buildXml()}
      width={size ? size : 20}
      height={size ? size : 20}
      style={style}
    />
  );
}
