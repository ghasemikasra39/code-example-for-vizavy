import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { View } from 'react-native';
import Globals from '../../Globals';


interface Props {
  style?: any;
  color?: string;
}

export default function PlayAudioIcon(props: Props) {
  const { style, color } = props;
  function buildXml(): string {
    return `
    <svg width="25px" height="36px" viewBox="0 0 25 36" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>playAudioIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-60.000000, -379.000000)" fill=${
          color ? color : Globals.color.text.grey
        } fill-rule="nonzero">
            <g id="playAudioIcon" transform="translate(72.714286, 397.000000) rotate(-90.000000) translate(-72.714286, -397.000000) translate(55.000000, 385.000000)">
                <path d="M1.75453321,2.38811465 L16.4238303,22.354658 C16.9143225,23.0222723 17.8531534,23.1658582 18.5207677,22.675366 C18.6433078,22.5853366 18.7514463,22.477198 18.8414758,22.354658 L33.5107729,2.38811465 C34.0012651,1.7205003 33.8576792,0.781669458 33.1900648,0.291177281 C32.932591,0.102012796 32.6214435,7.26878199e-15 32.3019502,0 L2.96335593,0 C2.13492881,1.52179594e-16 1.46335593,0.671572875 1.46335593,1.5 C1.46335593,1.81949335 1.56536873,2.13064077 1.75453321,2.38811465 Z" id="Path"></path>
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
