import React from 'react';
import ModalBox from 'react-native-modalbox';
import {StyleSheet, View, Platform, Dimensions, SafeAreaView} from 'react-native';
import Globals from './Globals';

interface Props {
  isVisible: boolean;
  modalheightType?: 'fullModal' | 'modal1' | 'modal2' | 'modal3' | 'modal4';
  placement?: 'bottom' | 'center' | null;
  hideCloseButton?: boolean;
  backgroundImage?: any;
  onClosed?: () => void;
  children?: any;
}

export default function Modal(props: Props) {
  const {
    children,
    placement,
    isVisible,
    hideCloseButton,
    onClosed,
    modalheightType,
    backgroundImage,
  } = props;

  function compileWrapperStyles() {
    let wrapperStyles: any = styles.modalWrapper;
    switch (modalheightType) {
      case 'modal1':
        wrapperStyles = {
          ...wrapperStyles,
          ...styles.modal1,
        };
        break;
      case 'modal2':
        wrapperStyles = {
          ...wrapperStyles,
          ...styles.modal2,
        };
        break;
      case 'modal3':
        wrapperStyles = {
          ...wrapperStyles,
          ...styles.modal3,
        };
        break;
      case 'modal4':
        wrapperStyles = {
          ...wrapperStyles,
          ...styles.modal4,
        };
        break;
      case 'fullModal':
        wrapperStyles = {
          ...wrapperStyles,
          ...styles.fullModal,
        };
        break;
    }
    return wrapperStyles;
  }

  function compileChildrenWrapper() {
    let wrapperStyle = styles.childrenWrapper;
    if (placement === 'center') {
      wrapperStyle = {
        ...wrapperStyle,
        ...styles.centerModal,
      };
    }
    return wrapperStyle;
  }

  const defaultProps = {
    swipeToClose: true,
    coverScreen: Platform.OS === 'ios',
    useNativeDriver: Platform.OS !== 'ios',
    position: placement ? placement : 'center',
    backdropPressToClose: true,
    swipeArea: 50,
  };
  return (
    <SafeAreaView style={styles.modalContainer}>
      <ModalBox
        useNativeDriver
        style={compileWrapperStyles()}
        {...defaultProps}
        isOpen={isVisible}
        onClosed={() => onClosed && onClosed()}>
        <View style={compileChildrenWrapper()}>
          {backgroundImage ? backgroundImage : null}
          {!hideCloseButton ? <View style={styles.closeButton}/> : null}
          {children}
        </View>
      </ModalBox>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
  },
  modalWrapper: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
  },
  fullModal: {
    // height: Dimensions.get('window').height,
  },
  modal1: {
    height: Dimensions.get('window').height * 0.9,
  },
  modal2: {
    height: Dimensions.get('window').height * 0.75,
  },
  modal3: {
    height: Dimensions.get('window').height * 0.55,
  },
  modal4: {
    height: Dimensions.get('window').height * 0.35,
  },
  childrenWrapper: {
    borderTopEndRadius: Globals.dimension.borderRadius.small,
    borderTopStartRadius: Globals.dimension.borderRadius.small,
    justifyContent: 'center',
    backgroundColor: Globals.color.background.light,
    paddingBottom: Globals.dimension.padding.large,
  },
  centerModal: {
    marginHorizontal: Globals.dimension.margin.mini,
    paddingBottom: null,
    borderBottomEndRadius: Globals.dimension.borderRadius.small,
    borderBottomStartRadius: Globals.dimension.borderRadius.small,
  },
  wrapperBottom: {
    justifyContent: 'flex-end',
  },
  closeButton: {
    width: 40,
    height: 6,
    borderRadius: 100,
    backgroundColor: Globals.color.background.grey,
    alignSelf: 'center',
    marginTop: Globals.dimension.margin.mini,
  },
});
