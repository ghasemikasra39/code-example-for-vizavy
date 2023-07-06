import React, { Component } from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { Camera } from 'expo-camera';
import { connect } from 'react-redux';
import * as Permissions from 'expo-permissions';
import InspirationsSlice, {
  InspirationInterface,
  InspirationsPropsInterface,
  inspirationsProps,
} from '../../store/slices/InspirationsSlice';
import MixPanelClient, {
  ENABLE_CAMERA,
  ENABLE_MICROPHONE,
  OPEN_SELECT_INSPIRATION,
  TAKE_PAPER_PLANE,
  TAKE_PAPER_PLANE_VIDEO_COMPLETED,
  FIRST_PAPER_PLANE_SENT,
  LAST_PAPER_PLANE_SENT,
  LIFETIME_PAPER_PLANES_SENT,
  SEND_PAPER_PLANE,
} from '../../services/utility/MixPanelClient';
import Globals from '../../component-library/Globals';
import InspirationsButton from './InspirationsButton';
import ActionBar from '../../component-library/ActionBar';
import PictureView from '../../component-library/PictureView';
import VideoPlayback from '../../component-library/VideoPlayback';
import PaperPlaneManager from '../../services/api/PaperPlaneManager';
import PersistedMetric from '../../services/utility/PersistedMetric';
import PermissionRequester from '../../services/utility/PermissionRequester';
import CameraPermissionsDeniedModal from '../../modals/CameraPermissionsDeniedModal';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import * as Location from 'expo-location';
import {
  AppStackParamList,
  PaperPlaneBottomTabNavigatorParamList,
} from '../../navigation/NavigationTypes';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  MEDIA_TYPE_PICTURE,
  MEDIA_TYPE_VIDEO,
  randomLocations,
} from '../../../consts';
import { Bugtracker } from '../../services/utility/BugTrackerService';

class TakePaperPlaneScreen extends Component<Props, State> {
  startRecordingAt: number;
  screenOpenedAt: number;
  mounted: boolean;
  camera: Camera;
  onDidFocusUnsubscriber: any;
  onDidBlurUnsubscriber: any;
  state = {
    cameraPermission: false,
    audioRecordingPermission: false,
    cameraType: Camera.Constants.Type.back,
    cameraFlashMode: Camera.Constants.FlashMode.off,
    isEnabled: false,
    isRecording: false,
    cameraFlashAvailable: false,
    showCameraPermissionDeniedModal: false,
    isLoading: true,
    selectedInspiration: null,
    inspirations: 0,
    cameraResult: null,
    resultHolder: null,
    resultFromGallery: false,
    mediaType: null,
    paperPlaneId: null,
    shouldPlayPaperPlane: true,
    showUploadModal: false,
    currentUserLocation: {
      locationCoordinates: {
        latitude: 35.019867,
        longitude: 22.451741,
      },
    },
    deliveryLocation: {
      locationName: null,
      locationCoordinates: {
        latitude: null,
        longitude: null,
      },
    },
    uploadProgress: 0,
    gallerySelected: false,
    imageHasChanged: false,
    videoHasChanged: false,
    videoExported: false,
    mediaRotationDegree: null,
  };

  componentDidMount = async () => {
    const { navigation } = this.props;
    const {
      getInspirations,
      getCurrentUserLocation,
      requestPermissionsAsync,
      onDidFocus,
      onDidBlur,
    } = this;

    const navigationSubscriber = () => {
      this.onDidFocusUnsubscriber = navigation.addListener('focus', () =>
        onDidFocus(),
      );
      this.onDidBlurUnsubscriber = navigation.addListener('blur', () =>
        onDidBlur(),
      );
    };

    this.mounted = true;
    getInspirations();
    getCurrentUserLocation();
    if (this.mounted) requestPermissionsAsync();
    navigationSubscriber();
  };

