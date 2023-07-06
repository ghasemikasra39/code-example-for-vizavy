import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function PaperPlaneIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="25px" height="19px" viewBox="0 0 25 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>paperplaneIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-174.000000, -78.000000)" fill=${
          color ? color : Globals.color.text.light
        } fill-rule="nonzero">
            <g id="paperplaneIcon" transform="translate(174.000000, 78.000000)">
                <path d="M24.3617774,0.0120340011 L0.383361434,8.67853731 C-0.0615258955,8.840339 -0.137358963,9.43698275 0.25191745,9.69991051 L3.83629378,12.1471612 L9.05683478,9.39371214 L20.1050145,3.566615 L6.33372947,13.8511353 L6.33372947,18.0175289 C6.33372947,18.3006819 6.65222835,18.4725962 6.88983863,18.3158508 L9.92316134,16.3034422 L12.9109842,18.3411323 C13.1839832,18.5282155 13.558093,18.4473147 13.7350369,18.1641617 L24.5791655,0.280018059 C24.5420916,0.0609115966 24.4696289,-0.0284164227 24.3617774,0.0120340011 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 25} style={style} />;
}
