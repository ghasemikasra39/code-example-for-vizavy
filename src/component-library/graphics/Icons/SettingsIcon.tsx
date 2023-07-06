import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function SettingsIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="512px" height="512px" viewBox="0 0 512 512" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>settings</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="settings" fill="${
          color ? color : Globals.color.text.grey
        }" fill-rule="nonzero">
            <path d="M483.904,200.405333 L443.797333,195.306667 C440.490667,185.130667 436.416,175.317333 431.658667,165.994667 L456.426667,134.101333 C466.453333,121.194667 465.28,102.976 453.824,91.8826667 L420.224,58.2826667 C409.024,46.72 390.805333,45.568 377.877333,55.5733333 L346.026667,80.3413333 C336.704,75.584 326.890667,71.5093333 316.693333,68.2026667 L311.594667,28.16 C309.674667,12.096 296.042667,-2.84217094e-14 279.893333,-2.84217094e-14 L232.106667,-2.84217094e-14 C215.957333,-2.84217094e-14 202.325333,12.096 200.405333,28.096 L195.306667,68.2026667 C185.109333,71.5093333 175.296,75.5626667 165.973333,80.3413333 L134.101333,55.5733333 C121.216,45.568 102.997333,46.72 91.8826667,58.176 L58.2826667,91.7546667 C46.72,102.976 45.5466667,121.194667 55.5733333,134.122667 L80.3413333,165.994667 C75.5626667,175.317333 71.5093333,185.130667 68.2026667,195.306667 L28.16,200.405333 C12.096,202.325333 6.6317322e-14,215.957333 6.6317322e-14,232.106667 L6.6317322e-14,279.893333 C6.6317322e-14,296.042667 12.096,309.674667 28.096,311.594667 L68.2026667,316.693333 C71.5093333,326.869333 75.584,336.682667 80.3413333,346.005333 L55.5733333,377.898667 C45.5466667,390.805333 46.72,409.024 58.176,420.117333 L91.776,453.717333 C102.997333,465.258667 121.194667,466.410667 134.122667,456.405333 L165.994667,431.637333 C175.317333,436.416 185.130667,440.490667 195.306667,443.776 L200.405333,483.797333 C202.325333,499.904 215.957333,512 232.106667,512 L279.893333,512 C296.042667,512 309.674667,499.904 311.594667,483.904 L316.693333,443.797333 C326.869333,440.490667 336.682667,436.416 346.005333,431.658667 L377.898667,456.426667 C390.805333,466.453333 409.024,465.28 420.117333,453.824 L453.717333,420.224 C465.28,409.002667 466.453333,390.805333 456.426667,377.877333 L431.658667,346.005333 C436.437333,336.682667 440.512,326.869333 443.797333,316.693333 L483.818667,311.594667 C499.882667,309.674667 511.978695,296.042667 511.978695,279.893333 L511.978695,232.106667 C512,215.957333 499.904,202.325333 483.904,200.405333 Z M256,362.666667 C197.184,362.666667 149.333333,314.816 149.333333,256 C149.333333,197.184 197.184,149.333333 256,149.333333 C314.816,149.333333 362.666667,197.184 362.666667,256 C362.666667,314.816 314.816,362.666667 256,362.666667 Z" id="Shape"></path>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 20} style={style} />;
}