  componentWillUnmount = () => {
    const { onDidFocusUnsubscriber, onDidBlurUnsubscriber } = this;
    this.mounted = false;
    onDidFocusUnsubscriber();
    onDidBlurUnsubscriber();
  };

  /**
   * Track inspiration event in MixPanl
   * @method getInspirations
   */
  getInspirations = async () => {
    MixPanelClient.trackEvent(OPEN_SELECT_INSPIRATION);
    this.screenOpenedAt = Date.now();

    if (this.mounted) {
      this.setState({
        isLoading: false,
      });
    }
  };

  /**
   * Get inspiration everytime the screen get focused
   * @method onDidFocus
   */
  onDidFocus = () => {
    const { getInspirations, mounted } = this;
    if (mounted) {
      getInspirations();
      this.setState({ isEnabled: true });
    }
  };

  /**
   * handle cleanup when the screen get blurred
   * @method onDidBlur
   */
  onDidBlur = () => {
    const { mounted } = this;
    if (mounted) this.setState({ isEnabled: false });
  };

  /**
   * Ask for camera and mcirophone permission
   * @method requestPermissionsAsync
   **/
  requestPermissionsAsync = async () => {
    const { mounted, toggleCameraMode } = this;
    const cameraPermission = await PermissionRequester.requestAsync(
      Permissions.CAMERA,
    );
    const audioRecordingPermission = await PermissionRequester.requestAsync(
      Permissions.AUDIO_RECORDING,
    );

    const handleCameraPermission = () => {
      MixPanelClient.trackUserInformation({ [ENABLE_CAMERA]: true });
      toggleCameraMode();
    };

    const handleAudioPermission = () => {
      MixPanelClient.trackUserInformation({ [ENABLE_MICROPHONE]: true });
    };

    if (mounted && cameraPermission) handleCameraPermission();
    if (audioRecordingPermission) handleAudioPermission();
    if (mounted) {
      if (!cameraPermission || !audioRecordingPermission)
        this.setState({ showCameraPermissionDeniedModal: true });

      const requiredPermissionsGranted =
        cameraPermission && audioRecordingPermission;
      this.setState({
        cameraPermission,
        audioRecordingPermission,
        isEnabled: requiredPermissionsGranted,
        showCameraPermissionDeniedModal: !requiredPermissionsGranted,
      });
    }
  };

  /**
   * Toggle the camera between front and back
   * @method toggleCameraMode
   **/
  toggleCameraMode = () => {
    const { toggleFlashLight } = this;
    const { cameraType, cameraFlashMode } = this.state;
    const { front, back } = Camera.Constants.Type;
    const alternateMode = cameraType === front ? back : front;

    if (
      alternateMode === front &&
      cameraFlashMode !== Camera.Constants.FlashMode.off
    )
      toggleFlashLight();

    this.setState({
      cameraType: alternateMode,
      cameraFlashAvailable: alternateMode === back,
    });
  };

  /**
   * Toggle the camera flash light
   * @method toggleFlashLight
   **/
  toggleFlashLight = () => {
    const { cameraFlashMode } = this.state;
    const { off, torch } = Camera.Constants.FlashMode;
    const alternateMode = cameraFlashMode === off ? torch : off;
    this.setState({ cameraFlashMode: alternateMode });
  };

  /**
   * Display the camera in full screen
   * @method compileCameraStyle
   * @returns {const} - returns the style of the camera size
   **/
  compileCameraStyle = () => {
    let style = styles.camera;
    if (style.height / style.width > 16 / 9) {
      const width = (9 / 16) * style.height;
      const offset = (style.width - width) / 2;
      style = { ...style, ...{ width, left: offset } };
    } else {
      const height = (16 / 9) * style.width;
      const offset = (style.height - height) / 2;
      style = { ...style, ...{ height, top: offset } };
    }

    return style;
  };

