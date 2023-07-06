import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Globals from './Globals';
import { CheckBox } from 'react-native-elements';
import { checkboxActive, checkboxInactive } from './graphics/Images';
import { isIos } from '../services/utility/Platform';

interface Props {
  title: any;
  onCheckboxPress: (reason: String) => void;
}

interface State {
  checked: boolean;
}

export default class Checkbox extends Component<Props, State> {
  state = {
    checked: false,
  };

  render() {
    const { title } = this.props;
    const { checked } = this.state;

    return (
      <CheckBox
        title={title}
        titleProps={styles.title}
        fontFamily={Globals.font.family.regular}
        textStyle={styles.checkBoxTextStyle}
        containerStyle={styles.checkBoxContainerStyle}
        checked={checked}
        iconRight
        onPress={() => this.onIconPressHandler(title)}
        wrapperStyle={styles.wrapperStyle}
        checkedIcon={
          <View style={styles.iconView}>
            <Image source={checkboxActive} style={styles.iconImage} />
          </View>
        }
        uncheckedIcon={
          <View style={styles.iconView}>
            <Image source={checkboxInactive} style={styles.iconImage} />
          </View>
        }
      />
    );
  }

  onIconPressHandler = (title) => {
    this.setState({ checked: !this.state.checked });
    this.props.onCheckboxPress(title);
  };
}

const styles = StyleSheet.create({
  wrapperStyle: {
    justifyContent: 'space-between',
    marginBottom: Globals.dimension.margin.tiny,
  },
  checkBoxTextStyle: {
    fontSize: Globals.font.size.small,
    lineHeight: Globals.font.lineHeight.small,
    fontFamily: Globals.font.family.regular,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
  },
  checkBoxContainerStyle: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    marginTop: 0,
    marginBottom: 0,
    padding: Globals.dimension.padding.tiny,
  },
  iconView: {
    width: 20,
    height: 20,
    shadowColor: Globals.color.background.dark,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    elevation: isIos() ? 5 : 15,
  },
  iconImage: {
    width: 20,
    height: 20,
  },
});
