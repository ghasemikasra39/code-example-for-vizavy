import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  color: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class TextEditIcon extends React.Component<Props> {
  render() {
    const pathProps = {
      className: 'prefix__st1',
    };
    const svgProps = {
      viewBox: '0 0 58 32.7',
      xmlSpace: 'preserve',
    };
    const { style, width, height, color } = this.props;
    return (
      <Svg
        x={0}
        y={0}
        width={width || 31}
        height={height || 27}
        fill={color}
        style={style}
        {...svgProps}
        {...this.props}>
        <Path
          {...pathProps}
          d="M23.9 25.5H11.4l-2 5.1H1.6L14 1.7h7.8l12.1 28.9h-8.1l-1.9-5.1zm-2.2-5.7l-4-10.3-4 10.3h8zM56.4 16.1v14.5h-7.2v-2.5C47.7 30 45.5 31 42.4 31c-4.8 0-7.6-2.9-7.6-7 0-4.3 3-6.7 8.5-6.8h5.8V17c0-2.1-1.4-3.3-4.3-3.3-1.9 0-4.3.6-6.7 1.8l-2-5C39.7 8.9 42.9 8 46.6 8c6.2 0 9.8 3 9.8 8.1zm-7.2 7v-1.9h-4.4c-2.1 0-3.1.7-3.1 2.3 0 1.5 1.1 2.5 3 2.5 2.2 0 4-1.2 4.5-2.9z"
        />
      </Svg>
    );
  }
}
