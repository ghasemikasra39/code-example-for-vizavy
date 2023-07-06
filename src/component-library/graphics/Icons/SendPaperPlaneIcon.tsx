import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function SendPaperPlaneIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="469px" height="474px" viewBox="0 0 469 474" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>Shape</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-194.000000, -46.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <path d="M565.192,55.992 L413.572,519.992 C409.286,533.089 391.488,535 384.532,523.062 L286.875891,358.848666 C283.655891,353.318666 280.329097,344.379058 284.139097,339.239058 L413.572,196.063775 L265.499279,316.359463 C260.359279,320.169463 250.737082,317.45056 245.207082,314.23056 L77.942,216.471 C66.046,209.552 67.876,191.73 81.012,187.431 L545.012,35.811 C557.414,31.764 569.257,43.538 565.192,55.992 Z" id="Shape" transform="translate(318.003406, 283.003646) rotate(45.000000) translate(-318.003406, -283.003646) "></path>
        </g>
    </g>
</svg>`;
  }

  return (
    <SvgXml
      xml={buildXml()}
      width={size ? size : 17}
      height={size ? size : 17}
      style={style}
    />
  );
}
