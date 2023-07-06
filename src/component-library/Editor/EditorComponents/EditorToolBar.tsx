import React, { useReducer, useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import Globals from '../../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import {
  textGradientIcon,
  leftAlignicon,
  centerAlignicon,
  rightAlignicon,
} from '../../graphics/Images';
import FadeInOut from '../../../Animated Hooks/FadeInOut';
import VibrationPattern from '../../../services/utility/VibrationPattern';

interface Props {
  editMode?: (index: number) => void;
  togglefontAlignment?: (index: number) => void;
  fadeIn?: boolean;
  toogleEditor?: () => void;
  item?: any;
}

export default function EditorToolBar(props: Props) {
  const alignmentArray = ['left', 'center', 'right'];
  const [fontColor, setFontColor] = useState(true);

  useEffect(() => {}, []);

  /**
   * Toggles between text align options
   * @method changeFontAlignment
   **/
  function changeFontAlignment() {
    const { textAlign } = props.item;
    const newIndex =
      alignmentArray.findIndex((element) => element === textAlign) + 1;
    if (newIndex <= 2) {
      props.togglefontAlignment(newIndex);
    } else {
      props.togglefontAlignment(0);
    }
    VibrationPattern.doHapticFeedback();
  }

  /**
   * Select font options
   * @method selectFonts
   **/
  function selectFonts() {
    props.editMode(0);
    VibrationPattern.doHapticFeedback();
  }

  /**
   * Toggles the color edit mode between edit font color and edit background color
   * @method changeFontColor
   **/
  function changeFontColor() {
    setFontColor(!fontColor);
    if (fontColor) {
      props.editMode(1);
    } else {
      props.editMode(2);
    }
    VibrationPattern.doHapticFeedback();
  }

  const renderTextAlignIcon = useMemo(() => {
    const { textAlign } = props.item;
    if (textAlign === alignmentArray[0]) {
      return <Image style={styles.textAlignIcon} source={leftAlignicon} />;
    } else if (textAlign === alignmentArray[1]) {
      return <Image style={styles.textAlignIcon} source={centerAlignicon} />;
    } else {
      return <Image style={styles.textAlignIcon} source={rightAlignicon} />;
    }
  }, [props.item.textAlign]);

  const renderColorIcon = useMemo(() => {
    if (fontColor) {
      return (
        <TouchableOpacity
          style={styles.colorButton}
          onPress={() => changeFontColor()}
          hitSlop={Globals.dimension.hitSlop.regular}>
          <Image source={textGradientIcon} style={styles.textGradientIcon} />
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          style={styles.backGroundColorButton}
          onPress={() => changeFontColor()}
          hitSlop={Globals.dimension.hitSlop.regular}>
          <LinearGradient
            colors={['#D5FF0D', '#C6749D', '#4F04A6']}
            style={styles.gradientButton}>
            <Text style={styles.textIcon}>A</Text>
          </LinearGradient>
        </TouchableOpacity>
      );
    }
  }, [fontColor]);

  const toolBar = useMemo(() => {
    return (
      <FadeInOut
        style={styles.header}
        fadeIn={props.fadeIn}
        delay={50}
        duration={200}>
        <View style={styles.headerWrapper}>
          <View style={styles.containerLeft}></View>
          <View style={styles.containerCenter}>
            <View style={styles.toolBar}>
              {props.fadeIn ? (
                <View style={styles.toolBar}>
                  <TouchableOpacity
                    style={styles.textAlignContainer}
                    onPress={() => changeFontAlignment()}
                    hitSlop={Globals.dimension.hitSlop.regular}>
                    {renderTextAlignIcon}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.textButton}
                    onPress={selectFonts}
                    hitSlop={Globals.dimension.hitSlop.regular}>
                    <Text style={styles.textIcon}>A</Text>
                  </TouchableOpacity>
                  {renderColorIcon}
                </View>
              ) : null}
            </View>
          </View>
          <TouchableOpacity
            hitSlop={Globals.dimension.hitSlop.regular}
            style={styles.containerRight}
            onPress={() => props.toogleEditor()}>
            <Text style={styles.doneBotton}>Done</Text>
          </TouchableOpacity>
        </View>
      </FadeInOut>
    );
  }, [props.fadeIn, renderTextAlignIcon, fontColor, renderColorIcon]);

  return toolBar;
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    width: '100%',
    height: Dimensions.get('window').height / 10,
    top: 0,
    alignItems: 'flex-end',
    paddingBottom: Globals.dimension.padding.mini,
    position: 'absolute',
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerLeft: {
    flex: 1,
    alignItems: 'flex-start',
    paddingLeft: Globals.dimension.padding.medium,
  },
  containerCenter: {
    flex: 2,
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  containerRight: {
    flex: 1,
    alignItems: 'flex-end',
    paddingRight: Globals.dimension.padding.medium,
  },
  doneBotton: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
  },
  toolBar: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 100,
  },
  colorButton: {
    width: 29,
    height: 29,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.light,
  },

  backGroundColorButton: {
    width: 29,
    height: 29,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  gradientButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    width: 29,
    height: 29,
    borderRadius: 5,
    borderWidth: 3,
    borderColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textAlignContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textIcon: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
  },
  textGradientIcon: {
    width: 14,
    height: 14,
  },
  textAlignIcon: {
    width: 25,
    height: 22,
  },
});
