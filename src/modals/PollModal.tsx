import React from 'react';
import Modal from '../component-library/Modal';
import {
  Image,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Globals from '../component-library/Globals';
import { close_icon_black } from '../component-library/graphics/Images';
import VoteOnPoll from '../component-library/Poll/VoteOnPoll';
import { ChatRoomInterface } from '../services/api/ChatRoomManager';

interface Props {
  openModal: boolean;
  currentRoom: ChatRoomInterface;
  toogleModal: () => void;
  onClose: () => void;
}
export default function PollModal(props: Props) {
  /**
   * Toogle the modal after 2 seconds
   * @function toogleModal
   */
  function toogleModal() {
    setTimeout(() => props.toogleModal(), 2000);
  }

  function renderPollModal() {
    return (
      <Modal
        key="inviteFriendModal"
        isVisible={props.openModal}
        modalheightType={'modal2'}
        onClosed={() => props.onClose()}
        placement="bottom">
        <View style={styles.container}>
          <Text style={styles.chatTitle}>{props.currentRoom.message}</Text>
          <VoteOnPoll
            data={props.currentRoom.votes}
            roomId={props.currentRoom.id}
            color_1={props.currentRoom.color_1}
            color_2={props.currentRoom.color_2}
            hasVoted={props.currentRoom.is_voted}
            onchoiceSelect={() => toogleModal()}
          />
        </View>
      </Modal>
    );
  }

  return renderPollModal();
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
    width: '100%',
    height: '100%',
  },
  modalWrapper: {
    borderTopLeftRadius: Globals.dimension.borderRadius.large,
    borderTopRightRadius: Globals.dimension.borderRadius.large,
    backgroundColor: Globals.color.background.light,
    shadowColor: '#B3B6B9',
    shadowOffset: { width: 0, height: -7 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
  },
  closeContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: Globals.dimension.padding.mini,
  },
  closeIconWrapper: {
    padding: Globals.dimension.padding.mini,
  },
  closeButton: {
    width: 15,
    height: 15,
  },
  chatTitle: {
    fontSize: 25,
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    paddingHorizontal: Globals.dimension.padding.medium,
    paddingVertical: Globals.dimension.padding.mini,
    lineHeight: 25,
  },
});
