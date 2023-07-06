import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function EditProfileIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="416px" height="446px" viewBox="0 0 416 446" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>user-2</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="user-2" fill="${
          color ? color : Globals.color.text.grey
        }" fill-rule="nonzero">
            <polygon id="Path" points="207.997 445.327 255 434.48 218.843 398.324"></polygon>
            <path d="M198.722,414.363 L206.499,380.663 C206.518,380.58 206.546,380.502 206.568,380.421 C206.605,380.282 206.642,380.143 206.686,380.006 C206.73,379.869 206.774,379.754 206.821,379.63 C206.868,379.506 206.909,379.396 206.959,379.281 C207.018,379.144 207.083,379.011 207.149,378.881 C207.198,378.781 207.249,378.686 207.3,378.591 C207.377,378.451 207.459,378.317 207.543,378.183 C207.597,378.098 207.651,378.014 207.708,377.931 C207.8,377.797 207.897,377.668 207.997,377.541 C208.058,377.462 208.119,377.384 208.183,377.308 C208.283,377.185 208.396,377.067 208.506,376.951 C208.551,376.904 208.591,376.851 208.637,376.807 L313.442,272 C284.184,211.819 230.08,176 168,176 C122.478,176 80.422,195.485 49.579,230.865 C18.517,266.498 1.014,316.165 0.043,371.156 C18.407,380.417 93.812,416 168,416 C178.262021,415.983632 188.516347,415.437237 198.722,414.363 L198.722,414.363 Z" id="Path"></path>
            <polygon id="Path" transform="translate(310.382068, 342.862214) rotate(-45.000000) translate(-310.382068, -342.862214) " points="222.395357 310.867046 398.368779 310.867046 398.368779 374.857382 222.395357 374.857382"></polygon>
            <circle id="Oval" cx="168" cy="80" r="80"></circle>
            <path d="M416.000131,269.324 C415.998449,256.382013 408.201459,244.715146 396.244371,239.763068 C384.287284,234.81099 370.524535,237.548802 361.373,246.7 L406.627,291.954 C412.649124,285.965772 416.024386,277.816601 416.000131,269.324 Z" id="Path"></path>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 22} style={style} />;
}