  /**
   * Handle camera and microphone permission change
   * @method handleCameraPermissionChange
   **/
  handleCameraPermissionChange = (
    isGranted: boolean,
    permission: Permissions.PermissionType,
  ) => {
    if (!isGranted) return;

    const { state } = this;
    const stateField =
      permission === Permissions.CAMERA
        ? 'cameraPermission'
        : 'audioRecordingPermission';
    const isActuallyGranted = PermissionRequester.hasAsync(permission);
    const stateUpdate = {};

    stateUpdate[stateField] = isActuallyGranted;
    this.setState(stateUpdate);
    const predictedState = { ...state, ...stateUpdate };
    if (
      predictedState.cameraPermission &&
      predictedState.audioRecordingPermission
    )
      this.setState({
        isEnabled: true,
        showCameraPermissionDeniedModal: false,
      });
  };

  /**
   * Takes a picture when clicking on photo button
   * @method takePictureAsync
   **/
  takePictureAsync = async (inspirationsID: number) => {
    const { cameraType, mediaRotationDegree } = this.state;
    const { manipulateImage, camera } = this;
    const { inspirations } = this.props;
    const { front } = Camera.Constants.Type;

    const imageManipulator = async () => {
      const result = await camera.takePictureAsync({
        skipProcessing: true,
        quality: 1,
      });
      //Rotate and/or flip the image
      manipulateImage(result.uri, cameraType === front, mediaRotationDegree);
      return result;
    };

    this.setState({ inspirations: inspirations[inspirationsID].id });
    MixPanelClient.trackEvent(TAKE_PAPER_PLANE, { type: 'Picture' });
    const result = await imageManipulator();

    //Checks if the picture is in landscape mode and then tell the pictureView to display it with resize Mode contain
    this.setState({
      gallerySelected: result.height / result.width > 1 ? false : true,
    });
  };

  /**
   * Flips the image horizontally after it has been taken. Otherwise a selfie will be displayed to the user in the ooposite way.
   * @method flipImage
   **/
  manipulateImage = async (
    media: any,
    flipImage?: boolean,
    rotateImageDegrees?: number,
  ) => {
    const { FlipType, manipulateAsync, SaveFormat } = ImageManipulator;

    const compileOperations = () => {
      const operations = [];
      //insert operations for ImageManipulator into array
      flipImage ? operations.push({ flip: FlipType.Horizontal }) : null,
        rotateImageDegrees
          ? operations.push({ rotate: rotateImageDegrees })
          : null;
      return operations;
    };

    const manipulator = async (operations) => {
      return await manipulateAsync(media, operations, {
        format: SaveFormat.JPEG,
      });
    };

    const operations = compileOperations();
    const manipResult = await manipulator(operations);

    this.setState({
      mediaRotationDegree: null,
      cameraResult: manipResult.uri,
      mediaType: MEDIA_TYPE_PICTURE,
    });
  };

  /**
   * Start recording a video, when recording button is presssed
   * @method stopRecordVideo
   **/
  startRecordVideoAsync = async (inspirationsID: number) => {
    const { inspirations } = this.props;
    const { cameraType } = this.state;
    const { camera } = this;
    const { front } = Camera.Constants.Type;

    MixPanelClient.trackEvent(TAKE_PAPER_PLANE, { type: 'Video' });
    this.startRecordingAt = Date.now();

    this.setState({
      isRecording: true,
      inspirations: inspirations[inspirationsID].id,
    });

    await camera
      .recordAsync({ maxDuration: 30, mirror: cameraType === front })
      .then((result) => {
        this.setState({
          isRecording: false,
          cameraResult: result.uri,
          mediaType: MEDIA_TYPE_VIDEO,
        });
      });
  };

  /**
   * Stop recording a video, when recording button is no longer presssed
   * @method stopRecordVideo
   **/
  stopRecordVideo = () => {
    const { startRecordingAt, camera } = this;
    MixPanelClient.trackEvent(TAKE_PAPER_PLANE_VIDEO_COMPLETED, {
      duration: Date.now() - startRecordingAt,
    });

    camera.stopRecording();
    this.setState({ isRecording: false });
  };

