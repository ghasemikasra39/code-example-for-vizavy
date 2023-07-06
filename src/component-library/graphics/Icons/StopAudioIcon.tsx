import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { View } from 'react-native';
import Globals from '../../Globals';


interface Props {
  style?: any;
  color?: string;
}

export default function StopAudioIcon(props: Props) {
  const { style, color } = props;
  function buildXml(): string {
    return `
    <svg width="22px" height="24px" viewBox="0 0 22 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>stopAudioIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-101.000000, -382.000000)" fill=${
          color ? color : Globals.color.text.grey
        }>
            <g id="stopAudioIcon" transform="translate(101.000000, 382.000000)">
                <rect id="Rectangle" x="0" y="0" width="9" height="24" rx="2"></rect>
                <rect id="Rectangle-Copy-7" x="13" y="0" width="9" height="24" rx="2"></rect>
            </g>
        </g>
    </g>
</svg>
   `;
  }

  return (
    <View style={[style]}>
      <SvgXml xml={buildXml()} width={18} />
    </View>
  );
}
