import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View } from 'react-native';
import Globals from '../../Globals';

interface Props {
  focused?: boolean;
  style?: any;
}

export default class PaperPlaneButton extends React.Component<Props> {
  buildXml = (): string => {
    return `
    <svg width="26px" height="20px" viewBox="0 0 26 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <title>Pp-Icon</title>
    <g id="New_tabBar" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g id="Screen-Room_Tab-" transform="translate(-175.000000, -774.000000)" fill="${
          this.props.focused
            ? Globals.color.text.grey
            : Globals.color.background.light
        }" fill-rule="nonzero">
            <g id="Group-5" transform="translate(0.000000, 762.000000)">
                <g id="Group-10">
                    <g id="Group-5-Copy" transform="translate(168.000000, 1.000000)">
                        <g id="Pp-Icon" transform="translate(7.465690, 11.120690)">
                            <path d="M24.3617774,0.0120340011 L0.383361434,8.67853731 C-0.0615258955,8.840339 -0.137358963,9.43698275 0.25191745,9.69991051 L3.83629378,12.1471612 L20.1050145,3.566615 L6.33372947,13.8511353 L6.33372947,18.0175289 C6.33372947,18.3006819 6.65222835,18.4725962 6.88983863,18.3158508 L9.92316134,16.3034422 L12.9109842,18.3411323 C13.1839832,18.5282155 13.558093,18.4473147 13.7350369,18.1641617 L24.5791655,0.280018059 C24.6701652,0.133385273 24.5235546,-0.0486416347 24.3617774,0.0120340011 Z" id="Path"></path>
                        </g>
                    </g>
                </g>
            </g>
        </g>
    </g>
</svg>`;
  };

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
          <SvgXml xml={this.buildXml()} width={25} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 32,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
