import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import Globals from '../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import { close_icon, plusIcon } from '../graphics/Images';

interface Props {
  colors?: any;
  item?: any;
  index?: number;
  dataLength?: number;
  deleteChoice?: (item: any) => void;
  updateText?: (text: string, index: number) => void;
  focus?: boolean;
}

export default function PollTextInput(props: Props) {
  const inputRef = useRef(null);
  const [text, setText] = useState('');

  useEffect(() => {
    if (props.focus) {
      inputRef.current.focus();
    } else {
      inputRef.current.blur();
    }
  }, [props.focus]);

  function compileRemoveIconStyle(length?: number) {
    let iconStyle = styles.deleteIconWrapper;
    if (length > 2) {
      iconStyle = {
        ...iconStyle,
        ...{
          backgroundColor: Globals.color.brand.primary,
        },
      };
    }

    return iconStyle;
  }

  const renderTextInput = useMemo(
    () => (
      <View style={styles.pollContainer}>
        <View style={styles.textInpuContainer}>
          <TextInput
            ref={inputRef}
            style={styles.textInput}
            onChangeText={(text) => props.updateText(text, props.index)}
            defaultValue={props.item.text}
            maxLength={20}
            placeholderTextColor={Globals.color.text.grey}
            placeholder={`Choice ${props.index + 1}`}
            selectionColor={Globals.color.text.grey}
            keyboardAppearance={'light'}
          />
          <Text style={styles.characterLimit}>{props.item.text.length}/20</Text>
        </View>
        <View style={styles.deleteIconContainer}>
          <TouchableOpacity
            style={compileRemoveIconStyle(props.dataLength)}
            hitSlop={Globals.dimension.hitSlop.regular}
            onPress={() =>
              props.dataLength > 2 ? props.deleteChoice(props.index) : null
            }>
            <Image source={close_icon} style={styles.deleteIcon} />
          </TouchableOpacity>
        </View>
      </View>
    ),
    [props.item.text, props.updateText, props.dataLength],
  );

  return renderTextInput;
}

const styles = StyleSheet.create({
  pollContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  textInpuContainer: {
    flex: 6,
    height: 40,
    borderRadius: Globals.dimension.borderRadius.tiny,
    marginBottom: Globals.dimension.margin.tiny,
    padding: 2,
    justifyContent: 'center',
    borderColor: Globals.color.background.grey,
    borderWidth: 1,
  },
  textInput: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
    paddingHorizontal: Globals.dimension.padding.tiny,
    borderRadius: Globals.dimension.borderRadius.tiny * 0.8,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  deleteIconContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  deleteIconWrapper: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: Globals.color.background.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 25,
    height: 25,
    marginTop: 6,
  },
  addChoiceContainer: {
    height: 50,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Globals.dimension.padding.tiny,
  },
  addChoiceIcon: {
    width: 47,
    height: 47,
    marginTop: 8,
    right: 1,
  },
  characterLimit: {
    position: 'absolute',
    alignSelf: 'flex-end',
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    backgroundColor: 'rgba(255,255,255,0.5)',
    right: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.tiny,
  },
});