  /**
   * When a user returns from taking a picture/video, this method will reset all the states
   * @method dismissMediaAsync
   **/
  dismissMediaAsync = async () => {
    this.setState({
      resultHolder: null,
      cameraResult: null,
      imageHasChanged: false,
      videoHasChanged: false,
      videoExported: false,
      shouldPlayPaperPlane: true,
      gallerySelected: false,
      deliveryLocation: {
        locationName: null,
        locationCoordinates: {
          latitude: null,
          longitude: null,
        },
      },
      mediaRotationDegree: null,
    });
  };

  /**
   * This method gets the user location and passes it to the Map
   * @method getCurrentUserLocation
   **/
  getCurrentUserLocation = async () => {
    const findLocation = async () => {
      let location: Location.LocationData | null = null;
      try {
        location = await Location.getCurrentPositionAsync();
      } catch (e) {
        try {
          location = await Location.getCurrentPositionAsync();
        } catch (e) {
          Bugtracker.captureException(e, { scope: 'TakePaperPlaneScreen' });
        }
      }
      return location;
    };

    const location = await findLocation();
    const { latitude, longitude } = location.coords;
    const centerLatitude = 36.258196; // Coordinates of map center
    const centerLongitude = 22.211603; // Coordinates of map center

    this.setState({
      currentUserLocation: {
        locationCoordinates: {
          latitude: latitude ? latitude : centerLatitude,
          longitude: longitude ? longitude : centerLongitude,
        },
      },
    });
  };

  /**
   * Gets the destination location of the receiving user, the location where the paper plane will land
   * @method getDestinationLocation
   * @param {string} message - OPTIONAL: Deprecated
   **/
  uploadPaperPlane = async (editorResult?: string) => {
    const {
      mediaType,
      gallerySelected,
      inspirations,
      cameraResult,
    } = this.state;

    this.getRandomLocation();
    const handleMixPanelReporting = () => {
      const date = new Date().toISOString();
      // Mixpanel track FIRST_PAPER_PLANE_SENT, LAST_PAPER_PLANE_SENT, LIFETIME_PAPER_PLANES_SENT & SEND_PAPER_PLANE events
      if (!PersistedMetric.has(FIRST_PAPER_PLANE_SENT)) {
        PersistedMetric.set(FIRST_PAPER_PLANE_SENT, date);
        MixPanelClient.trackUserInformationOnce({
          [FIRST_PAPER_PLANE_SENT]: date,
        });
      }
      MixPanelClient.trackUserInformation({
        [LAST_PAPER_PLANE_SENT]: date,
        [LIFETIME_PAPER_PLANES_SENT]: PersistedMetric.increment(
          LIFETIME_PAPER_PLANES_SENT,
        ),
      });
    };

    handleMixPanelReporting();

    const handleFailure = (err) => {
      this.getRandomLocation();
      Bugtracker.captureException(err, { scope: 'TakePaperPlaneScreen' });
    };
    // Post a paper plane without media file in order to get coordinates of destination location
    PaperPlaneManager.uploadPaperPlane(
      mediaType,
      inspirations,
      gallerySelected,
      cameraResult,
      editorResult,
      '',
    )
      .then(() => {
        MixPanelClient.trackEvent(SEND_PAPER_PLANE);
      })
      .catch(handleFailure);
  };

  /**
   * This method creates a random location based the randomLocations Array
   * @method getRandomLocation
   **/
  getRandomLocation = () => {
    const { currentUserLocation } = this.state;
    const { navigation } = this.props;
    const randomLocation = randomLocations[Math.floor(Math.random() * 20)];
    const { city, coordinates } = randomLocation;
    this.setState({
      deliveryLocation: {
        locationName: city,
        locationCoordinates: coordinates,
      },
    });

    navigation.navigate('SendOutPaperPlaneScreen', {
      deliveryLocation: {
        locationName: city,
        locationCoordinates: coordinates,
      },
      currentUserLocation,
    });
  };

