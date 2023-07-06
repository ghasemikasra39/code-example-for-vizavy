import React from 'react';
import Modal from '../component-library/Modal';
import { View, Text, StyleSheet, Switch } from 'react-native';
import Globals from '../component-library/Globals';
import PermissionRequester from '../services/utility/PermissionRequester';
import * as Permissions from 'expo-permissions';

interface Props {
  cameraGranted: boolean;
  audioRecordingGranted: boolean;
  isVisible: boolean;
  onPermissionChange?: (
    granted: boolean,
    permission: Permissions.PermissionType,
  ) => void;
  onCancel?: () => void;
}

export default class CameraPermissionsDeniedModal extends React.Component<
  Props
> {
  render() {
    const { isVisible, cameraGranted, audioRecordingGranted } = this.props;
    return (
      <Modal isVisible={isVisible} hideCloseButton placement={'center'}>
        <View style={styles.container}>
          <Text style={styles.headline}>Take Paper Plane</Text>
          <Text style={styles.explanation}>
            Enable access so you can start taking photos and videos.
          </Text>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleName}>Camera Access</Text>
            <Switch
              trackColor={{
                false: Globals.color.button.disabled,
                true: Globals.color.brand.primary,
              }}
              thumbColor={Globals.color.background.light}
              ios_backgroundColor={Globals.color.button.disabled}
              onValueChange={() =>
                this.requestPermissionAsync(Permissions.CAMERA)
              }
              value={cameraGranted}
            />
          </View>
          <View style={styles.toggleRow}>
            <Text style={styles.toggleName}>Microphone Access</Text>
            <Switch
              trackColor={{
                false: Globals.color.button.disabled,
                true: Globals.color.brand.primary,
              }}
              thumbColor={Globals.color.background.light}
              ios_backgroundColor={Globals.color.button.disabled}
              onValueChange={() =>
                this.requestPermissionAsync(Permissions.AUDIO_RECORDING)
              }
              value={audioRecordingGranted}
            />
          </View>
        </View>
      </Modal>
    );
  }

  requestPermissionAsync = async (permission: Permissions.PermissionType) => {
    const { onCancel } = this.props;
    const granted = await PermissionRequester.requestAsync(
      permission,
      {
        title: 'Please grant access',
        description:
          'You denied access at an earlier point. Please grant access in the application settings.',
      },
      onCancel,
    );

    this.props.onPermissionChange &&
      this.props.onPermissionChange(granted, permission);
  };
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Globals.dimension.padding.mini,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  headline: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.large,
    marginBottom: Globals.dimension.margin.tiny,
  },
  explanation: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.medium,
    marginBottom: Globals.dimension.margin.tiny,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Globals.dimension.margin.tiny,
    marginRight: -10,
  },
  toggleName: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.large,
  },
});
