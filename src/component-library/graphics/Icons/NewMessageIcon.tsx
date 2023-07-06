import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function NewMessageIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="20px" height="19px" viewBox="0 0 20 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>Icons/24px/Message</title>
    <desc>Created with Sketch.</desc>
    <g id="Youpendo-Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-Room_Tab-" transform="translate(-260.000000, -726.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <g id="Icons/24px/Message" transform="translate(260.000000, 726.000000)">
                <path d="M10,1.66444636e-12 C15.5,1.66444636e-12 20,3.75 20,8.33333333 C20,10.1666667 19.25,12 17.9166667,13.5 L17.9166667,13.5 L18.3333333,17.4166667 C18.3333333,17.6666667 18.25,18 18,18.1666667 C17.8333333,18.25 17.6666667,18.3333333 17.5,18.3333333 C17.3333333,18.3333333 17.25,18.25 17.1666667,18.25 L17.1666667,18.25 L12.5,16.4166667 C11.6666667,16.5833333 10.8333333,16.6666667 10,16.6666667 C4.5,16.6666667 0,12.9166667 0,8.33333333 C0,3.75 4.5,1.66444636e-12 10,1.66444636e-12 Z M12.25,9 L4.75,9 C4.33578644,9 4,9.33578644 4,9.75 C4,10.1642136 4.33578644,10.5 4.75,10.5 L4.75,10.5 L12.25,10.5 C12.6642136,10.5 13,10.1642136 13,9.75 C13,9.33578644 12.6642136,9 12.25,9 L12.25,9 Z M14.25,5 L4.75,5 C4.33578644,5 4,5.33578644 4,5.75 C4,6.16421356 4.33578644,6.5 4.75,6.5 L4.75,6.5 L14.25,6.5 C14.6642136,6.5 15,6.16421356 15,5.75 C15,5.33578644 14.6642136,5 14.25,5 L14.25,5 Z" id="Combined-Shape"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 18} style={style} />;
}
