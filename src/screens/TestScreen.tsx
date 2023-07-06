import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '../component-library/Button';

const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

function TestScreen(props) {

  continueSignUp = () => {

  };

  return (
    <View data-test={'component-app'} style={styles.container}>
      <Button
        // style={styles.submitButton}
        title={'chat'}
        onPress={() => this.continueSignUp()}
        primary
        hapticFeedback
      />
    </View>
  );
}

export default connect(mapStateToProps)(TestScreen);

TestScreen.propTypes = {};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
