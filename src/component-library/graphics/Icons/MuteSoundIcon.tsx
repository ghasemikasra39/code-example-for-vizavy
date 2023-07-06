import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function MuteSoundIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="25px" height="24px" viewBox="0 0 25 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>soundIcon Copy</title>
    <g id="Icons/-Popups" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-212.000000, -168.000000)" fill-rule="nonzero">
            <g id="soundIcon-Copy" transform="translate(212.000000, 168.000000)">
                <path d="M14.8111858,0.136831858 C14.5155398,-0.00419469027 14.1672212,0.0331858407 13.912354,0.238778761 L5.64785841,6.8500354 L1.69911504,6.8500354 C0.762902655,6.8500354 0,7.61293805 0,8.54915044 L0,15.3456106 C0,16.2835221 0.762902655,17.0447257 1.69911504,17.0447257 L5.64785841,17.0447257 L13.9106549,23.6559823 C14.0652743,23.7783186 14.2538761,23.8411858 14.4424779,23.8411858 C14.5682124,23.8411858 14.6939469,23.8123009 14.8111858,23.7562301 C15.1051327,23.6152035 15.2920354,23.3178584 15.2920354,22.9916283 L15.2920354,0.903132743 C15.2920354,0.576902655 15.1051327,0.279557522 14.8111858,0.136831858 Z" id="Path" fill=${
                  color ? color : Globals.color.background.light
                }></path>
                <path d="M18.5924956,5.93930973 C18.2577699,5.60968142 17.7208496,5.61477876 17.3912212,5.94610619 C17.0615929,6.28083186 17.0649912,6.81775221 17.3980177,7.14907965 C18.6825487,8.41661947 19.3893805,10.1208319 19.3893805,11.9473805 C19.3893805,13.7739292 18.6825487,15.4781416 17.3980177,16.7456814 C17.0649912,17.0736106 17.0615929,17.6122301 17.3912212,17.9469558 C17.5577345,18.1151681 17.7769204,18.1984248 17.9944071,18.1984248 C18.2101947,18.1984248 18.4259823,18.1168673 18.5924956,17.9520531 C20.2032566,16.3667788 21.0884956,14.2326903 21.0884956,11.9473805 C21.0884956,9.6620708 20.2032566,7.5279823 18.5924956,5.93930973 Z" id="Path" fill=${
                  color ? color : Globals.color.text.grey
                }></path>
                <path d="M20.9899469,3.54525664 C20.6552212,3.2139292 20.1183009,3.21732743 19.7869735,3.55035398 C19.4573451,3.88338053 19.4607434,4.422 19.7920708,4.75162832 C21.7239646,6.66653097 22.7876106,9.222 22.7876106,11.9473805 C22.7876106,14.6727611 21.7239646,17.226531 19.7920708,19.1414336 C19.4607434,19.4727611 19.4573451,20.0113805 19.7869735,20.3444071 C19.9551858,20.5109204 20.1726726,20.594177 20.3901593,20.594177 C20.6059469,20.594177 20.8234336,20.5126195 20.9899469,20.3478053 C23.2463717,18.113469 24.4867257,15.129823 24.4867257,11.9473805 C24.4867257,8.76493805 23.2463717,5.78129204 20.9899469,3.54525664 Z" id="Path" fill=${
                  color ? color : Globals.color.text.grey
                }></path>
                <path d="M4.59792398,6.51937438 L19.3848914,21.3065847 L20.8303158,22.751581 C21.0951317,23.0171681 21.4431666,23.15 21.7908953,23.15 C22.1385474,23.15 22.4865823,23.0171681 22.7518575,22.751581 C23.2827142,22.2210957 23.2827142,21.360483 22.7518575,20.829615 L19.5213186,17.5990063 L8.24011791,6.31756183 L3.32000955,1.39841902 C3.05504059,1.13283186 2.70715878,1 2.35927697,1 C2.01139516,1 1.66374303,1.13283186 1.39831472,1.39841902 C0.867228427,1.92882775 0.867228427,2.78951696 1.39831472,3.32015537 L4.59792398,6.51937438 Z" id="Path" stroke="#9A9A9A" fill="#FFFFFF" transform="translate(12.075000, 12.075000) rotate(1.000000) translate(-12.075000, -12.075000) "></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 23} style={style} />;
}
