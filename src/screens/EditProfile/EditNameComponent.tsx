import React, { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, Dimensions } from 'react-native';
import Globals from '../../component-library/Globals';
import DefaultLoadingIndicator from '../../component-library/LoadingIndicator/DefaultLoadingIndicator';

interface Props {
  text: string;
  updateName: (name: string) => void;
  loading: boolean;
  openKeyboard: boolean;
}

export default function EditNameComponent(props: Props) {
  const textInputRef = useRef(null);
  const { text, updateName, loading, openKeyboard } = props;

  useEffect(() => {
    if (!props.openKeyboard) {
      textInputRef.current?.blur();
    } else {
      textInputRef.current?.focus();
    }
  }, [props.openKeyboard]);

  function changeText(text: string) {
    updateName(text);
  }

  const renderEditNameScreen = useMemo(
    () => (
      <View style={styles.wrapper}>
        <Text style={styles.title}>How do your friends call you?</Text>
        <View style={styles.textInputWrapper}>
          {!loading ? (
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              onChangeText={(text) => changeText(text)}
              autoFocus={openKeyboard ? true : false}
              value={props.text}
              placeholderTextColor={Globals.color.text.lightgrey}
              placeholder={'First name'}
              selectionColor={Globals.color.text.default}
              multiline={false}
              keyboardAppearance={'light'}
            />
          ) : (
            <DefaultLoadingIndicator size={'medium'} show={loading} />
          )}
          <View style={styles.line} />
        </View>
      </View>
    ),
    [changeText, text, loading, textInputRef, openKeyboard],
  );

  return renderEditNameScreen;
}

const styles = StyleSheet.create({
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  textInputWrapper: {
    width: '100%',
    top: '20%',
  },
  textInput: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
    width: '100%',
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: Globals.color.text.lightgrey,
    marginTop: Globals.dimension.margin.tiny,
    borderRadius: 100,
  },
});
