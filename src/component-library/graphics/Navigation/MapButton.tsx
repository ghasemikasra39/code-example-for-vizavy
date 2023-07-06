import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

interface Props {
  focused: boolean;
  style?: any;
}

export default class MapButton extends React.Component<Props> {
  buildXml = (): string => {
    return `
    <svg width="22px" height="24px" viewBox="0 0 22 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <!-- Generator: Sketch 61.2 (89653) - https://sketch.com -->
    <title>Map</title>
    <desc>Created with Sketch.</desc>
    <defs>
        <linearGradient x1="100%" y1="0.453512397%" x2="0%" y2="99.5464876%" id="linearGradient-1">
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="0%"></stop>
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="84.7222222%" y1="0%" x2="15.2777778%" y2="100%" id="linearGradient-2">
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="0%"></stop>
        <stop 
        stop-color="${
          this.props.focused
            ? Globals.color.text.light
            : Globals.color.text.grey
        }"
        offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="Youpendo-Designs" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-Room_Tab-" transform="translate(-67.000000, -745.000000)" fill-rule="nonzero">
            <g id="Map" transform="translate(67.000000, 745.000000)">
                <g id="Icons/Nav/Map---Inactive">
                    <path d="M19.8,11.4 C19.9,11.9 20,12.5 20,13 C20,14.4 19.7,15.8 19.1,17 C17.1,18.1 16.2,17.5 15.3,16.8 C14.7,16.3 13.8,15.7 12.7,16.1 C11.6,16.5 10.8,17.4 10.3,18.5 C9.9,19.5 9.8,20.8 10,22 C8,21.8 6.2,20.9 4.9,19.6 C5.6,18.1 5.6,16.6 4.7,15.3 C4.5,14.9 4.2,14.6 3.9,14.3 C3.4,13.8 3.6,12.9 4.2,12.6 C5,12.2 5.9,11.8 6.5,11 C7.7,9.2 6.3,6.6 6,6.1 C5.9,6 5.8,5.9 5.7,5.7 C6.7,5 7.8,4.5 9,4.2 C9.1,3.4 9.3,2.7 9.6,2.1 C4.2,2.8 0,7.4 0,13 C0,19.1 4.9,24 11,24 C17.1,24 22,19.1 22,13 C22,11.8 21.8,10.6 21.4,9.4 C20.9,10.1 20.4,10.8 19.8,11.4 Z" id="Path" fill="url(#linearGradient-1)"></path>
                    <path d="M16,0 C13.5,0 11,1.9 11,5 C11,7.8 14.9,11.4 15.3,11.7 C15.5,11.9 15.7,12 16,12 C16.3,12 16.5,11.9 16.7,11.7 C17.1,11.4 21,7.8 21,5 C21,1.9 18.5,0 16,0 Z M16,7 C14.9,7 14,6.1 14,5 C14,3.9 14.9,3 16,3 C17.1,3 18,3.9 18,5 C18,6.1 17.1,7 16,7 Z" id="Shape" fill="url(#linearGradient-2)"></path>
                </g>
            </g>
        </g>
    </g>
</svg>
`;
  };

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <View>
          <SvgXml xml={this.buildXml()} width={23}/>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
