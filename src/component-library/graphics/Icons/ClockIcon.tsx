import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

interface Props {
  colors: Array<string>;
  style?: any;
}

export default function ClockIcon(props: Props) {
  const { colors, style } = props;
  function buildXml(): string {
    return `
    <svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>timerIcon</title>
    <defs>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-2">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-3">
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="0%"></stop>
            <stop stop-color=${
              colors ? colors[0] : Globals.color.text.grey
            } offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-175.000000, -111.000000)" fill-rule="nonzero">
            <g id="timerIcon" transform="translate(175.000000, 111.000000)">
                <path d="M6.12144545,0.890181818 C5.70847801,0.398471415 4.97516885,0.33444787 4.48323889,0.747153754 L0.917483639,3.73865315 C0.425893198,4.1510742 0.361713722,4.88392031 0.774134768,5.37551075 C0.774271619,5.37567387 0.774408514,5.37583695 0.774545455,5.376 C1.18752953,5.86771227 1.92085181,5.93172846 2.41278898,5.51901232 L5.97849719,2.52752186 C6.47008944,2.11509509 6.53426574,1.38224287 6.12183897,0.890650617 C6.12170784,0.890494316 6.12157667,0.89033805 6.12144545,0.890181818 Z" id="Path" fill="url(#linearGradient-1)"></path>
                <path d="M22.4090571,3.74450079 L18.8432884,0.752990117 C18.3513584,0.340284234 17.6180493,0.404307778 17.2050818,0.896018182 C16.7923982,1.38739064 16.8561881,2.12027288 17.3475606,2.53295649 C17.3477183,2.53308895 17.347876,2.53322137 17.3480338,2.53335375 L20.9138025,5.52486443 C21.4057325,5.93757031 22.1390416,5.87354677 22.5520091,5.38183636 C22.9646927,4.89046391 22.9009028,4.15758167 22.4095303,3.74489805 C22.4093726,3.74476559 22.4092149,3.74463317 22.4090571,3.74450079 Z" id="Path" fill="url(#linearGradient-1)"></path>
                <path d="M11.6574545,2.49016364 C5.86838182,2.49016364 1.19056364,7.1796 1.19056364,12.9628909 C1.19056364,18.7461818 5.86838182,23.4356182 11.6574545,23.4356182 C17.4465273,23.4356182 22.1360182,18.7461818 22.1360182,12.9628909 C22.1360182,7.1796 17.4465273,2.49016364 11.6574545,2.49016364 Z" id="Path" fill="url(#linearGradient-2)"></path>
                <path d="M11.6632909,21.1083818 C7.16585455,21.1083818 3.51785455,17.4603818 3.51785455,12.9629455 C3.51785455,8.46550909 7.1658,4.81745455 11.6632909,4.81745455 C16.1607818,4.81745455 19.8087273,8.46545455 19.8087273,12.9628909 C19.8087273,17.4603273 16.1665636,21.1083818 11.6632909,21.1083818 Z" id="Path" fill="url(#linearGradient-3)"></path>
                <path d="M11.3723455,7.14474545 C10.8903515,7.14474545 10.4996182,7.53547876 10.4996182,8.01747273 L10.4996182,14.1265636 L10.4996182,14.1265636 L15.2994708,17.0145266 C15.6988346,17.2548147 16.2172625,17.1278339 16.4603727,16.7301818 C16.6996442,16.3388088 16.5763415,15.8275704 16.1849684,15.5882989 C16.1816967,15.5862987 16.1784112,15.5843212 16.1751121,15.5823665 L12.2450727,13.2538364 L12.2450727,13.2538364 L12.2450727,8.01747273 C12.2450727,7.53547876 11.8543394,7.14474545 11.3723455,7.14474545 Z" id="Path" stroke="#FFFFFF" stroke-width="0.5" fill="#FFFFFF"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return (
    <View style={[style, styles.container]}>
      <SvgXml xml={buildXml()} width={30} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
