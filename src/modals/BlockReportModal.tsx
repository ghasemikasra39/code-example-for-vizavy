import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Globals from '../component-library/Globals';
import Modal from '../component-library/Modal';
import Checkbox from '../component-library/Checkbox';
import Button from '../component-library/Button';
import { PaperPlaneInterface } from '../services/api/PaperPlaneManager';
import { FlatList } from 'react-native-gesture-handler';

interface Props {
  paperPlane?: PaperPlaneInterface;
  onConfirm: (reasons) => void;
  onCancel: () => void;
  confirmButtonText?: string;
  cancelButtontext?: string;
  showBlockReportModal: boolean;
  loading?: boolean;
  loadingFinishedTitle?: string;
}

const data = [
  'Inappropriate content',
  'Rude or abusive',
  'Spam or scam',
  'Minor (under 18 years old)',
];

export default function BlockReportModal(props: Props) {
  const [reasons, setReasons] = useState([]);

  function onCheckboxPress(reason) {
    let selectedReason = [...reasons];
    selectedReason.indexOf(reason) === -1
      ? selectedReason.push(reason)
      : selectedReason.splice(selectedReason.indexOf(reason), 1);
    setReasons(selectedReason);
  }


  function renderItem({ item }) {
    return <Checkbox title={item} onCheckboxPress={onCheckboxPress} />;
  }

  return (
    <Modal
      key="blockReportModal"
      isVisible={props.showBlockReportModal}
      paddingless
      hideCloseButton
      placement="center">
      <View>
        <Text style={styles.reportBlockText}>Report/Block</Text>
        <View style={styles.loadingContainer}>
          {props.loading ? <ActivityIndicator /> : null}
          {props.loadingFinishedTitle ? (
            <Text style={styles.reportSuccess}>
              {props.loadingFinishedTitle}
            </Text>
          ) : null}
        </View>

        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.key}
          scrollEnabled={false}
        />
        <View style={styles.buttonContainer}>
          <View style={styles.buttonWrapper}>
            <Button
              title={
                props.confirmButtonText ? props.confirmButtonText : 'Confirm'
              }
              primary
              key="confirmButton"
              onPress={() => props.onConfirm(reasons)}
              disabled={!reasons.length}
              translucent={true}
              unremarkableButtonFirstChoice={true}
            />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title={props.cancelButtontext ? props.cancelButtontext : 'Cancel'}
              key="cancelButton"
              onPress={() => props.onCancel()}
              wrapStyle={{ zIndex: 1 }}
              translucent={true}
              unremarkableButtonSecondChoice={true}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  reportBlockText: {
    marginTop: Globals.dimension.margin.mini,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    textAlign: 'center',
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.medium,
  },
  blockText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginLeft: 20,
  },
  shadowAndroid: {
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.borderRadius.large,
    elevation: 15,
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  reportSuccess: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    padding: Globals.dimension.padding.tiny
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    paddingVertical: Globals.dimension.padding.tiny * 0.5,
    borderTopWidth: 2,
    borderTopColor: Globals.color.background.lightgrey,
  },
  buttonWrapper: {
    flex: 1,
  },
});
