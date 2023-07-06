import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleProp, ViewStyle, StyleSheet } from 'react-native';

interface Props {
  isLiked?: boolean;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class HeartImage extends React.Component<Props> {
  render() {
    return (
      <SvgXml
        style={[styles.image, this.props.style]}
        xml={this.props.isLiked ? this.buildXmlPurple() : this.buildXmlWhite()}
        width={this.props.width || 59}
        height={this.props.height || 59}
      />
    );
  }

  buildXmlWhite = () => {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg width="59px" height="55px" viewBox="0 0 59 55" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
        <title>Icon/heart</title>
        <desc>Created with Sketch.</desc>
        <defs>
            <path d="M12.0318818,22.7246162 C11.7235882,22.4899673 11.3440218,21.9928346 10.9571513,21.5508417 C10.2551205,20.7487832 8.707332,19.3600422 6.31378575,17.3846188 L5.99678481,17.1236312 C5.93294719,17.0711958 5.86836122,17.0196781 5.80304681,16.969094 C4.28774414,15.7955372 3.16723542,14.7101195 2.44152065,13.7128408 C1.3312125,12.1870531 -0.212963056,9.78650482 0.0244225616,6.69293354 C0.261808179,3.59936225 2.03560909,1.41907812 4.12261655,0.582630516 C4.76464943,0.32531142 6.86233842,-0.391159486 9.06411671,0.277839747 C10.5319689,0.723839235 11.7605967,1.63720291 12.75,3.01793076 L12.9510703,2.74801672 C13.9042836,1.51749826 15.0658879,0.694105936 16.4358833,0.277839747 C18.6376616,-0.391159486 20.7353506,0.32531142 21.3773835,0.582630516 C23.4643909,1.41907812 25.2381918,3.59936225 25.4755774,6.69293354 C25.7129631,9.78650482 24.1687875,12.1870531 23.0584794,13.7128408 C22.3327646,14.7101195 21.2122559,15.7955372 19.6969532,16.969094 C19.6316388,17.0196781 19.5670528,17.0711958 19.5032152,17.1236312 L19.5032152,17.1236312 L19.1862143,17.3846188 C16.792668,19.3600422 15.2448795,20.7487832 14.5428487,21.5508417 C14.1559782,21.9928346 13.7764118,22.4899673 13.4681182,22.7246162 C13.2793294,22.8683075 13.0399566,22.9434354 12.75,22.95 L12.75,22.95 C12.4600434,22.9434354 12.2206706,22.8683075 12.0318818,22.7246162 Z" id="path-1"></path>
            <filter x="-109.8%" y="-100.2%" width="319.6%" height="344.0%" filterUnits="objectBoundingBox" id="filter-2">
                <feOffset dx="0" dy="5" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="8.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"></feComposite>
                <feColorMatrix values="0 0 0 0 0.729411765   0 0 0 0 0.705882353   0 0 0 0 0.705882353  0 0 0 0.378004808 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
        </defs>
        <g id="Youpendo-Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Watch-Paper-Plane" transform="translate(-14.000000, -692.000000)">
                <g id="Icon/heart" transform="translate(18.000000, 688.000000)">
                    <g id="Icon/heartSelected">
                        <g id="Group" transform="translate(12.750000, 15.300000)">
                            <g id="Combined-Shape">
                                <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                                <path stroke="#3D3A3A" stroke-width="2" d="M12.183294,22.5256832 C12.3276281,22.635539 12.5159246,22.6946365 12.7443415,22.700064 C12.9840754,22.6946365 13.1723719,22.635539 13.316706,22.5256832 C13.5003204,22.3859303 13.5903201,22.2855571 14.1515794,21.6227935 C14.2297056,21.530538 14.293207,21.4564753 14.3547312,21.386185 C15.0685461,20.5706634 16.6232454,19.1757218 19.0273136,17.1916147 L19.344535,16.9304459 C19.4102187,16.876494 19.4766725,16.8234864 19.5438757,16.7714395 C21.0420042,15.6111837 22.1463093,14.5414621 22.8563359,13.565742 C24.5682605,11.2132118 25.4168503,9.19514822 25.2263102,6.71206109 C25.0100355,3.89360315 23.4417228,1.67932448 21.2843782,0.814686577 C19.8843356,0.253566265 18.1864305,0.00723030689 16.5085636,0.517041697 C15.1892913,0.917895922 14.0708762,1.71067401 13.151556,2.89736694 L12.7460828,3.44166868 L12.5467875,3.163549 C11.5885813,1.8263572 10.4051472,0.946590595 8.99143641,0.517041697 C7.31356953,0.00723030689 5.61566443,0.253566265 4.21562184,0.814686577 C2.05827721,1.67932448 0.489964518,3.89360315 0.273689761,6.71206109 C0.0831497285,9.19514822 0.931739482,11.2132118 2.64366405,13.565742 C3.35369071,14.5414621 4.45799584,15.6111837 5.95612429,16.7714395 C6.02332754,16.8234864 6.08978128,16.876494 6.15568548,16.9306272 L6.47291733,17.191805 C8.87675465,19.1757218 10.4314539,20.5706634 11.1452688,21.386185 C11.206793,21.4564753 11.2702944,21.530538 11.3484206,21.6227935 C11.9096799,22.2855571 11.9996796,22.3859303 12.183294,22.5256832 Z" stroke-linejoin="square" fill="#FFFFFF" fill-rule="evenodd"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>

    `;
  };

  

  buildXmlPurple = () => {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <svg width="59px" height="55px" viewBox="0 0 59 55" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
        <title>Combined Shape</title>
        <desc>Created with Sketch.</desc>
        <defs>
            <path d="M12.0318818,22.7246162 C11.7235882,22.4899673 11.3440218,21.9928346 10.9571513,21.5508417 C10.2551205,20.7487832 8.707332,19.3600422 6.31378575,17.3846188 L5.99678481,17.1236312 C5.93294719,17.0711958 5.86836122,17.0196781 5.80304681,16.969094 C4.28774414,15.7955372 3.16723542,14.7101195 2.44152065,13.7128408 C1.3312125,12.1870531 -0.212963056,9.78650482 0.0244225616,6.69293354 C0.261808179,3.59936225 2.03560909,1.41907812 4.12261655,0.582630516 C4.76464943,0.32531142 6.86233842,-0.391159486 9.06411671,0.277839747 C10.5319689,0.723839235 11.7605967,1.63720291 12.75,3.01793076 L12.9510703,2.74801672 C13.9042836,1.51749826 15.0658879,0.694105936 16.4358833,0.277839747 C18.6376616,-0.391159486 20.7353506,0.32531142 21.3773835,0.582630516 C23.4643909,1.41907812 25.2381918,3.59936225 25.4755774,6.69293354 C25.7129631,9.78650482 24.1687875,12.1870531 23.0584794,13.7128408 C22.3327646,14.7101195 21.2122559,15.7955372 19.6969532,16.969094 C19.6316388,17.0196781 19.5670528,17.0711958 19.5032152,17.1236312 L19.5032152,17.1236312 L19.1862143,17.3846188 C16.792668,19.3600422 15.2448795,20.7487832 14.5428487,21.5508417 C14.1559782,21.9928346 13.7764118,22.4899673 13.4681182,22.7246162 C13.2793294,22.8683075 13.0399566,22.9434354 12.75,22.95 L12.75,22.95 C12.4600434,22.9434354 12.2206706,22.8683075 12.0318818,22.7246162 Z" id="path-1"></path>
            <filter x="-109.8%" y="-100.2%" width="319.6%" height="344.0%" filterUnits="objectBoundingBox" id="filter-2">
                <feOffset dx="0" dy="5" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                <feGaussianBlur stdDeviation="8.5" in="shadowOffsetOuter1" result="shadowBlurOuter1"></feGaussianBlur>
                <feColorMatrix values="0 0 0 0 0.945098039   0 0 0 0 0   0 0 0 0 0.305882353  0 0 0 0.31 0" type="matrix" in="shadowBlurOuter1"></feColorMatrix>
            </filter>
        </defs>
        <g id="Youpendo-Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g id="Watch-Paper-Plane" transform="translate(-14.000000, -655.000000)">
                <g id="Icon/heart" transform="translate(18.000000, 651.000000)">
                    <g id="Icon/heartSelected">
                        <g id="Group" transform="translate(12.750000, 15.300000)">
                            <g id="Combined-Shape">
                                <use fill="black" fill-opacity="1" filter="url(#filter-2)" xlink:href="#path-1"></use>
                                <use fill="#F1004E" fill-rule="evenodd" xlink:href="#path-1"></use>
                            </g>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </svg>
    `;
  };
}

const styles = StyleSheet.create({
  image: {
    alignSelf: 'center',
  },
});
