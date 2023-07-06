import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import Modal from '../component-library/Modal';
import Globals from '../component-library/Globals';
import Button from '../component-library/Button';

interface Props {
  toggleConfirmCancelModal?: () => void;
  showConfirmCancelModal: boolean;
  onConfirm: () => void;
  title?: string;
  text?: string;
  confirmText: string;
  cancelText: string;
  icon?: any;
  myKey?: string;
  successTitle?: string;
  loading: boolean;
}

export default function ConfirmCancelModal(props: Props) {
  const {
    showConfirmCancelModal,
    successTitle,
    loading,
    icon,
    title,
    text,
    confirmText,
    cancelText,
    toggleConfirmCancelModal,
    onConfirm,
  } = props;
  return (
    <Modal
      placement="center"
      hideCloseButton
      isVisible={showConfirmCancelModal}>
      <View style={styles.container}>
        {icon ? <View style={styles.iconWrapper}>{icon}</View> : null}
        <Text style={styles.titleText}>{title}</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator/>
          </View>
        ) : null}
        {successTitle ? (
          <Text style={styles.loading}>{successTitle}</Text>
        ) : null}
        <Text style={styles.mainText}>{text}</Text>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title={cancelText}
              key="CancelButton"
              onPress={() => toggleConfirmCancelModal()}
              translucent={true}
              unremarkableButtonSecondChoice={true}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={confirmText}
              key="ConfirmButton"
              onPress={() => onConfirm()}
              wrapStyle={styles.openButtonWrap}
              translucent={true}
              unremarkableButtonFirstChoice={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: Globals.dimension.padding.mini,
  },
  modalWrapper: {
    borderTopLeftRadius: Globals.dimension.borderRadius.large,
    borderTopRightRadius: Globals.dimension.borderRadius.large,
    backgroundColor: Globals.color.background.light,
    shadowColor: '#B3B6B9',
    shadowOffset: {width: 0, height: -7},
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },
  titleText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.margin.medium,
    marginBottom: Globals.dimension.margin.tiny,
    textAlign: 'center',
  },
  mainText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.margin.medium,
    marginBottom: Globals.dimension.margin.tiny,
    textAlign: 'center',
  },
  buttonShadow: {
    backgroundColor: '#C4C4C4',
    borderRadius: Globals.dimension.borderRadius.large,
    elevation: 15,
  },
  openButtonWrap: {
    marginHorizontal: 0,
    zIndex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    paddingVertical: Globals.dimension.padding.tiny * 0.5,
    borderTopWidth: 0.3,
    borderTopColor: 'rgba(154,154,154, 0.5)',
  },
  buttonWrapper: {
    flex: 1,
  },
  loading: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny,
  },
  loadingContainer: {
    marginBottom: Globals.dimension.margin.tiny,
  },
  iconWrapper: {
    marginBottom: Globals.dimension.margin.tiny,
  }
});
