import React, { useEffect, useMemo, useState, useRef } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Globals from '../../Globals';
import FadeInOut from '../../../Animated Hooks/FadeInOut';
import ViewShot, { captureRef } from 'react-native-view-shot';
import ActionBarOnCamera from '../../ActionBarOnCamera';
import PaperPlaneTakeoffButton from '../../PaperPlaneTakeoffButton';
import EditorCanvas from './EditorCanvas';
import LottieView from 'lottie-react-native';
import { trashAnimation } from '../../graphics/Images';
import VibrationPattern from '../../../services/utility/VibrationPattern';

interface Props {
  dismiss?: () => void;
  submit?: (uri: string) => void;
  defaultOpen?: boolean;
  reply?: boolean;
  image?: boolean;
  textIsFocus?: (fadeIn: boolean) => void;
  uploading?: boolean;
}
export default function Editor(props: Props) {
  const viewShotRef = useRef(null);
  const trashRef = useRef(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [InputData, setInputData] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [remove, setRemove] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (props.defaultOpen && InputData.length === 0) {
      addTextInput();
    }
    props.textIsFocus(fadeIn);
  }, [fadeIn, props.defaultOpen, InputData]);

  /**
   * Fades in the Canvas so that user knows that he can edit the text
   * @method toogleEditText
   **/
  function toogleEditText() {
    setFadeIn(!fadeIn);
  }

  /**
   * Adds a textinput
   * @method addTextInput
   **/
  function addTextInput() {
    const newInput = InputData.length + 1;
    InputData.push(newInput);
    setActiveIndex(InputData.length - 1);
    toogleEditText();
    VibrationPattern.doHapticFeedback();
  }

  /**
   * Takes a screenshot from the edited screen
   * @method takeSnapShot
   **/
  async function takeSnapShot() {
    captureRef(viewShotRef, {
      format: 'png',
      quality: 0.9,
      width: props.image ? Dimensions.get('screen').width * 2 : null, // double the pixel size so that the thumbnail matches the image
      height: props.image ? Dimensions.get('screen').height * 2 : null, // double the pixel size so that the thumbnail matches the image
    }).then((uri) => props.submit(uri));
  }

  /**
   * Set selected item as the active one
   * @method openSingleInput
   **/
  function openSingleInput(fadeIn: boolean, index: number) {
    setFadeIn(fadeIn);
    setActiveIndex(index);
  }

  /**
   * Deletes an item
   * @method deleteInput
   **/
  function deleteInput(remove?: boolean) {
    trashRef.current.play();
  }

  const renderEditorCanvas = useMemo(
    () => (
      <View style={styles.canvasContainer}>
        <ViewShot style={styles.canvasContainer} ref={viewShotRef}>
          <View style={styles.fadeInView} onTouchStart={() => addTextInput()}>
            {!fadeIn && dragging ? (
              <FadeInOut
                style={styles.gridlines}
                duration={300}
                delay={100}
                fadeIn={!fadeIn}
              />
            ) : null}
          </View>

          {!fadeIn && dragging ? (
            <FadeInOut
              style={styles.trashContainer}
              duration={300}
              delay={100}
              fadeIn={!fadeIn}>
              <LottieView
                ref={trashRef}
                source={trashAnimation}
                style={styles.trashIcon}
                speed={1}
                loop={false}
              />
            </FadeInOut>
          ) : null}

          {InputData.map((item, index) => (
            <EditorCanvas
              index={index}
              toogleEditText={() => toogleEditText()}
              toogleFadeIn={(fadeIn, index) => openSingleInput(fadeIn, index)}
              fadeIn={activeIndex === index ? fadeIn : false}
              prepareDelete={() => deleteInput()}
              onDrag={(isDragging) => setDragging(isDragging)}
            />
          ))}
        </ViewShot>

        {!fadeIn && !dragging ? (
          <ActionBarOnCamera
            onDismiss={() => props.dismiss()}
            onTextEditor={() => addTextInput()}
            fadeIn={!fadeIn}
            reply={props.reply}
            onMedia={true}
          />
        ) : null}

        {!fadeIn && !dragging ? (
          <FadeInOut
            style={styles.takeOffButtonContainer}
            fadeIn={!fadeIn}
            delay={100}>
            <PaperPlaneTakeoffButton
              style={styles.takeOffButton}
              onLockIn={() => takeSnapShot()}
              title={props.reply ? 'Reply' : 'Send'}
              uploading={props.uploading}
            />
          </FadeInOut>
        ) : null}
      </View>
    ),
    [fadeIn, activeIndex, remove, dragging, props.uploading],
  );

  return renderEditorCanvas;
}
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  canvasContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
  },
  fadeInView: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    alignItems: 'center',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
  },
  textInputContainer: {
    top: height * 0.1,
    left: width * 0.1,
    width: 300,
    height: 300,
    backgroundColor: Globals.color.brand.accent5,
  },
  takeOffButtonContainer: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  takeOffButton: {
    position: 'absolute',
    bottom: 0,
  },
  trashContainer: {
    width: 50,
    height: 50,
    position: 'absolute',
    alignSelf: 'center',
    bottom: height / 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 100,
  },
  trashIcon: {
    width: 70,
    height: 70,
  },
  gridlines: {
    top: height / 10,
    position: 'absolute',
    height: height * 0.75,
    width: width * 0.85,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignSelf: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Globals.color.text.light,
  },
});
