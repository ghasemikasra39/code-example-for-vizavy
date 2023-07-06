import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Dimensions } from 'react-native';
import Globals from '../component-library/Globals';
import ModalBox from 'react-native-modalbox';
import HapticFeedBackWrapper from '../component-library/HapticFeedBackWrapper';
import { Picker } from '@react-native-picker/picker';

interface PickerInterface {
  label: any;
  value: any;
}
//--> EG: [{label: test, value : test}]

interface Props {
  optionsList: Array<PickerInterface>;
  selectedValue: any;
  openModal: boolean;
  onDone: (value) => void;
  onClosed: () => void;
}

const defaultProps = {
  swipeToClose: true,
  coverScreen: Platform.OS === 'ios',
  useNativeDriver: Platform.OS !== 'ios',
  position: 'bottom',
  backdropPressToClose: true,
  swipeArea: 50,
};

export default function PickerModal(props: Props) {
  const { openModal, onClosed, onDone, optionsList, selectedValue } = props;
  const [value, setValue] = useState(optionsList[0]?.value);

  useEffect(() => {
    if (selectedValue) {
      setValue(selectedValue);
    }
  }, [selectedValue]);

  function finish() {
    onDone(value);
  }

  function updateGender(itemValue) {
    setValue(itemValue);
  }

  function displayOptions() {
    return optionsList.map((item) => (
      <Picker.Item label={item.label} value={item.value} />
    ));
  }

  return (
    <View style={styles.modalContainer}>
      <ModalBox
        useNativeDriver
        style={styles.modalWrapper}
        {...defaultProps}
        isOpen={openModal}
        onClosed={() => onClosed && onClosed()}>
        <View style={styles.actionContainer}>
          <HapticFeedBackWrapper
            hitSlop={Globals.dimension.hitSlop.regular}
            onPress={finish}>
            <Text style={styles.done}>Done</Text>
          </HapticFeedBackWrapper>
        </View>
        <View style={styles.modalWrapper}>
          <Picker selectedValue={value} onValueChange={updateGender}>
            {displayOptions()}
          </Picker>
        </View>
      </ModalBox>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: 'absolute',
  },
  modalWrapper: {
    height: Dimensions.get('window').height * 0.45,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: Globals.dimension.padding.mini,
    backgroundColor: Globals.color.background.light,
    paddingVertical: Globals.dimension.padding.mini,
    borderBottomWidth: 1.5,
    borderBottomColor: Globals.color.background.mediumgrey,
  },
  done: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.button.blue,
  },
});
