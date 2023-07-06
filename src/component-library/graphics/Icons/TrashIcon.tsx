import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function TrashIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>trashIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-24.000000, -208.000000)" fill=${
          color ? color : Globals.color.text.light
        } fill-rule="nonzero">
            <g id="trashIcon" transform="translate(24.000000, 208.000000)">
                <g id="trash-simple">
                    <path d="M21,8 L21,21 C21,22.6568542 19.6568542,24 18,24 L18,24 L6,24 C4.34314575,24 3,22.6568542 3,21 L3,21 L3,8 L21,8 Z M16,12 C15.4477153,12 15,12.4477153 15,13 L15,13 L15,18 C15,18.5522847 15.4477153,19 16,19 C16.5522847,19 17,18.5522847 17,18 L17,18 L17,13 C17,12.4477153 16.5522847,12 16,12 Z M12,12 C11.4477153,12 11,12.4477153 11,13 L11,13 L11,18 C11,18.5522847 11.4477153,19 12,19 C12.5522847,19 13,18.5522847 13,18 L13,18 L13,13 C13,12.4477153 12.5522847,12 12,12 Z M8,12 C7.44771525,12 7,12.4477153 7,13 L7,13 L7,18 C7,18.5522847 7.44771525,19 8,19 C8.55228475,19 9,18.5522847 9,18 L9,18 L9,13 C9,12.4477153 8.55228475,12 8,12 Z M16,0 C16.5522847,0 17,0.44771525 17,1 L17,1 L17,4 L23,4 C23.5522847,4 24,4.44771525 24,5 C24,5.55228475 23.5522847,6 23,6 L23,6 L1,6 C0.44771525,6 0,5.55228475 0,5 C0,4.44771525 0.44771525,4 1,4 L1,4 L7,4 L7,1 C7,0.44771525 7.44771525,0 8,0 L8,0 Z M15,2 L9,2 L9,4 L15,4 L15,2 Z" id="Combined-Shape"></path>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 20} style={style} />;
}
