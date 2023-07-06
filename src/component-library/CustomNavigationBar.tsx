import React from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Globals from './Globals';
import BackArrowIcon from './icons/BackArrowIcon';
import { isIos } from '../services/utility/Platform';

export default class CustomNavigationBar extends React.Component<Props> {
  render() {
    const { options } = this.props.scene.descriptor;
    const headerShown = options.headerShown;

    if (!headerShown) return <View />;

    return (
      <View>
        <StatusBar barStyle="dark-content" />
        <View style={styles.statusBar} />
        <View style={this.compileContainerStyle()}>
          <View style={styles.headerLeft}>{this.buildHeaderLeft()}</View>
          <View style={styles.headerCenter}>{this.buildHeaderTitle()}</View>
          <View style={styles.headerRight}>{this.buildHeaderRight()}</View>
        </View>
      </View>
    );
  }

  buildHeaderTitle = () => {
    const { options } = this.props.scene.descriptor;
    const headerTitle =
      (options.headerTitle &&
        typeof options.headerTitle === 'function' &&
        options.headerTitle(this.props)) ||
      options.title ||
      '';
    return typeof headerTitle === 'string' ? (
      <Text style={styles.textTitle}>{headerTitle}</Text>
    ) : (
      headerTitle
    );
  };

  buildHeaderLeft = () => {
    const { headerLeft } = this.props.scene.descriptor.options;

    if (undefined === headerLeft) {
      return (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => this.props.navigation.goBack(null)}>
          <BackArrowIcon
            style={styles.backButton}
            primaryColor={Globals.color.brand.primary}
          />
        </TouchableOpacity>
      );
    }

    return this.renderHeaderSideElement(headerLeft);
  };

  buildHeaderRight = () => {
    const { headerRight } = this.props.scene.descriptor.options;
    return this.renderHeaderSideElement(headerRight);
  };

  renderHeaderSideElement = side => {
    if (typeof side === 'function') {
      return side();
    }

    return side || null;
  };

  compileContainerStyle = () => {
    const { headerStyle } = this.props.scene.descriptor.options;

    let style = {
      ...styles.container,
      ...(this.props.containerStyles || {}),
    };

    if (this.props.hideDivider) {
      style = {
        ...style,
        ...{ borderBottomWidth: 0 },
      };
    }

    if (headerStyle) {
      style = {
        ...style,
        ...headerStyle,
      };
    }

    return style;
  };
}

const styles = StyleSheet.create({
  statusBar: {
    backgroundColor: Globals.color.background.light,
    height: Globals.dimension.statusBarHeight,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Globals.color.background.light,
    borderBottomColor: Globals.color.brand.neutral4,
    borderBottomWidth: 1,
    paddingTop: isIos() ? 0 : Globals.dimension.padding.small,
    height: isIos() ? 40 : 50,
  },
  backButton: {
    marginLeft: Globals.dimension.margin.small,
  },
  headerLeft: {
    flex: 3,
  },
  headerCenter: {
    flex: 6,
  },
  textTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    textAlign: 'center',
    marginTop: -12,
  },
  headerRight: {
    flex: 3,
  },
});
