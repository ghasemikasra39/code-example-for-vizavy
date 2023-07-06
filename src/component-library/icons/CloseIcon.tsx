import * as React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { StyleProp, ViewStyle } from 'react-native';

interface Props {
  color: string;
  style?: StyleProp<ViewStyle>;
  width?: number;
  height?: number;
}

export default class CloseIcon extends React.Component<Props> {
  render() {
    const gProps = {
      transform: 'rotate(45 8.05 28.485)',
      filter: 'url(#prefix__a)',
    };
    const { style, width, height, color } = this.props;
    return (
      <Svg
        style={style}
        width={width || 20}
        height={height || 20}
        viewBox="0 0 45 45"
        {...this.props}>
        <G {...gProps}>
          <Path
            d="M14-13.5c2.9 0 5.2 2.1 5.2 4.7V8.9h17.7c2.6 0 4.7 2.3 4.7 5.2s-2.1 5.2-4.7 5.2H19.2V37c0 2.6-2.3 4.7-5.2 4.7S8.8 39.6 8.8 37V19.3H-8.9c-2.6 0-4.7-2.3-4.7-5.2s2.1-5.2 4.7-5.2H8.8V-8.8c.1-2.6 2.4-4.7 5.2-4.7z"
            fill={color}
          />
        </G>
      </Svg>
    );
  }
}
