import * as React from 'react';
import { SvgXml } from 'react-native-svg';

interface Props {
  color?: string;
  size?: number;
  style?: any;
}

export default function LocationIcon(props: Props) {
  const { color, style, size } = props;
  function buildXml(): string {
    return `
    <svg width="101px" height="144px" viewBox="0 0 101 144" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>Group</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="0.00163194444%" y1="50.0005421%" x2="100.001632%" y2="50.0005421%" id="linearGradient-1">
            <stop stop-color="#DC2553" offset="0%"></stop>
            <stop stop-color="#E86875" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="0.00248925096%" y1="50.0008834%" x2="100.002829%" y2="50.0008834%" id="linearGradient-2">
            <stop stop-color="#E86875" offset="0%"></stop>
            <stop stop-color="#FBAEA1" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="92.8675794%" y1="61.4889541%" x2="27.7891051%" y2="43.6845138%" id="linearGradient-3">
            <stop stop-color="#DC2553" offset="0%"></stop>
            <stop stop-color="#E86875" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="0.00161523421%" y1="50.0001921%" x2="100.002423%" y2="50.0001921%" id="linearGradient-4">
            <stop stop-color="#DC2553" offset="0%"></stop>
            <stop stop-color="#E86875" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="-56.5395298%" y1="-98.5309903%" x2="63.1198115%" y2="68.2842798%" id="linearGradient-5">
            <stop stop-color="#DC2553" offset="0%"></stop>
            <stop stop-color="#E86875" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Youpendo-Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Iphine-XS" transform="translate(-8702.000000, -543.000000)" fill-rule="nonzero">
            <g id="Group" transform="translate(8702.000000, 543.000000)">
                <ellipse id="Oval" fill="url(#linearGradient-1)" cx="50.5" cy="127.458904" rx="50.5" ry="16"></ellipse>
                <ellipse id="Oval" fill="url(#linearGradient-2)" cx="50.5" cy="127.458904" rx="30.5" ry="10"></ellipse>
                <g transform="translate(9.000000, 0.458904)" id="Path">
                    <path d="M43.3414439,1.33800341 C20.7965241,1.33800341 2.4540107,19.7731053 2.4540107,42.4318263 C2.4540107,64.5315902 40.6163102,125.447427 42.2430481,128.02911 C42.4828877,128.406406 42.8965241,128.636976 43.3414439,128.636976 C43.7863636,128.636976 44.2034759,128.406406 44.4398396,128.02911 C46.0631016,125.447427 84.228877,64.5315902 84.228877,42.4318263 C84.228877,19.7731053 65.8863636,1.33800341 43.3414439,1.33800341 Z" fill="url(#linearGradient-3)"></path>
                    <path d="M40.9152406,0.220089334 C18.3703209,0.220089334 0.0278074866,18.6551912 0.0278074866,41.3139122 C0.0278074866,63.4136761 38.190107,124.329513 39.8168449,126.911196 C40.0566845,127.288492 40.4703209,127.519062 40.9152406,127.519062 C41.3601604,127.519062 41.7772727,127.288492 42.0136364,126.911196 C43.6368984,124.329513 81.8026738,63.4136761 81.8026738,41.3139122 C81.8061497,18.6551912 63.4636364,0.220089334 40.9152406,0.220089334 Z" fill="url(#linearGradient-4)"></path>
                    <path d="M40.9152406,21.1355631 C29.844385,21.1355631 20.8382353,30.1871736 20.8382353,41.3139122 C20.8382353,52.4406508 29.844385,61.4922613 40.9152406,61.4922613 C51.9860963,61.4922613 60.992246,52.4406508 60.992246,41.3139122 C60.992246,30.1871736 51.9860963,21.1355631 40.9152406,21.1355631 Z" fill="url(#linearGradient-5)"></path>
                    <path d="M40.9152406,28.8282093 C34.0676471,28.8282093 28.492246,34.4282602 28.492246,41.3139122 C28.492246,48.1995642 34.0676471,53.7996151 40.9152406,53.7996151 C47.7663102,53.7996151 53.3382353,48.1995642 53.3382353,41.3139122 C53.3382353,34.4282602 47.7663102,28.8282093 40.9152406,28.8282093 Z" fill="#F2F2F2"></path>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  }

  return <SvgXml xml={buildXml()} width={size ? size : 150} style={style} />;
}
