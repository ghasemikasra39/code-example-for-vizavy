import * as Permissions from 'expo-permissions';
import { Alert, Platform, Linking } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';
import { Constants } from 'react-native-unimodules';
import * as ImagePicker from 'expo-image-picker';
import { store } from '../../store';
import { Bugtracker } from '../utility/BugTrackerService';
import { actionCreators } from '../../store/actions';

interface PermissionAlertContent {
  title: string;
  description: string;
}

export enum PermissionsGranted {
  ENABLED = 'true',
  DISABLED = 'false',
}

class PermissionRequester {
  async hasAsync(
    requestedPermission: Permissions.PermissionType,
  ): Promise<boolean> {
    const { status } = await Permissions.getAsync(requestedPermission);

    return status === 'granted';
  }

  async openImagePickerAsync(
    alertContent?: PermissionAlertContent,
  ): Promise<boolean> {
    let permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(alertContent.title, alertContent.description, [
        {
          text: 'Cancel',
          onPress: () => false,
        },
        {
          text: 'Go to settings',
          onPress: this.openSettingsAsync,
        },
      ]);
    }
    return permissionResult.granted;
  }

  async requestAsync(
    requestedPermission: Permissions.PermissionType,
    alertContent?: PermissionAlertContent,
    onCancelCB?,
  ): Promise<boolean> {
    let { status } = await Permissions.getAsync(requestedPermission);
    if (status !== 'granted') {
      status = (await Permissions.askAsync(requestedPermission)).status;
    }

    if (status !== 'granted' && !!alertContent) {
      Alert.alert(alertContent.title, alertContent.description, [
        {
          text: 'Cancel',
          onPress: () => {
            onCancelCB && onCancelCB();
          },
        },
        {
          text: 'Go to settings',
          onPress: this.openSettingsAsync,
        },
      ]);
    }
    if (
      requestedPermission === Permissions.AUDIO_RECORDING &&
      status === 'granted'
    ) {
      const action = actionCreators.appStatus.setAudioAllowed(true);
      store.dispatch(action);
    }
    return status === 'granted';
  }

  openSettingsAsync = async () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package
        : 'host.exp.exponent';
      await IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
        {
          data: 'package:' + pkg,
        },
      );
    }
  };
}

export default new PermissionRequester();
