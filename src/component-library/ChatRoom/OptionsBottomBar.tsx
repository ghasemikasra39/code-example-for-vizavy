import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  View,
  Dimensions,
} from 'react-native';
import Globals from '../Globals';
import ChatRoomManager, {
  ChatRoomInterface,
} from '../../services/api/ChatRoomManager';
import { UserProfilePropsInterface } from '../../store/slices/UserProfileSlice';
import SlideIn from '../../Animated Hooks/SlideIn';
import ReactionsComponent from './ReactionsComponent';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import FlyingUpEmojiesList from './FlyingEmojies/FlyingUpEmojiesList';
import FadeOut from '../../Animated Hooks/FadeOut';
import DirectChatsManager from '../../services/api/DirectChatsManager';

interface Props {
  toggleOptionsBottomBar: () => void;
  onPress: () => void;
  currentRoom: ChatRoomInterface;
  selectedMessage: any;
  userProfile: UserProfilePropsInterface;
  submitReactions: boolean;
  directChatroom: boolean;
}

export default function OptionsBottomBar(props: Props) {
  const [reactionsArray, setReactionsArray] = useState([]);
  const [emojieArray, setEmojieArray] = useState([]);
  const [hasReacted, setHasReacted] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [showOptionsBar, setShowOptionsBar] = useState(false);
  const {
    currentRoom,
    toggleOptionsBottomBar,
    onPress,
    selectedMessage,
    userProfile,
    directChatroom,
  } = props;

  useEffect(() => {
    if (selectedMessage) {
      setShowReactions(true);
      setShowOptionsBar(true);
      getReactedStatus();
    } else {
      reset();
    }
  }, [selectedMessage]);

  async function getReactedStatus() {
    if (!directChatroom) {
      ChatRoomManager.checkReactionStatus(selectedMessage?.id).then(
        (response) => {
          setHasReacted(response.is_reacted);
        },
      );
    }
  }

  function postReactions(newreactionArray) {
    if (newreactionArray?.length === 0) return;
    if (directChatroom) {
      DirectChatsManager.postReactions(newreactionArray);
    } else {
      ChatRoomManager.postReactions(newreactionArray);
    }
    setReactionsArray([]);
  }

  function closeOptionsBottombar() {
    toggleOptionsBottomBar();
  }

  function animateOutOptionsBottombar() {
    const newreactionArray = Object.values(reactionsArray);
    setShowReactions(false);
    setFadeOut(true);
    postReactions(newreactionArray);
    updateMessageReactionRedux(newreactionArray);
  }

  function updateMessageReactionRedux(newreactionArray) {
    let action;
    if (directChatroom) {
      action = actionCreators.directChat.updateMessageReactions({
        reactions: newreactionArray,
        message: selectedMessage,
      });
    } else {
      action = actionCreators.chatRoom.updateMessageReactions({
        reactions: newreactionArray,
        message: selectedMessage,
        hasReacted: hasReacted,
      });
    }
    store.dispatch(action);
  }

  function onPressReactions(item) {
    let emojieObject = {};
    let newEmojieArray = [...emojieArray];
    const count = reactionsArray[item]?.count
      ? (reactionsArray[item].count += 1)
      : 1;
    if (directChatroom) {
      emojieObject = {
        emoji: item,
        direct_chat_message_id: selectedMessage?.id,
        count,
      };
    } else {
      emojieObject = {
        emoji: item,
        chat_room_message_id: selectedMessage?.id,
        count,
      };
    }
    reactionsArray[item] = emojieObject;
    newEmojieArray.push(emojieObject);
    setEmojieArray(newEmojieArray);
    setReactionsArray(reactionsArray);
  }

  function reset() {
    setReactionsArray([]);
    setEmojieArray([]);
    setHasReacted(false);
    setShowOptionsBar(false);
    setFadeOut(false);
    setShowReactions(false);
  }

  return showOptionsBar ? (
    <SafeAreaView style={styles.optionsBottomBarContainer}>
      <FadeOut
        start={fadeOut}
        style={styles.flyingUpEmojiContainer}
        done={closeOptionsBottombar}
        duration={200}>
        <FlyingUpEmojiesList reactions={emojieArray} />
      </FadeOut>

      <View
        style={styles.closeViewContainer}
        onTouchStart={animateOutOptionsBottombar}
      />
      <ReactionsComponent
        showReactions={showReactions}
        onEmojiPressed={onPressReactions}
      />
      <SlideIn
        style={styles.optionsBottomBar}
        duration={200}
        slideOffset={100}
        slideDirection={'vertical'}
        fadeIn={showReactions}>
        {!directChatroom && (
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.reportText}>
              {currentRoom.app_user.id !== userProfile.id
                ? `Report ${selectedMessage?.app_user?.name}`
                : `Remove ${selectedMessage?.app_user?.name}`}
            </Text>
          </TouchableOpacity>
        )}
      </SlideIn>
    </SafeAreaView>
  ) : null;
}

const styles = StyleSheet.create({
  optionsBottomBarContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    position: 'absolute',
  },
  closeViewContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  optionsBottomBar: {
    width: '100%',
    alignItems: 'flex-end',
    backgroundColor: Globals.color.background.light,
    paddingVertical: Globals.dimension.padding.tiny,
  },
  flyingUpEmojiContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  reportWrapper: {
    borderRadius: 100,
    borderColor: Globals.color.text.default,
    borderWidth: 1,
  },
  reportText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.default,
    padding: Globals.dimension.padding.mini,
  },
});
