import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function SearchIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="24px" height="26px" viewBox="0 0 24 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>searchIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-21.000000, -26.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero" stroke=${
      color ? color : Globals.color.text.grey
    } stroke-width="0.5">
            <g id="searchIcon" transform="translate(22.000000, 27.000000)">
                <path d="M9.76410256,0 C15.1566675,0 19.5282051,4.37153762 19.5282051,9.76410256 C19.5282051,12.4644472 18.4320252,14.9087654 16.6603749,16.6763473 L21.3892672,21.4060716 C21.9369116,21.9537159 21.9369116,22.8416229 21.3892672,23.3892672 C20.8416229,23.9369116 19.9537159,23.9369116 19.4060716,23.3892672 L14.4979128,18.4811084 C14.4600502,18.4432458 14.4248053,18.4037568 14.3921781,18.3628662 C13.0152986,19.1065166 11.4389459,19.5282051 9.76410256,19.5282051 C4.37153762,19.5282051 0,15.1566675 0,9.76410256 C0,4.37153762 4.37153762,0 9.76410256,0 Z M9.76410256,2.44102564 C5.71967886,2.44102564 2.44102564,5.71967886 2.44102564,9.76410256 C2.44102564,13.8085263 5.71967886,17.0871795 9.76410256,17.0871795 C13.8085263,17.0871795 17.0871795,13.8085263 17.0871795,9.76410256 C17.0871795,5.71967886 13.8085263,2.44102564 9.76410256,2.44102564 Z" id="Combined-Shape"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 20} style={style} />;
}
