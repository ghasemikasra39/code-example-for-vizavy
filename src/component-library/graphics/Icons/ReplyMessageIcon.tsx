import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function ReplyMessageIcon(props: Props) {
  const { color, style, size } = props;

  function buildXml(): string {
    return `
    <svg width="33px" height="25px" viewBox="0 0 33 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>replyIcon</title>
    <g id="Icons/-Popups" stroke="none" stroke-width="2" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-29.000000, -567.000000)" fill=${'transparent'} fill-rule="nonzero">
            <g id="replyIcon" transform="translate(30.000000, 568.000000)">
                <path d="M14.39952,5.81988 L11.51952,5.81988 L11.51952,1.01988 C11.51952,0.62244 11.27568,0.26724 10.90704,0.12324 C10.5384,-0.01884 10.11792,0.081 9.84912,0.37476 L0.24912,10.93476 C-0.08304,11.29956 -0.08304,11.85828 0.24912,12.225 L9.84912,22.785 C10.03536,22.98852 10.29456,23.1000908 10.55952,23.1000908 C10.67664,23.1000908 10.79376,23.07876 10.90704,23.03652 C11.27568,22.89252 11.51952,22.53732 11.51952,22.13988 L11.51952,17.33988 L14.19024,17.33988 C19.66992,17.33988 24.9768,19.30212 29.13552,22.86948 C29.41776,23.11332 29.82288,23.169 30.1608,23.01156 C30.50256,22.85604 30.71952,22.51428 30.71952,22.13988 C30.71952,13.14084 23.39856,5.81988 14.39952,5.81988 Z" id="Path" stroke=${color ? color : Globals.color.text.grey}></path>
                <path d="M14.19024,15.41988 L10.55952,15.41988 C10.0296,15.41988 9.59952,15.84996 9.59952,16.37988 L9.59952,19.65732 L2.25744,11.57988 L9.59952,3.50244 L9.59952,6.77988 C9.59952,7.3098 10.0296,7.73988 10.55952,7.73988 L14.39952,7.73988 C18.24528,7.73988 21.86256,9.23748 24.58128,11.9562 C26.80272,14.17764 28.21008,16.99812 28.64976,20.05092 C24.44496,17.05188 19.3896,15.41988 14.19024,15.41988 Z" id="Path"></path>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 15} style={style} />;
}
