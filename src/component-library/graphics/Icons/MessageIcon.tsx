import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
  focused: boolean;
  fade: boolean;
}

export default function MessageIcon(props: Props) {
  const { style, size, focused, fade } = props;

  function buildXml(): string {
    return `
    <svg width="173px" height="167px" viewBox="0 0 173 167" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>Combined-Shape</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="100%" y1="3.38204058%" x2="0%" y2="96.6179594%" id="linearGradient-1">
        <stop stop-color=${
          focused
            ? Globals.color.brand.accent1
            : fade
            ? Globals.color.text.light
            : Globals.color.text.grey
        } offset="0%"></stop>
        <stop stop-color=${
          focused
            ? Globals.color.brand.accent3
            : fade
            ? Globals.color.text.light
            : Globals.color.text.grey
        } offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="messageIcon2-2" fill="url(#linearGradient-1)" fill-rule="nonzero">
            <path d="M86.9396637,2.13162821e-13 C103.155166,2.13162821e-13 119.941715,1.36729335 137.299311,4.10188006 C154.675174,6.83934457 168.22353,20.6069017 170.681789,38.0244586 L170.681789,38.0244586 L170.91939,39.7534344 C172.306463,50.1272896 173,60.5011448 173,70.875 C173,81.1168068 172.324007,91.0767399 170.972021,100.754799 C168.560954,118.014185 155.253114,131.726327 138.073593,134.652706 L138.073593,134.652706 L136.247381,134.95823 C119.811475,137.657952 103.375569,139.007813 86.9396637,139.007813 C81.4883664,139.007813 74.5849812,139.005208 66.2295082,139 C47.2872646,158.460193 35.3774286,167.793526 30.5,167 C25.6225714,166.206474 24.3001671,155.206474 26.5327869,134 L26.5327869,134 L22.9856751,132.099711 C11.6757492,126.040661 3.95888614,114.923883 2.23682791,102.209284 C0.745609302,91.1990629 0,79.962635 0,68.5 C0,57.1298756 1.62229085,45.4311494 4.86687256,33.4038212 C8.9093486,18.4187815 21.2554513,7.12491021 36.5403869,4.4297715 L36.5403869,4.4297715 L38.2731599,4.12953665 C54.4474197,1.37651222 70.6695876,2.13162821e-13 86.9396637,2.13162821e-13 Z M50,61 C43.9248678,61 39,65.9248678 39,72 C39,78.0751322 43.9248678,83 50,83 C56.0751322,83 61,78.0751322 61,72 C61,65.9248678 56.0751322,61 50,61 Z M87,61 C80.9248678,61 76,65.9248678 76,72 C76,78.0751322 80.9248678,83 87,83 C93.0751322,83 98,78.0751322 98,72 C98,65.9248678 93.0751322,61 87,61 Z M124,61 C117.924868,61 113,65.9248678 113,72 C113,78.0751322 117.924868,83 124,83 C130.075132,83 135,78.0751322 135,72 C135,65.9248678 130.075132,61 124,61 Z" id="Combined-Shape"></path>
        </g>
    </g>
</svg>`;
  }

  return (
    <SvgXml
      xml={buildXml()}
      width={size ? size : 24}
      height={size ? size : 24}
      style={style}
    />
  );
}
