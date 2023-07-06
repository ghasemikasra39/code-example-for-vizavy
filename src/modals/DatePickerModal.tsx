import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Platform, Dimensions } from 'react-native';
import Globals from '../component-library/Globals';
import ModalBox from 'react-native-modalbox';
import HapticFeedBackWrapper from '../component-library/HapticFeedBackWrapper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { formatDateToMilliseconds } from '../screens/ChatRoom/ChatroomUtils';


interface Props {
  dateOfBirth: string;
  openModal: boolean;
  onDone: (date) => void;
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
export default function DatePickerModal(props: Props) {
  const { openModal, onClosed, onDone, dateOfBirth } = props;
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    if (dateOfBirth) {
      const newDate = formatDateToMilliseconds(dateOfBirth);
      setDate(new Date(newDate));
    }
  },[dateOfBirth])

  
  function finish() {
    onDone(date);
  }

  function updateDate(event) {
    const { timestamp } = event.nativeEvent;
    const newDate = new Date(timestamp);
    setDate(newDate);
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
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={'date'}
            display={'spinner'}
            onChange={updateDate}
          />
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
  contentWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
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
