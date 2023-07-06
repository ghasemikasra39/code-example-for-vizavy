import React from 'react';
import { Text, View, Animated, StyleSheet } from 'react-native';
import Globals from '../../component-library/Globals';

interface Props {
  inspiration: string;
}

export default class InspirationsText extends React.Component<Props, {}> {
  state = {
    fadeIn: new Animated.Value(0),
  };

  animatedValues = {};

  componentDidMount() {
    this.fadeIn();
  }

  shouldComponentUpdate = nextProps => {
    const { inspiration } = this.props;
    if (inspiration !== nextProps.inspiration) {
      this.fadeIn();
      return true;
    } else return false;
  };

  fadeIn = () => {
    const { fadeIn } = this.state;
    this.setState({ fadeIn: new Animated.Value(0) }, () => {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }).start();
    });
  };

  render() {
    const { inspiration } = this.props;
    const { fadeIn } = this.state;
    return (
      <Animated.View style={{ opacity: fadeIn }}>
        <View style={styles.inspirationTextWrapper}>
          <Text style={styles.InspirationText}>{inspiration}</Text>
        </View>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  inspirationTextWrapper: {
    height: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  InspirationText: {
    fontSize: Globals.font.size.small,
    fontFamily: Globals.font.family.bold,
    textAlign: 'center',
    color: '#fff',
    lineHeight: 28,
    paddingLeft: 10,
    paddingRight: 10,
  },
});
