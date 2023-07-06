import React, { useState } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import Globals from '../../component-library/Globals';
import HapticFeedBackWrapper from '../../component-library/HapticFeedBackWrapper';
import moment from 'moment';
import DatePickerModal from '../../modals/DatePickerModal';
import PickerModal from '../../modals/PickerModal';

interface Props {
  dateOfBirth: any;
  gender: string;
  updateDateOfBirth: (dateOfBirth: string) => void;
  updateGender: (gender: string) => void;
}

export default function EditAgeGenderComponent(props: Props) {
  const { dateOfBirth, gender, updateDateOfBirth, updateGender } = props;
  const [openDatePicker, setOpenDatePicker] = useState(false);
  const [openGenderPicker, setOpenGenderPicker] = useState(false);
  const GENDER_OPTIONS = [
    { label: 'Female', value: 'Female' },
    { label: 'Male', value: 'Male' },
    {
      label: 'Not Specified',
      value: 'Not Specified',
    },
  ];

  function formateDateOfBirth() {
    let date;
    if (dateOfBirth) {
      date = moment(dateOfBirth).format('MMMM Do YYYY');
    } else {
      date = 'Birthdate';
    }
    return date;
  }

  function compileLabelStyle(label) {
    let textStyle = styles.label;
    if (!label) {
      textStyle = {
        ...textStyle,
        color: Globals.color.text.grey,
      };
    }
    return textStyle;
  }

  function passUpDateOfBirth(selectedDOB: string) {
    toggleDatePicker();
    updateDateOfBirth(selectedDOB);
  }

  function passUpGender(gender: string) {
    updateGender(gender);
    toggleGenderPicker();
  }

  function toggleDatePicker() {
    setOpenDatePicker(!openDatePicker);
  }

  function toggleGenderPicker() {
    setOpenGenderPicker(!openGenderPicker);
  }

  function renderDateOfBirth() {
    return (
      <View>
        <HapticFeedBackWrapper onPress={toggleDatePicker}>
          <View style={styles.ageGenderContainer}>
            <View style={styles.datePickerContainer}>
              <Text style={compileLabelStyle(dateOfBirth)}>
                {formateDateOfBirth()}
              </Text>
            </View>
          </View>
        </HapticFeedBackWrapper>

        <DatePickerModal
          dateOfBirth={dateOfBirth}
          openModal={openDatePicker}
          onDone={passUpDateOfBirth}
          onClosed={() => setOpenDatePicker(false)}
        />
      </View>
    );
  }

  function renderGender() {
    function getGenderText() {
      if (gender) {
        return gender;
      }
      return 'Gender';
    }

    return (
      <View>
        <HapticFeedBackWrapper onPress={toggleGenderPicker}>
          <View style={styles.ageGenderContainer}>
            <View style={styles.datePickerContainer}>
              <Text style={compileLabelStyle(gender)}>{getGenderText()}</Text>
            </View>
          </View>
        </HapticFeedBackWrapper>
        <PickerModal
          optionsList={GENDER_OPTIONS}
          selectedValue={gender}
          openModal={openGenderPicker}
          onDone={passUpGender}
          onClosed={() => setOpenGenderPicker(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.conatiner}>
      <Text style={styles.title}>A few things about you</Text>
      <View style={styles.wrapper}>
        {renderDateOfBirth()}
        {renderGender()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  conatiner: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.medium,
  },
  collabsableContainer: {
    marginBottom: Globals.dimension.margin.tiny,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  wrapper: {
    marginTop: Globals.dimension.margin.small,
    width: '100%',
  },
  dateTimePickerContainer: {
    marginBottom: Globals.dimension.margin.medium,
  },
  ageGenderContainer: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.borderRadius.tiny,
    marginBottom: Globals.dimension.margin.mini,
    borderBottomWidth: 1,
    borderBottomColor: Globals.color.text.lightgrey,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.tiny,
  },
  label: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.headline,
    color: Globals.color.text.default,
  },
});
