import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function CloseIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>closeIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-175.000000, -63.000000)" fill=${
          color ? color : Globals.color.text.light
        } fill-rule="nonzero">
            <g id="closeIcon" transform="translate(175.000000, 63.000000)">
                <path d="M23.2981617,0.701838303 C22.3620946,-0.233946101 20.8447299,-0.233946101 19.9086628,0.701838303 L12.0150137,8.59548742 L4.12136456,0.701838303 C3.18079327,-0.206595844 1.68570811,-0.193603958 0.761065755,0.731038392 C-0.163576595,1.65568074 -0.176568481,3.15076591 0.731865667,4.0913372 L8.62551479,11.9849863 L0.731865667,19.8786354 C0.108723832,20.480486 -0.141188219,21.3717358 0.0781834106,22.2098324 C0.297555041,23.047929 0.952071017,23.702445 1.7901676,23.9218166 C2.62826419,24.1411882 3.51951404,23.8912762 4.12136456,23.2681343 L12.0150137,15.3744852 L19.9086628,23.2681343 C20.8492341,24.1765685 22.3443193,24.1635766 23.2689616,23.2389342 C24.193604,22.3142919 24.2065958,20.8192067 23.2981617,19.8786354 L15.4045126,11.9849863 L23.2981617,4.0913372 C24.2339461,3.15527014 24.2339461,1.63790536 23.2981617,0.701838303 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 15} style={style} />;
}