  /**
   * Reset local state when uploading pp is done and navigate to ReceivePaperPlaneScreen
   * @method onPaperPlaneUploadDone
   */
  onPaperPlaneUploadDone = () => {
    const { navigation } = this.props;
    this.setState({
      cameraPermission: false,
      audioRecordingPermission: false,
      isRecording: false,
      isEnabled: false,
      isLoading: true,
      cameraFlashAvailable: false,
      cameraResult: null,
      mediaType: null,
      showUploadModal: false,
      uploadProgress: 0,
      shouldPlayPaperPlane: true,
      deliveryLocation: {
        locationName: null,
        locationCoordinates: {
          latitude: null,
          longitude: null,
        },
      },
      mediaRotationDegree: null,
    });
    navigation.navigate('ReceivePaperPlaneScreen');
  };

  /**
   * Handles picking an image and its permissions
   * @method pickImageAsync
   */
  pickImageAsync = async () => {
    const { launchImageLibraryAsync, MediaTypeOptions } = ImagePicker;
    const { inspirations } = this.props;
    const description =
      'The app needs permission to access your photos in order to select a picture or video. Open settings to grant the permission.';
    const title = 'Permission required';
    const permissionGranted = await PermissionRequester.openImagePickerAsync({
      title,
      description,
    });

    if (permissionGranted) {
      const result = await launchImageLibraryAsync({
        mediaTypes: MediaTypeOptions.All,
        allowsEditing: false,
        quality: 1,
      });

      if (result.cancelled === false) {
        this.setState({
          gallerySelected: true,
          inspirations: inspirations[0].id,
          cameraResult: result.uri,
          mediaType:
            result.type === 'image' ? MEDIA_TYPE_PICTURE : MEDIA_TYPE_VIDEO,
        });
      }
    }
  };

  /**
   * When cancel is selected in cdpModal, will navigate back to take pp screen
   * @method cdpModalOnCancel
   */
  cdpModalOnCancel = () => {
    this.setState({ showCameraPermissionDeniedModal: false });
    navigation.goBack();
  };

