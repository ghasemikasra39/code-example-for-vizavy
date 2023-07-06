import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import Globals from '../../Globals';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function MicrophoneIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="15px" height="24px" viewBox="0 0 15 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>microphoneIcon</title>
    <g id="Icons" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iconography" transform="translate(-29.000000, -382.000000)" fill=${
          color ? color : Globals.color.button.blue
        } fill-rule="nonzero">
            <g id="microphoneIcon" transform="translate(29.000000, 382.000000)">
                <path d="M12.086172,4.919292 L12.086172,12.0049776 C12.0798216,14.712516 9.8757792,16.9129296 7.16688,16.9129296 C4.4579808,16.9129296 2.2539384,14.712516 2.247588,12.0049776 L2.247588,4.919292 C2.247588,2.206764 4.454352,0 7.16688,0 C9.879408,0 12.086172,2.206764 12.086172,4.919292 Z" id="Path"></path>
                <path d="M7.16688,16.9129296 L7.16688,0 C9.879408,0 12.086172,2.206764 12.086172,4.919292 L12.086172,12.0049776 C12.0798216,14.712516 9.8757792,16.9129296 7.16688,16.9129296 Z" id="Path"></path>
                <rect id="Rectangle" x="6.48648" y="18.1231344" width="1.3608" height="4.4207856"></rect>
                <path d="M14.3323992,12.1569336 C14.3206056,14.0616 13.5698976,15.8505984 12.2190768,17.193708 C10.8673488,18.5377248 9.0733608,19.278 7.16688,19.278 C5.2603992,19.278 3.4664112,18.5377248 2.1146832,17.193708 C0.7638624,15.8505984 0.0131544,14.0616 0.0013608,12.1569336 L1.3621608,12.1483152 C1.3821192,15.329412 3.9862368,17.9172 7.16688,17.9172 C10.3479768,17.9172 12.9516408,15.329412 12.9715992,12.1483152 L14.3323992,12.1569336 Z" id="Path"></path>
                <rect id="Rectangle" x="7.16688" y="18.1231344" width="1" height="4.4207856"></rect>
                <path d="M14.3323992,12.1569336 C14.3206056,14.0616 13.5698976,15.8505984 12.2190768,17.193708 C10.8673488,18.5377248 9.0733608,19.278 7.16688,19.278 L7.16688,17.9172 C10.3479768,17.9172 12.9516408,15.329412 12.9715992,12.1483152 L14.3323992,12.1569336 Z" id="Path"></path>
                <rect id="Rectangle" x="4.0343184" y="21.86352" width="6.2651232" height="1.3608"></rect>
                <rect id="Rectangle" x="7.16688" y="21.86352" width="3.1325616" height="1.3608"></rect>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 17} style={style} />;
}
