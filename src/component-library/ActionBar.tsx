import React from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Globals from './Globals';
import { Camera } from 'expo-camera';
import {
  galleryIcon,
  camera_flip,
  camera_flash,
  close_icon,
} from './graphics/Images';
import NavigationService from '../services/utility/NavigationService';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  onToggleFlashLight: () => void;
  onToggleCameraMode: () => void;
  onPickImageAsyn?: () => void;
  cameraType: string;
  isRecording: boolean;
}

export default class ActionBar extends React.Component<Props> {
  goBack = () => {
    NavigationService.goBack();
  };

  render() {
    const { isRecording } = this.props;
    return (
      <View style={styles.container}>
        <LinearGradient
          style={styles.shading}
          colors={['rgba(0,0,0,0.5)', 'transparent']}
        />
        <View style={isRecording ? styles.hidden : styles.actionBar}>
          <TouchableOpacity
            onPress={() => this.goBack()}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <Image source={close_icon} style={styles.closeIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={this.compileContainerCameraFlashIconStyle()}
            onPress={() => this.props.onToggleFlashLight()}
            hitSlop={Globals.dimension.hitSlop.regular}
            disabled={this.props.cameraType === Camera.Constants.Type.front}>
            <Image source={camera_flash} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onPickImageAsyn()}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <Image source={galleryIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.props.onToggleCameraMode()}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <Image source={camera_flip} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  compileContainerCameraFlashIconStyle = () => {
    let cameraFlashIconStyles = {};

    if (this.props.cameraType === Camera.Constants.Type.front) {
      cameraFlashIconStyles = {
        ...cameraFlashIconStyles,
        ...{ opacity: 0.5 },
      };
    }

    return cameraFlashIconStyles;
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: Dimensions.get('window').height / 10,
    top: 0,
    justifyContent: 'flex-end',
  },
  shading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Globals.dimension.padding.medium,
    marginBottom: 5,
  },
  hidden: {
    display: 'none',
  },
  closeIcon: {
    top: 11,
    left: -10,
    marginRight: -40,
  },
});
