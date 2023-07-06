import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { View } from 'react-native';


interface Props {
  style?: any;
}

export default function NoNotificationsIcon(props: Props) {
  const { style } = props;
  function buildXml(): string {
    return `
    <svg width="401px" height="411px" viewBox="0 0 401 411" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>notifications</title>
    <desc>Created with Sketch.</desc>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Artboard" transform="translate(-80.000000, -74.000000)" fill-rule="nonzero">
            <g id="notifications" transform="translate(80.000000, 74.000000)">
                <path d="M40.917228,361.352773 C47.668668,377.328145 40.0244756,410 40.0244756,410 C40.0244756,410 11.1774136,392.582407 4.42597356,376.551564 C-2.32546647,360.520722 0.352790732,344.21253 10.4520523,339.996806 C20.5513138,335.781083 34.1657879,345.321931 40.917228,361.352773 Z" id="Path" fill="#E6E6E6"></path>
                <circle id="Oval" fill="#F1004E" cx="216.702703" cy="140" r="9"></circle>
                <circle id="Oval" fill="#F1004E" cx="216.702703" cy="79" r="9"></circle>
                <circle id="Oval" fill="#F1004E" cx="216.702703" cy="18" r="9"></circle>
                <path d="M250.472435,0 C248.955129,0.0291957024 247.732173,1.2407463 247.702703,2.74390244 L247.702703,33.2560976 C247.732173,34.7592537 248.955129,35.9708043 250.472435,36 L397.932971,36 C399.450277,35.9708043 400.673232,34.7592537 400.702703,33.2560976 L400.702703,2.74390244 C400.702703,1.22848697 399.462651,0 397.932971,0 L250.472435,0 Z" id="Path" fill="#E6E6E6"></path>
                <path d="M251.312613,2 C250.423484,2 249.702703,2.7188231 249.702703,3.60553633 L249.702703,32.3944637 C249.702703,33.2811769 250.423484,34 251.312613,34 L397.092792,34 C397.981921,34 398.702703,33.2811769 398.702703,32.3944637 L398.702703,3.60553633 C398.702703,2.7188231 397.981921,2 397.092792,2 L251.312613,2 Z" id="Path" fill="#FFFFFF"></path>
                <path d="M388.083696,26 C389.530134,26 390.702703,24.8807119 390.702703,23.5 C390.702703,22.1192881 389.530134,21 388.083696,21 L264.321709,21 C263.386028,21 262.521424,21.4764973 262.053583,22.25 C261.585743,23.0235027 261.585743,23.9764973 262.053583,24.75 C262.521424,25.5235027 263.386028,26 264.321709,26 L388.083696,26 Z" id="Path" fill="#E6E6E6"></path>
                <path d="M317.106512,15 C317.795065,15 318.455416,14.7393804 318.942296,14.2754747 C319.429176,13.8115689 319.702703,13.1823776 319.702703,12.5263158 C319.702703,11.1513682 318.549239,10.0286447 317.106512,10 L264.298893,10 C262.856166,10.0286447 261.702703,11.1513682 261.702703,12.5263158 C261.702703,13.8924939 262.865057,15 264.298893,15 L317.106512,15 Z" id="Path" fill="#F1004E"></path>
                <path d="M250.472435,61 C248.955129,61.0291957 247.732173,62.2407463 247.702703,63.7439024 L247.702703,94.2560976 C247.732173,95.7592537 248.955129,96.9708043 250.472435,97 L397.932971,97 C399.450277,96.9708043 400.673232,95.7592537 400.702703,94.2560976 L400.702703,63.7439024 C400.702703,62.228487 399.462651,61 397.932971,61 L250.472435,61 Z" id="Path" fill="#E6E6E6"></path>
                <path d="M251.312613,63 C250.423484,63 249.702703,63.7188231 249.702703,64.6055363 L249.702703,93.3944637 C249.702703,94.2811769 250.423484,95 251.312613,95 L397.092792,95 C397.981921,95 398.702703,94.2811769 398.702703,93.3944637 L398.702703,64.6055363 C398.702703,63.7188231 397.981921,63 397.092792,63 L251.312613,63 Z" id="Path" fill="#FFFFFF"></path>
                <path d="M388.083696,87 C389.019377,87 389.883982,86.5235028 390.351822,85.75 C390.819663,84.9764973 390.819663,84.0235027 390.351822,83.25 C389.883982,82.4764972 389.019377,82 388.083696,82 L264.321709,82 C263.386028,82 262.521424,82.4764972 262.053583,83.25 C261.585743,84.0235027 261.585743,84.9764973 262.053583,85.75 C262.521424,86.5235028 263.386028,87 264.321709,87 L388.083696,87 Z" id="Path" fill="#E6E6E6"></path>
                <path d="M317.106512,76 C317.795065,76 318.455416,75.7393804 318.942296,75.2754747 C319.429176,74.8115689 319.702703,74.1823776 319.702703,73.5263158 C319.702703,72.1513682 318.549239,71.0286447 317.106512,71 L264.298893,71 C262.856166,71.0286447 261.702703,72.1513682 261.702703,73.5263158 C261.702703,74.8924939 262.865057,76 264.298893,76 L317.106512,76 Z" id="Path" fill="#F1004E"></path>
                <path d="M250.472435,122 C248.955129,122.029196 247.732173,123.240746 247.702703,124.743902 L247.702703,155.256098 C247.732173,156.759254 248.955129,157.970804 250.472435,158 L397.932971,158 C399.450277,157.970804 400.673232,156.759254 400.702703,155.256098 L400.702703,124.743902 C400.702703,123.228487 399.462651,122 397.932971,122 L250.472435,122 Z" id="Path" fill="#E6E6E6"></path>
                <path d="M251.312613,124 C250.423484,124 249.702703,124.718823 249.702703,125.605536 L249.702703,154.394464 C249.702703,155.281177 250.423484,156 251.312613,156 L397.092792,156 C397.981921,156 398.702703,155.281177 398.702703,154.394464 L398.702703,125.605536 C398.702703,124.718823 397.981921,124 397.092792,124 L251.312613,124 Z" id="Path" fill="#FFFFFF"></path>
                <path d="M388.083696,148 C389.019377,148 389.883982,147.523503 390.351822,146.75 C390.819663,145.976497 390.819663,145.023503 390.351822,144.25 C389.883982,143.476497 389.019377,143 388.083696,143 L264.321709,143 C262.875272,143 261.702703,144.119288 261.702703,145.5 C261.702703,146.880712 262.875272,148 264.321709,148 L388.083696,148 Z" id="Path" fill="#E6E6E6"></path>
                <path d="M317.106512,137 C317.795065,137 318.455416,136.73938 318.942296,136.275475 C319.429176,135.811569 319.702703,135.182378 319.702703,134.526316 C319.702703,133.151368 318.549239,132.028645 317.106512,132 L264.298893,132 C262.856166,132.028645 261.702703,133.151368 261.702703,134.526316 C261.702703,135.892494 262.865057,137 264.298893,137 L317.106512,137 Z" id="Path" fill="#F1004E"></path>
                <path d="M86.0286946,256.883444 L86.0286946,256.883444 C81.9757065,256.19513 79.1978615,252.264672 79.7796828,248.041526 C79.8335536,247.705757 79.9412951,247.369988 79.9951659,247.034219 L85.7054699,227 L94.3247966,228.678845 L94.7018921,249.048833 C94.7620523,253.35449 91.4658864,256.903546 87.3215936,256.995367 C86.8878249,257.013996 86.453512,256.976399 86.0286946,256.883444 L86.0286946,256.883444 Z" id="Path" fill="#FFCEBD"></path>
                <polygon id="Path" fill="#2F2E41" points="136.498157 383.772894 125.437551 382.102564 128.202703 273.531136 112.717854 320.300366 104.4224 386 93.9148239 383.216117 91.7027027 314.732601 103.869369 234 164.702703 247.919414"></polygon>
                <path d="M131.706732,411 L131.706732,411 C129.584511,411 127.54921,410.128573 126.048573,408.577424 C124.547936,407.026274 123.704887,404.922463 123.704887,402.728807 C123.696002,402.446305 123.714236,402.163589 123.759321,401.884807 L125.446785,384.160821 C125.500882,383.278737 125.996053,382.489652 126.753209,382.078956 C129.964834,380.334691 133.230893,380.728558 136.605821,383.091756 C137.245419,383.484455 137.653675,384.180751 137.694507,384.948554 L139.654143,401.772274 C140.133896,406.299996 137.005437,410.386072 132.632116,410.943733 L131.706732,411 Z" id="Path" fill="#2F2E41"></path>
                <path d="M86.6068164,409.534665 L86.6068164,409.534665 C84.7448162,408.869151 83.228206,407.494259 82.3940264,405.715536 C81.5598468,403.936813 81.4772052,401.901616 82.1644672,400.062232 C82.370093,399.515893 82.6340064,398.992873 82.951719,398.502067 L94.9854243,380.838766 C99.3153089,377.774156 101.901993,379.278601 102.914174,385.017781 L105.332162,379 L107.187826,380.950207 C109.095885,383.020755 109.214771,386.154333 107.468988,388.360992 L95.0416566,407.138697 C93.0691293,409.690519 89.6441358,410.663409 86.6068164,409.534665 Z" id="Path" fill="#2F2E41"></path>
                <circle id="Oval" fill="#FFCEBD" cx="161.202703" cy="113.5" r="16.5"></circle>
                <path d="M171.702703,144 L143.702703,138.545455 C147.27133,130.909091 150.181134,128.290909 146.99682,120 L169.506624,120 C167.530154,128.618182 169.451722,136.690909 171.702703,144 Z" id="Path" fill="#FFCEBD"></path>
                <path d="M168.584947,256 L101.702703,237.170165 C115.079152,207.873158 117.865912,175.696293 113.908712,141.691827 C113.720817,140.068204 114.191309,138.437066 115.216222,137.158849 C116.241136,135.880633 117.736098,135.060565 119.370762,134.879857 L119.593703,134.879857 C128.288395,134.159893 137.373233,133.273783 146.848218,132 L157.437907,139.199643 L169.699651,136.430549 C173.601116,138.313533 177.558315,139.919607 181.181103,141.470299 C187.911124,144.454994 191.280726,152.01245 188.984032,158.970969 C178.059932,191.646271 170.75862,224.044663 168.584947,256 Z" id="Path" fill="#FA7B8E"></path>
                <path d="M95.5598456,231 L82.7027027,229.340058 L113.168541,142.469741 C114.677858,138.043228 118.535001,135.663977 123.230653,135 L127.702703,135.553314 L124.348665,187.011527 L95.5598456,231 Z" id="Path" fill="#FA7B8E"></path>
                <path d="M195.782632,214.970654 L195.782632,214.970654 C191.45993,215.30331 187.416233,212.781934 185.761317,208.722039 L173.702703,179.264283 L183.613893,143 L186.201815,144.673736 L186.972685,145.175857 C194.516202,150.42023 198.205367,159.793153 196.663626,168.94291 L194.075704,184.285492 L204.702703,207.494633 C203.579708,211.641242 200.013041,214.63051 195.782632,214.970654 L195.782632,214.970654 Z" id="Path" fill="#FA7B8E"></path>
                <path d="M162.568397,88 L162.568397,88 C165.443293,88.1474288 168.24176,88.9774419 170.732237,90.4213592 C171.351563,90.7592233 171.070051,91.9417476 171.576772,92.3359223 C172.083493,92.7300971 173.716261,92.561165 174.279285,93.1242718 C178.155227,96.8932396 180.120991,102.211937 179.628007,107.596117 L178.72717,117 L176.475076,114.578641 C172.503748,110.151939 166.977569,107.428783 161.048234,106.976699 L160.260001,106.976699 L162.005374,103.992233 L159.02135,106.976699 C157.663085,106.977217 156.307196,107.090225 154.967581,107.314563 L157.219675,103.316505 L152.884394,107.652427 L152.884394,107.652427 C149.25339,108.462388 146.223164,110.949631 144.720554,114.353398 L144.213833,115.423301 L143.707112,106.469903 C143.601435,101.690531 145.398996,97.0650361 148.704123,93.6115643 C152.009251,90.1580926 156.551031,88.1597165 161.329746,88.0563107 L162.568397,88 Z" id="Path" fill="#2F2E41"></path>
                <ellipse id="Oval" fill="#FFCEBD" cx="178.202703" cy="117" rx="1.5" ry="3"></ellipse>
                <ellipse id="Oval" fill="#FFCEBD" cx="144.202703" cy="116" rx="1.5" ry="3"></ellipse>
                <path d="M209.743293,158.185674 L209.743293,158.185674 C213.922949,159.232394 216.481875,163.417713 215.488907,167.58306 L215.15093,168.589923 L207.546441,188 L198.702703,185.594717 L200.054612,165.233713 C200.355408,160.957619 204.084527,157.729899 208.391384,158.017863 C208.847234,158.01872 209.301258,158.075078 209.743293,158.185674 Z" id="Path" fill="#FFCEBD"></path>
                <polygon id="Path" fill="#FA7B8E" points="199.53249 213 185.702703 204.050847 197.319724 180 211.702703 185.59322 204.511213 206.847458"></polygon>
                <polygon id="Path" fill="#3F3D56" points="194.480407 411 25.7027027 411 25.7027027 410 194.702703 410"></polygon>
            </g>
        </g>
    </g>
</svg>
   `;
  }

  return (
    <View style={[style]}>
      <SvgXml xml={buildXml()} width={120} />
    </View>
  );
}