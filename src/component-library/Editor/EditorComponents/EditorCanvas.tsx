import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import Globals from '../../Globals';
import Slider from './Slider';
import EditorToolBar from './EditorToolBar';
import FadeInOut from '../../../Animated Hooks/FadeInOut';
import ScaleItemBar from './ScaleItemBar';
import {
  fontDataStyles,
  colorData,
  backgroundColorData,
  fontAlignment,
} from '../InterfaceProperties';
import Draggable from 'react-native-draggable';
import { PinchGestureHandler, TextInput } from 'react-native-gesture-handler';
import FadeOut from '../../../Animated Hooks/FadeOut';
import LottieView from 'lottie-react-native';
import { cursor } from '../../graphics/Images';

interface Props {
  toogleEditText?: () => void;
  toogleFadeIn: (fadeIn: boolean, index: number) => void;
  onDrag?: (dragging: boolean) => void;
  prepareDelete?: (remove: boolean) => void;
  index?: number;
  fadeIn?: boolean;
}
export default function EditorCanvas(props: Props) {
  const InputRef = useRef(null);
  const cursorRef = useRef(null);
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [
    currentBackgroundColorIndex,
    setCurrentBackgroundColorIndex,
  ] = useState(0);
  const [currentFontSize, setCurrentFontSize] = useState(
    Globals.font.size.xlarge,
  );
  const [currentTextAlignIndex, setCurrentTextAlignIndex] = useState(0);
  const [activeTextEditMode, setActiveTextEditMode] = useState(0);
  const [text, setText] = useState('');
  const [itemSize, setItemSize] = useState(1);
  const [item, setItem] = useState({
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    textAlign: 'left',
    color: Globals.color.text.light,
    backgroundColor: null,
  });
  const [reversePosition, setReversePosition] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [deleteItem, setDeleteItem] = useState(false);
  const [removeCompletely, setRemoveCompletely] = useState(false);
  const [currentPosition, setCurrentPosition] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    setItem({
      fontFamily: fontDataStyles[currentFontIndex],
      fontSize: currentFontSize,
      textAlign: fontAlignment[currentTextAlignIndex],
      color: colorData[currentColorIndex],
      backgroundColor: backgroundColorData[currentBackgroundColorIndex],
    });
    //Completely remove item when user has not entered any text
    if (!text && !props.fadeIn) {
      setRemoveCompletely(true);
    }
  }, [
    currentFontIndex,
    currentColorIndex,
    currentBackgroundColorIndex,
    currentFontSize,
    currentTextAlignIndex,
    props.index,
    props.fadeIn,
    text,
  ]);

  /**
   * Tells the slider if it needs to show the text edit mode or color edit mode or textalign edit mode
   * @method editMode
   **/
  function editMode(index: number) {
    setActiveTextEditMode(index);
  }

  /**
   * Change font style
   * @method compileFontStyle
   **/
  function compileFontStyle(
    fontFamily?: string,
    color?: string,
    fontSize?: number,
    textAlign?: string,
  ) {
    let fontStyle = styles.textInput;
    fontStyle = {
      ...fontStyle,
      ...{
        fontFamily: fontFamily,
        color: color,
        fontSize: fontSize,
        textAlign: textAlign,
      },
    };
    return fontStyle;
  }

  /**
   * Change textInputPlaceholder style
   * @method compileFontStyle
   **/
  function compileInputPlaceholderStyle(
    fontFamily?: string,
    color?: string,
    fontSize?: number,
    textAlign?: string,
  ) {
    let fontStyle = styles.textInput;
    fontStyle = {
      ...fontStyle,
      ...{
        fontFamily: fontFamily,
        color: color,
        fontSize: fontSize,
        textAlign: textAlign,
        position: 'absolute',
        opacity: text.length === 0 ? 1 : 0,
      },
    };
    return fontStyle;
  }

  /**
   * Change background style
   * @method compileFontBackgroundStyle
   **/
  function compileFontBackgroundStyle(backgroundColor?: string) {
    let backgroundStyle = styles.textInputBackground;
    backgroundStyle = {
      ...backgroundStyle,
      ...{
        backgroundColor: backgroundColor,
      },
    };
    return backgroundStyle;
  }

  /**
   * Change background style
   * @method compileFontBackgroundStyle
   **/
  function compileScaleItemStyle(scale: any) {
    let scaleStyle = styles.textInputContainer;
    if (!reversePosition) {
      scaleStyle = {
        ...scaleStyle,
        ...{
          transform: [{ scale: scale }],
        },
      };
    } else {
      scaleStyle = {
        ...scaleStyle,
        ...{
          transform: [
            { scale: scale },
            {
              translateX: position.x,
            },
            {
              translateY: position.y,
            },
          ],
        },
      };
    }

    return scaleStyle;
  }

  /**
   * When the textInout is not focused, wrap the container to match the item size
   * @method compileCanvasWrapStyle
   **/
  function compileCanvasWrapStyle(fadeIn: boolean) {
    let wrapStyle = styles.canvasContainer;
    if (!fadeIn) {
      wrapStyle = {
        ...wrapStyle,
        ...{
          width: null,
          height: null,
          zIndex: 1,
        },
      };
    }
    return wrapStyle;
  }

  //Set Gesture Handler to increase item with two finger touch
  const handleGesture = Animated.event([{ nativeEvent: { scale: scale } }], {
    useNativeDriver: true,
  });

  /**
   * Resize the item according to drag
   * @method onGestureStateChange
   **/
  function onGestureStateChange(event, index: number) {
    //Scale item
    scale.setValue(event.nativeEvent.scale);
    setItemSize(event.nativeEvent.scale);
    //Disbale editor
    props.toogleFadeIn(false, index);
    //Dismiss keyboard
    InputRef.current.blur();
    setDragging(true);
    props.onDrag(false);
    //Cause the item not to reverse to its initial postion
    setReversePosition(false);
  }

  /**
   * Dismiss the editor when dragging
   * @method onDrag
   **/
  function onDrag(index: number, event?, gestureState?) {
    //Set delete item area at the bottom of the screen
    const trashArea =
      Dimensions.get('window').height - Dimensions.get('window').height / 8;
    //Dismiss keyboard
    InputRef.current.blur();
    props.toogleFadeIn(false, index);
    setDragging(true);
    setReversePosition(false);
    props.onDrag(true);
    if (!gestureState) {
      return;
    }
    //Item is in Trash area
    if (gestureState.moveY >= trashArea) {
      props.prepareDelete(true);
    }
  }

  /**
   * Dismiss the editor
   * @method toogleEditor
   **/
  function toogleEditor(index: number) {
    //Dismiss keyboard
    InputRef.current.blur();
    props.toogleFadeIn(false, index);
    Animated.parallel([
      Animated.timing(position.x, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(position.y, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: itemSize,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(finish => {
      if (finish) {
        setReversePosition(false);
      }
    });
  }

  /**
   * Open the editor and make textInput active
   * @method onPressItem
   **/
  function onPressItem(index: number) {
    props.toogleFadeIn(true, index);
    //Reverse textInput to its initial position
    setReversePosition(true);
    //Focus keyboard
    InputRef.current.focus();
    Animated.parallel([
      Animated.timing(position.x, {
        toValue: -currentPosition.x,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(position.y, {
        toValue: -currentPosition.y,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }

  /**
   * Called when dragging has finished
   * @method setDragEndPosition
   **/
  function setDragEndPosition(event, gestureState?, bounds?) {
    //Set delete item area at the bottom of the screen
    const trashArea =
      Dimensions.get('window').height - Dimensions.get('window').height / 8;
    setReversePosition(false);
    setDragging(false);
    props.onDrag(false);
    setCurrentPosition({
      x: bounds.left,
      y: bounds.top,
    });
    //Delete item
    if (gestureState.moveY >= trashArea) {
      setDeleteItem(true);
    }
  }

  /**
   * New text
   * @method changeText
   **/
  function changeText(text: string) {
    setText(text);
  }

  const renderCursor = useMemo(() => {
    if (props.fadeIn && text) {
      return (
        <View style={styles.cursorContainer}>
          <LottieView
            ref={cursorRef}
            source={cursor}
            style={{ height: item.fontSize }}
            speed={0.7}
            autoPlay
            loop
          />
        </View>
      );
    }
  }, [item.fontSize, props.fadeIn, text]);

  const renderTextInput = useMemo(
    () => (
      <Draggable
        onDrag={(event, gestureState) =>
          onDrag(props.index, event, gestureState)
        }
        onDragRelease={(event, gestureState, bounds) =>
          setDragEndPosition(event, gestureState, bounds)
        }
        disabled={props.fadeIn}
        touchableOpacityProps={{ activeOpacity: 1 }}>
        <PinchGestureHandler
          onGestureEvent={handleGesture}
          onHandlerStateChange={event =>
            onGestureStateChange(event, props.index)
          }>
          <Animated.View style={compileScaleItemStyle(scale)}>
            <View style={compileFontBackgroundStyle(item.backgroundColor)}>
              <Text
                style={compileFontStyle(
                  item.fontFamily,
                  item.color,
                  item.fontSize,
                  item.textAlign,
                )}>
                {text}
                {renderCursor}
              </Text>

              <TextInput
                ref={InputRef}
                onChangeText={text => changeText(text)}
                style={compileInputPlaceholderStyle(
                  item.fontFamily,
                  item.color,
                  item.fontSize,
                  item.textAlign,
                )}
                autoFocus={true}
                placeholderTextColor={Globals.color.text.light}
                placeholder={''}
                selectionColor={Globals.color.text.light}
                multiline={true}
                keyboardAppearance={'light'}
                allowFontScaling={true}
              />
            </View>
            <TouchableWithoutFeedback
              delayPressIn={200}
              onPress={() => onPressItem(props.index)}
              onPressIn={() => onPressItem(props.index)}>
              <View
                style={{ width: '100%', height: '100%', position: 'absolute',}}
              />
            </TouchableWithoutFeedback>
          </Animated.View>
        </PinchGestureHandler>
      </Draggable>
    ),
    [
      props.fadeIn,
      props.index,
      handleGesture,
      compileScaleItemStyle,
      scale,
      item.backgroundColor,
      item.fontFamily,
      item.color,
      item.fontSize,
      item.textAlign,
      text,
      renderCursor,
      compileInputPlaceholderStyle,
      onDrag,
      setDragEndPosition,
      onGestureStateChange,
      onPressItem,
    ],
  );

  const renderEditor = useMemo(
    () => (
      <View style={compileCanvasWrapStyle(props.fadeIn)}>
        <FadeInOut
          style={styles.fadeInView}
          fadeIn={props.fadeIn}
          delay={50}
          duration={200}>
          <View
            style={styles.fadeInView}
            onTouchStart={() => toogleEditor(props.index)}
          />
        </FadeInOut>

        {!removeCompletely ? (
          <FadeOut start={deleteItem} duration={200}>
            {renderTextInput}
          </FadeOut>
        ) : null}

        <KeyboardAvoidingView
          style={styles.sliderContainer}
          behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
          <FadeInOut fadeIn={props.fadeIn} duration={200}>
            <Slider
              itemFontIndex={index => setCurrentFontIndex(index)}
              itemColorIndex={index => setCurrentColorIndex(index)}
              itemBackgroundColorIndex={index =>
                setCurrentBackgroundColorIndex(index)
              }
              editMode={activeTextEditMode}
            />
          </FadeInOut>
        </KeyboardAvoidingView>

        <ScaleItemBar
          updateFontSize={fontSize => setCurrentFontSize(fontSize)}
          fadeIn={props.fadeIn}
        />

        {item && (
          <EditorToolBar
            editMode={index => editMode(index)}
            fadeIn={props.fadeIn}
            toogleEditor={() => toogleEditor(props.index)}
            item={item}
            togglefontAlignment={index => setCurrentTextAlignIndex(index)}
          />
        )}
      </View>
    ),
    [
      props.fadeIn,
      props.index,
      removeCompletely,
      deleteItem,
      renderTextInput,
      activeTextEditMode,
      item,
      toogleEditor,
    ],
  );

  return renderEditor;
}

const styles = StyleSheet.create({
  canvasContainer: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    zIndex: 10,
  },
  fadeInView: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    position: 'absolute',
  },
  sliderContainer: {
    position: 'absolute',
    bottom: 0,
  },
  takeOffButton: {
    position: 'absolute',
    bottom: 0,
  },
  textInputContainer: {
    width: '100%',
    position: 'absolute',
    borderRadius: Globals.dimension.borderRadius.large,
    top: Dimensions.get('window').height * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Globals.dimension.padding.small,
  },
  textInputBackground: {
    borderRadius: Globals.dimension.borderRadius.tiny,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Globals.dimension.margin.medium,
    padding: Globals.dimension.padding.tiny,
  },
  textInput: {
    fontSize: Globals.font.size.xlarge,
  },
  cursorContainer: {
    height: 0,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
