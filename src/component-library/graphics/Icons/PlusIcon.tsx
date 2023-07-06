import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function PlusIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>plusIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-307.000000, -62.000000)" fill=${
          color ? color : Globals.color.text.light
        } fill-rule="nonzero" stroke=${
      color ? color : Globals.color.text.light
    } stroke-width="0.55">
            <g id="plusIcon" transform="translate(308.000000, 63.000000)">
                <path d="M9.42857143,1.75291751 C9.42857143,0.784807899 10.2728345,3.9587381e-14 11.3142857,3.9587381e-14 C12.355737,3.9587381e-14 13.2,0.784807899 13.2,1.75291751 L13.2,20.8756539 C13.2,21.8437635 12.355737,22.6285714 11.3142857,22.6285714 C10.2728345,22.6285714 9.42857143,21.8437635 9.42857143,20.8756539 L9.42857143,1.75291751 Z" id="Path"></path>
                <path d="M20.8756539,9.42857143 C21.8437635,9.42857143 22.6285714,10.2728345 22.6285714,11.3142857 C22.6285714,12.355737 21.8437635,13.2 20.8756539,13.2 L1.75291751,13.2 C0.784807899,13.2 3.9587381e-14,12.355737 3.9587381e-14,11.3142857 C3.9587381e-14,10.2728345 0.784807899,9.42857143 1.75291751,9.42857143 L20.8756539,9.42857143 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 15} style={style} />;
}
