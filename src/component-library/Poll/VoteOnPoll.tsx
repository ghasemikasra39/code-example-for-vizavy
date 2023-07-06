import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
} from 'react-native';
import Globals from '../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import PollItem from './PollItem';
import { actionCreators } from '../../store/actions';
import { useDispatch } from 'react-redux';

interface Props {
  data: any;
  roomId: number;
  color_1: string;
  color_2: string;
  hasVoted: boolean;
  onchoiceSelect: () => void;
}

export default function VoteOnPoll(props: Props) {
  const dispatch = useDispatch();

  function choiceSelected() {
    const action = actionCreators.chatRoom.updatePollStatus({
      room_id: props.roomId,
    });
    dispatch(action);
    props.onchoiceSelect();
  }

  function totalVotes() {
    return props.hasVoted ? (
      <View style={styles.countContainer}>
        <Text style={styles.count}>
          {props.data[0].total_count}{' '}
          {props.data[0].total_count === '1' ? 'Vote' : 'Votes'}
        </Text>
      </View>
    ) : null;
  }


  return (
    <View style={styles.pollContainer}>
      <FlatList
        data={props.data}
        renderItem={({ item, index }) => (
          <PollItem
            item={item}
            roomId={props.roomId}
            colorData={[props.color_1, props.color_2]}
            onChoiceSelected={() => choiceSelected()}
            hasVoted={props.hasVoted}
          />
        )}
        ListFooterComponent={totalVotes()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  pollContainer: {
    width: Dimensions.get('window').width * 0.9,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
  pollWrapper: {
    width: '100%',
    height: 50,
    borderRadius: Globals.dimension.borderRadius.tiny,
    marginVertical: Globals.dimension.margin.tiny,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.brand.accent5,
  },
  descriptionContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: Globals.dimension.borderRadius.tiny * 0.8,
    backgroundColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  countContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  count: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
});
