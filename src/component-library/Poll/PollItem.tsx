import React, { useEffect, useMemo, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Globals from '../Globals';
import { LinearGradient } from 'expo-linear-gradient';
import ChatRoomManager from '../../services/api/ChatRoomManager';

interface Props {
  item: any;
  roomId: number;
  colorData: any;
  onChoiceSelected: () => void;
  hasVoted: boolean;
}

export default function PollItem(props: Props) {
  const [creatingVote, setCreatingVote] = useState(false);

  async function vote(selectedOption: number) {
    setCreatingVote(true);
    ChatRoomManager.vote(props.roomId, selectedOption)
      .then(() => {
        props.onChoiceSelected();
        setCreatingVote(false);
      })
      .catch((err) => {
        setCreatingVote(false);
      });
  }

  function calculateScore() {
    const { item } = props;
    const count = Number(item.count);
    const total_count = Number(item.total_count);
    if (!props.hasVoted) return;
    if (total_count) {
      const percentageVoted = Number(count / total_count);
      return Number(percentageVoted.toFixed(2));
    } else {
      return 0;
    }
  }

  function compileTextColorStyle() {
    let textColor = styles.description;
    if (!props.hasVoted) {
      textColor = {
        ...textColor,
        color: props.colorData[1],
      };
    }
    return textColor;
  }

  function compileCounterTextColorStyle() {
    let counterColor = styles.counter;
    if (props.hasVoted) {
      counterColor = {
        ...counterColor,
        ...{
          color: props.hasVoted
            ? props.colorData[1]
            : Globals.color.text.default,
          opacity: 1,
        },
      };
    }
    return counterColor;
  }

  function compileCounterContainerBackgroundStyle() {
    let containerColor = styles.counterWrapper;
    if (props.hasVoted) {
      containerColor = {
        ...containerColor,
        ...{
          backgroundColor: Globals.color.background.light,
        },
      };
    }
    return containerColor;
  }

  const { item, colorData } = props;
  const progressPercentage = Math.floor(calculateScore() * 100);
  const progressWidth = {
    width: progressPercentage.toString() + '%',
  };
  const renderPollItem = useMemo(
    () => (
      <TouchableOpacity
        style={styles.pollContainer}
        onPress={() => vote(item.id)}
        disabled={props.hasVoted}>
        <LinearGradient colors={colorData} style={styles.progressBarContainer}>
          <View style={styles.progressContainerBackground}>
            <LinearGradient
              colors={colorData}
              style={[styles.progressBar, progressWidth]}
            />
          </View>
        </LinearGradient>

        <View style={styles.row}>
          <View style={styles.descriptionWrapper}>
            <View style={styles.descriptionBody}>
              <Text style={compileTextColorStyle()}>
                {item.id}. {item.text}
              </Text>
            </View>
          </View>

          <View style={compileCounterContainerBackgroundStyle()}>
            {!creatingVote ? (
              props.hasVoted ? (
                <Text style={compileCounterTextColorStyle()}>
                  {progressPercentage}
                </Text>
              ) : null
            ) : (
              <ActivityIndicator />
            )}

            <Text style={compileCounterTextColorStyle()}>%</Text>
          </View>
        </View>
      </TouchableOpacity>
    ),
    [
      compileTextColorStyle,
      compileCounterTextColorStyle,
      calculateScore,
      creatingVote,
      props.item,
      props.hasVoted,
    ],
  );

  return renderPollItem;
}

const styles = StyleSheet.create({
  pollContainer: {
    width: Dimensions.get('window').width * 0.9,
    marginBottom: Globals.dimension.margin.tiny,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    position: 'absolute',
    paddingHorizontal: Globals.dimension.padding.tiny,
  },
  descriptionWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  descriptionBody: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 100,
    paddingVertical: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  counterWrapper: {
    flex: 0.2,
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 100,
    padding: Globals.dimension.padding.tiny,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  counter: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    textAlign: 'center',
    opacity: 0,
  },
  progressBarContainer: {
    height: 42,
    width: Dimensions.get('screen').width * 0.9,
    padding: 2,
    borderRadius: 7,
    overflow: 'hidden',
    backgroundColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainerBackground: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    alignSelf: 'flex-start',
  },
});
