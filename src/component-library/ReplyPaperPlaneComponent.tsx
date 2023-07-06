import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Platform,
  TouchableNativeFeedback,
} from 'react-native';
import Globals from './Globals';
import SendMessageBar from './ChatRoom/SendMessageBar';
import PaperPlaneManager, {
  PaperPlaneInterface,
} from '../services/api/PaperPlaneManager';
import FadeInOut from '../Animated Hooks/FadeInOut';

interface Props {
  messagePlaceholder: string;
  item: PaperPlaneInterface;
  show: boolean;
  toggleView: () => void;
  messageSent: (sentStatus: string) => void;
}

export default function ReplyPaperPlaneComponent(props: Props) {
  const { show, toggleView, messageSent, item, messagePlaceholder } = props;
  const ANIMATION_DURATION = 100;
  const textInputRef = useRef();
  const [fadeIn, setFadeIn] = useState(false);
  const textInputScrollViewRef = useRef();
  const [message, setMessage] = useState('');
  const [textInputScrollPosition, setTextInputScrollPosition] = useState(0);
  const [enabledTextInputEditing, setEnabledTextInputEditing] = useState(true);
  const textInputScrollRef = useRef(textInputScrollPosition);
  textInputScrollRef.current = textInputScrollPosition;

  useEffect(() => {
    if (show) {
      setFadeIn(true);
    }
  }, [show]);

  async function handleSubmitAsync() {
    blurTextInput();
    PaperPlaneManager.replyOnPaperPlane(item?.id, message).then((response) => {
      if (response.success) {
        messageSent('Message sent');
        setMessage('');
      } else {
        messageSent('Failed to send message');
      }
    });
  }

  function blurTextInput() {
    textInputRef.current?.blur();
    // setFadeIn(false);
    // setTimeout(() => {
    //   toggleView();
    // }, ANIMATION_DURATION);
  }

  function onBlur() {
    setFadeIn(false);
    setTimeout(() => {
      toggleView();
    }, ANIMATION_DURATION);
  }

  //When scrolling though the textinput, it will save the current scroll position
  function updateScrollPosition(e) {
    setTextInputScrollPosition(e.nativeEvent.contentOffset.y);
  }

  //When clicking on a letter, it will scroll to the last updated scrollPosition
  function scrollToSelectedLetter() {
    if (!enabledTextInputEditing) return;
    textInputScrollViewRef.current?.scrollTo({
      x: 0,
      y: textInputScrollRef.current + 0.1,
    });
  }

  return (
    show && (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FadeInOut
          fadeIn={fadeIn}
          duration={ANIMATION_DURATION}
          style={styles.wrapper}>
          <TouchableNativeFeedback onPress={blurTextInput}>
            <View style={styles.coverView} />
          </TouchableNativeFeedback>
          <SendMessageBar
            sendMessage={handleSubmitAsync}
            show
            colors={Globals.gradients.primary}
            expiredRoom={false}
            darkMode
            loadingMessages={false}>
            <ScrollView
              ref={textInputScrollViewRef}
              scrollEventThrottle={50}
              onScrollBeginDrag={() => setEnabledTextInputEditing(false)}
              onScrollEndDrag={() => setEnabledTextInputEditing(true)}
              onScroll={updateScrollPosition}>
              <View style={styles.textInputContainer}>
                <TextInput
                  style={styles.textInput}
                  placeholder={messagePlaceholder}
                  placeholderTextColor={Globals.color.text.light}
                  multiline={true}
                  autoFocus
                  defaultValue={message}
                  onChangeText={(value) => setMessage(value)}
                  returnKeyType="done"
                  ref={textInputRef}
                  keyboardAppearance={'light'}
                  scrollEnabled={false}
                  onTouchEnd={scrollToSelectedLetter}
                  onBlur={onBlur}
                />
              </View>
            </ScrollView>
          </SendMessageBar>
        </FadeInOut>
      </KeyboardAvoidingView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 1,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  coverView: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    width: '92%',
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
    lineHeight: Globals.font.lineHeight.medium * 0.85,
    top: -6,
    paddingRight: Globals.dimension.padding.tiny,
  },
});
