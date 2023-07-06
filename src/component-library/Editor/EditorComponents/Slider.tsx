import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Globals from '../../Globals';
import Carousel from 'react-native-snap-carousel';
import {
  fontData,
  fontDataStyles,
  colorData,
  activeItemToolBar,
  backgroundColorData,
} from '../InterfaceProperties';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import VibrationPattern from '../../../services/utility/VibrationPattern';

interface Props {
  itemFontIndex?: (index?: number) => void;
  itemColorIndex?: (index: number) => void;
  itemBackgroundColorIndex?: (index: number) => void;
  editMode?: number;
}

export default function Slider(props: Props) {
  const carousel = useRef(null);
  const [activeItem, setActiveItem] = useState(0);
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [
    currentBackgroundColorIndex,
    setCurrentBackgroundColorIndex,
  ] = useState(0);

  useEffect(() => {
    (props.editMode || props.editMode === 0) &&
      openAtLastSelectedIndex(props.editMode);
  }, [props.editMode]);

  /**
   * When toogling between sliders, it will always open the slider at the correct index.
   * @method openAtLastSelectedIndex
   **/
  function openAtLastSelectedIndex(index?: number) {
    if (index === 0) {
      carousel.current.snapToItem(currentFontIndex);
    } else if (index === 1) {
      carousel.current.snapToItem(currentColorIndex);
    } else {
      carousel.current.snapToItem(currentBackgroundColorIndex);
    }
  }

  /**
   * Updates the font in parent component when slider has changed index
   * @method onSnapToItem
   **/
  function onSnapToItem(index: number) {
    setActiveItem(index);
    if (activeItemToolBar[0] === activeItemToolBar[props.editMode]) {
      props.itemFontIndex(index);
      setCurrentFontIndex(index);
    } else if (activeItemToolBar[1] === activeItemToolBar[props.editMode]) {
      props.itemColorIndex(index);
      setCurrentColorIndex(index);
    } else {
      props.itemBackgroundColorIndex(index);
      setCurrentBackgroundColorIndex(index);
    }
    VibrationPattern.doHapticFeedback();
  }

  /**
   * When clicking on a nonActive item, it snaps the slider to its index
   * @method snapToNonActiv
   **/
  function snapToNonActive(index: number) {
    carousel.current.snapToItem(index);
  }

  /**
   * Gets the data for the font palette and the color palette
   * @method getSliderData
   **/
  function getSliderData() {
    if (activeItemToolBar[0] === activeItemToolBar[props.editMode]) {
      return fontData;
    } else if (activeItemToolBar[1] === activeItemToolBar[props.editMode]) {
      return colorData;
    } else {
      return backgroundColorData;
    }
  }

  /**
   * Change textStyle of active item
   * @method compileActiveItemTextStyle
   **/
  function compileActiveItemTextStyle(index: number) {
    let textStyle = styles.textItem;
    if (activeItem === index) {
      textStyle = {
        ...textStyle,
        ...{
          color: Globals.color.brand.primary,
          fontFamily: fontDataStyles[index],
        },
      };
    } else {
      textStyle = {
        ...textStyle,
        ...{
          fontFamily: fontDataStyles[index],
        },
      };
    }
    return textStyle;
  }

  /**
   * Change icon background color
   * @method compileIconColorBackgroundStyle
   **/
  function compileIconColorBackgroundStyle(item: any, index: number) {
    let backgroundStyle = styles.focusedIcon;
    backgroundStyle = {
      ...backgroundStyle,
      ...{
        backgroundColor: item,
      },
    };
    return backgroundStyle;
  }

  function renderItem({ item, index }) {
    return (
      <TouchableWithoutFeedback
        style={styles.itemContainer}
        onPress={() => snapToNonActive(index)}
        hitSlop={Globals.dimension.hitSlop.regular}>
        {activeItemToolBar[0] === activeItemToolBar[props.editMode] ? (
          <View style={styles.focusedIcon}>
            <Text style={compileActiveItemTextStyle(index)}>{item}</Text>
          </View>
        ) : (
          <View style={compileIconColorBackgroundStyle(item, index)} />
        )}
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <Carousel
        ref={carousel}
        data={getSliderData()}
        renderItem={renderItem}
        sliderWidth={sliderWidth}
        itemWidth={itemWidth}
        enableSnap={true}
        onSnapToItem={(index) => onSnapToItem(index)}
        inactiveSlideOpacity={0.7}
        inactiveSlideScale={0.8}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}
      />
    </View>
  );
}
const sliderWidth = Dimensions.get('window').width;
const itemWidth = 50;
const styles = StyleSheet.create({
  carouselContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Globals.dimension.padding.mini,
  },
  itemContainer: {
    width: '100%',
    alignItems: 'center',
  },
  focusedIcon: {
    width: 35,
    height: 35,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Globals.color.background.light,
    backgroundColor: Globals.color.brand.neutral5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textItem: {
    color: Globals.color.text.default,
    fontSize: Globals.font.size.medium,
  },
});
