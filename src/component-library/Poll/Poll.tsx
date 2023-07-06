import React, { useEffect, useMemo } from 'react';
import { StyleSheet, View, Dimensions, Image, FlatList } from 'react-native';
import Globals from '../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import { close_icon } from '../graphics/Images';
import collect from 'collect.js';
import PollTextInput from './PollTextInput';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';

interface Props {
  colors?: any;
  pollData?: any;
  updatePollData: (data: any) => void;
  focus?: boolean;
}

export default function Poll(props: Props) {
  useEffect(() => {}, [props.pollData, props.updatePollData]);

  function addChoice() {
    const newPollData = [...props.pollData];
    newPollData.push({
      id: props.pollData.length + 1,
      text: '',
    });
    props.updatePollData(newPollData);
  }

  function deleteChoice(index: number) {
    const collection = collect(props.pollData);
    collection.splice(index, 1);
    props.updatePollData(collection.all());
  }

  function updateText(text: string, index: number) {
    for (var i in props.pollData) {
      props.pollData[index].text = text;
      break;
    }
    props.updatePollData([...props.pollData]);
  }

  const renderAddChoice = useMemo(
    () => (
      <View style={styles.addChoiceContainer}>
        {props.pollData.length < 4 ? (
          <HapticFeedBackWrapper
            onPress={addChoice}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <View style={styles.addChoiceIconContainer}>
              <LinearGradient
                colors={props.colors}
                style={styles.addChoiceIconWrapper}>
                <Image source={close_icon} style={styles.addChoiceicon} />
              </LinearGradient>
            </View>
          </HapticFeedBackWrapper>
        ) : null}
      </View>
    ),
    [props.pollData, props.colors],
  );

  function renderPollItem({ item, index }) {
    return (
      <PollTextInput
        colors={props.colors}
        item={item}
        index={index}
        dataLength={props.pollData.length}
        deleteChoice={(index) => deleteChoice(index)}
        updateText={(text, index) => updateText(text, index)}
        focus={props.focus}
      />
    );
  }

  const renderPoll = useMemo(
    () => (
      <FlatList
        data={props.pollData}
        renderItem={renderPollItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderAddChoice}
        keyboardDismissMode={'none'}
        keyboardShouldPersistTaps={'always'}
        contentContainerStyle={styles.flatListContainer}
      />
    ),
    [props.pollData, updateText, props.pollData.length, props.focus],
  );

  return renderPoll;
}

const styles = StyleSheet.create({
  pollContainer: {
    flexDirection: 'row',
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  textInpuContainer: {
    flex: 6,
    height: 50,
    borderRadius: Globals.dimension.borderRadius.tiny,
    marginVertical: Globals.dimension.margin.tiny,
    padding: 2,
  },
  textInput: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: Globals.dimension.borderRadius.tiny * 0.8,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  addChoiceContainer: {
    height: 50,
    width: Dimensions.get('window').width,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  addChoiceIconContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    overflow: 'hidden',
  },
  addChoiceIconWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChoiceicon: {
    width: 25,
    height: 25,
    right: 2,
    top: 2,
    transform: [{ rotate: '45deg' }],
  },
  flatListContainer: {
    paddingVertical: Globals.dimension.padding.mini,
  },
});
