import React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
  color?: string;
}

export default function TimerIcon(props: Props) {
  const { style, width, height, color } = props;
  function buildXml() {
    return `
    <svg width="22px" height="22px" viewBox="0 0 22 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Timer-Icon</title>
    <g id="Feature_Rooms" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-roomExtensionButton" transform="translate(-306.000000, -40.000000)" fill="#FAFAFA" fill-rule="nonzero">
            <g id="Timer-Icon" transform="translate(306.000000, 40.000000)">
                <polygon id="Path" points="6.29665 1.632 4.926 0 0.02465 4.112 1.39535 5.744"></polygon>
                <polygon id="Path" points="21.358 4.11735 16.45665 0.00535 15.086 1.63735 19.98735 5.74935"></polygon>
                <path d="M10.686,2.28265 C5.37935,2.28265 1.09135,6.5813 1.09135,11.88265 C1.09135,17.184 5.37935,21.48265 10.686,21.48265 C15.99265,21.48265 20.29135,17.184 20.29135,11.88265 C20.29135,6.5813 15.99265,2.28265 10.686,2.28265 Z M10.69135,19.34935 C6.5687,19.34935 3.2247,16.00535 3.2247,11.8827 C3.2247,7.76005 6.56865,4.416 10.69135,4.416 C14.81405,4.416 18.158,7.76 18.158,11.88265 C18.158,16.0053 14.81935,19.34935 10.69135,19.34935 Z" id="Shape"></path>
                <polygon id="Path" points="11.22465 6.54935 9.62465 6.54935 9.62465 12.94935 14.686 15.99465 15.49135 14.67735 11.22465 12.14935"></polygon>
            </g>
        </g>
    </g>
</svg>
    `;
  }

  return (
    <SvgXml
      style={style}
      xml={buildXml()}
      width={width || 20}
      height={height || 20}
    />
  );
}
