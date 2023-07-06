import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Globals from './Globals';
import Video from 'react-native-video';
import { CompositeNavigationProp } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { store } from '../store';
import { setVisibility } from '../store/slices/BottomTabBarSlice';
import {
  AppStackParamList,
  PaperPlaneBottomTabNavigatorParamList,
} from '../navigation/NavigationTypes';
import { StackNavigationProp } from '@react-navigation/stack/lib/typescript/src/types';
import Editor from './Editor/EditorComponents/Editor';
import FadeIn from '../Animated Hooks/FadeIn';
import ScaleInOut from '../Animated Hooks/ScaleInOut';

type PictureViewNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<
    PaperPlaneBottomTabNavigatorParamList,
    'TakePaperPlaneScreen'
  >,
  StackNavigationProp<AppStackParamList>
>;

interface Props {
  cameraResult?: any;
  resultFromGallery?: boolean;
  onDismissMedia: () => void;
  onSubmitMedia: (uri: string) => void;
  showModal: boolean;
  uploadProgress: number;
  currentUserLocation?: any;
  deliveryLocation?: any;
  location?: any;
  onDone?: () => void;
  navigation: PictureViewNavigationProp;
  handleEditedImage: Function;
  reply?: boolean;
  shouldPlay: boolean;
  uploading?: boolean;
}

export default function VideoPlayback(props: Props) {
  const [scale, setScale] = useState(false);

  useEffect(() => {
    // Display bottomNavigationBar
    store.dispatch(setVisibility(false));

    /**
     * Display bottomNavigationBar
     * @method cleanUp
     **/
    return function cleanUp() {
      store.dispatch(setVisibility(true));
    };
  }, [props.deliveryLocation]);

  const {
    showModal,
    uploadProgress,
    deliveryLocation,
    reply,
    onDone,
    cameraResult,
    resultFromGallery,
    currentUserLocation,
    onDismissMedia,
    uploading,
  } = props;
  const renderVideoView = useMemo(
    () => (
      <View style={styles.container}>
        <View style={styles.container}>
          {cameraResult && (
            <View style={styles.openEditorArea}>
              <Video
                source={{
                  uri: cameraResult,
                }}
                style={reply ? styles.roundedCorner : styles.video}
                bufferConfig={{
                  minBufferMs: 0,
                  maxBufferMs: 0,
                  bufferForPlaybackMs: 0,
                  bufferForPlaybackAfterRebufferMs: 0,
                }}
                volume={1.0}
                muted={showModal}
                automaticallyWaitsToMinimizeStalling={false}
                ignoreSilentSwitch={'ignore'}
                resizeMode={reply || resultFromGallery ? 'contain' : 'cover'}
                repeat={true}
              />
            </View>
          )}
        </View>

        <Editor
          dismiss={() => props.onDismissMedia()}
          submit={(uri) => props.onSubmitMedia(uri)}
          defaultOpen={reply}
          reply={reply}
          image={false}
          textIsFocus={(textIsFocused) => setScale(textIsFocused)}
          uploading={uploading}
        />
      </View>
    ),
    [
      showModal,
      uploadProgress,
      deliveryLocation,
      reply,
      onDone,
      cameraResult,
      resultFromGallery,
      currentUserLocation,
      onDismissMedia,
      scale,
      uploading,
    ],
  );

  return (
    <FadeIn style={styles.container} duration={100}>
      {renderVideoView}
    </FadeIn>
  );
}

const { width, height } = Dimensions.get('screen');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Globals.color.background.dark,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  openEditorArea: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  roundedCorner: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.76,
  },
  responsiveView: {
    flex: 1,
    justifyContent: 'flex-end',
    top: Globals.dimension.statusBarHeight + 50,
  },

  header: {
    position: 'absolute',
    top: Globals.dimension.statusBarHeight,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    zIndex: 1,
  },
  textEditor: {
    bottom: height * 0.2,
    width,
    alignSelf: 'center',
  },
});