  render() {
    const { inspirations, navigation } = this.props;
    const {
      cameraType,
      isEnabled,
      cameraPermission,
      audioRecordingPermission,
      cameraFlashMode,
      isRecording,
      showCameraPermissionDeniedModal,
      cameraResult,
      mediaType,
      gallerySelected,
      showUploadModal,
      uploadProgress,
      currentUserLocation,
      deliveryLocation,
      shouldPlayPaperPlane,
    } = this.state;
    const {
      compileCameraStyle,
      toggleCameraMode,
      toggleFlashLight,
      pickImageAsync,
      takePictureAsync,
      startRecordVideoAsync,
      stopRecordVideo,
      handleCameraPermissionChange,
      dismissMediaAsync,
      uploadPaperPlane,
      onPaperPlaneUploadDone,
      cdpModalOnCancel,
    } = this;
    navigation.setOptions({ tabBarVisible: true });

    const CameraComponent = (
      <Camera
        ref={(component) => (this.camera = component)}
        style={compileCameraStyle()}
        type={cameraType}
        flashMode={cameraFlashMode}
        ratio="16:9"
        videoStabilizationMode={Camera.Constants.VideoStabilization.off}
      />
    );

    const VideoPlaybackComponent = (
      <VideoPlayback
        onDismissMedia={dismissMediaAsync}
        onSubmitMedia={(uri) => uploadPaperPlane(uri)}
        cameraResult={cameraResult}
        resultFromGallery={gallerySelected}
        showModal={showUploadModal}
        uploadProgress={uploadProgress}
        currentUserLocation={currentUserLocation.locationCoordinates}
        deliveryLocation={deliveryLocation}
        onDone={onPaperPlaneUploadDone}
        shouldPlay={shouldPlayPaperPlane}
        navigation={navigation}
      />
    );

    const PictureViewComponent = (
      <PictureView
        onDismissMedia={dismissMediaAsync}
        onSubmitMedia={(uri) => uploadPaperPlane(uri)}
        cameraResult={cameraResult}
        resultFromGallery={gallerySelected}
        showModal={showUploadModal}
        uploadProgress={uploadProgress}
        currentUserLocation={currentUserLocation.locationCoordinates}
        deliveryLocation={deliveryLocation}
        onDone={onPaperPlaneUploadDone}
        navigation={navigation}
      />
    );


    const InspirationsButtonComponent = (
      <SafeAreaView style={styles.recordingButtonContainer}>
        <InspirationsButton
          inspirations={inspirations}
          onTakePicture={(inspirationsID) => takePictureAsync(inspirationsID)}
          onStartVideoRecording={(inspirationsID) =>
            startRecordVideoAsync(inspirationsID)
          }
          onEndVideoRecording={stopRecordVideo}
        />
      </SafeAreaView>
    );

    return (
      <>
        <View style={styles.container}>
          {isEnabled && CameraComponent}
          <ActionBar
            cameraType={cameraType}
            isRecording={isRecording}
            onToggleCameraMode={toggleCameraMode}
            onToggleFlashLight={toggleFlashLight}
            onPickImageAsyn={pickImageAsync}
          />
          {InspirationsButtonComponent}
        </View>
        <CameraPermissionsDeniedModal
          isVisible={showCameraPermissionDeniedModal}
          cameraGranted={cameraPermission}
          audioRecordingGranted={audioRecordingPermission}
          onPermissionChange={handleCameraPermissionChange}
          onCancel={cdpModalOnCancel}
        />
        {cameraResult && mediaType === MEDIA_TYPE_VIDEO
          ? VideoPlaybackComponent
          : null}
        {cameraResult && mediaType === MEDIA_TYPE_PICTURE
          ? PictureViewComponent
          : null}
      </>
    );
  }
}

export default connect(
  inspirationsProps,
  InspirationsSlice.actions,
)(TakePaperPlaneScreen);

type TakePaperPlaneScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<
    PaperPlaneBottomTabNavigatorParamList,
    'TakePaperPlaneScreen'
  >,
  StackNavigationProp<AppStackParamList>
>;

interface Props extends InspirationsPropsInterface {
  navigation: TakePaperPlaneScreenNavigationProp;
}

interface State {
  cameraPermission: boolean;
  audioRecordingPermission: boolean;
  cameraType: any;
  cameraFlashMode: any;
  isEnabled: boolean;
  isRecording: boolean;
  cameraFlashAvailable: boolean;
  showCameraPermissionDeniedModal: boolean;
  isLoading: boolean;
  selectedInspiration: InspirationInterface;
  inspirations: number;
  cameraResult: any;
  resultHolder: any;
  resultFromGallery: boolean;
  mediaType: any;
  paperPlaneId: number;
  shouldPlayPaperPlane: boolean;
  showUploadModal: boolean;
  currentUserLocation: {
    locationCoordinates: {
      latitude: number;
      longitude: number;
    };
  };
  deliveryLocation: {
    locationName: string;
    locationCoordinates: {
      latitude: number;
      longitude: number;
    };
  };
  uploadProgress: number;
  gallerySelected: boolean;
  imageHasChanged: boolean;
  videoHasChanged: boolean;
  videoExported: boolean;
  mediaRotationDegree: number;
}

const { width, height } = Dimensions.get('screen');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Math.round(width),
    height: Math.round(height),
  },
  activityIndicator: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButtonContainer: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  bottomBarContainer: {
    bottom: 0,
    position: 'absolute',
  },
  bottomBar: {
    width: Dimensions.get('window').width,
  },
  galleryContainer: {
    top: 58,
    position: 'absolute',
    alignSelf: 'center',
  },
});
