import React from 'react';
import { store } from '../../store';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { Dimensions, StyleSheet } from 'react-native';
import { doReUpload } from '../../store/slices/ChatRoomsSlice';
import moment from 'moment';
import collect from 'collect.js';
import Globals from '../../component-library/Globals';

export type CommentListNavigationProp = StackNavigationProp<
  AppStackParamList,
  'CommentsScreen'
>;
export type CommentListRouteProp = RouteProp<
  AppStackParamList,
  'CommentsScreen'
>;

export const windowWidth = Dimensions.get('window').width;

export const mapStateToProps = ({
  userProfile,
  chatRoom,
  netInfo,
  appStatus,
  directChat,
}) => ({
  userProfile,
  chatRoom,
  netInfo,
  appStatus,
  directChat,
});

/**
 * Find the index of a message in the list given the id of the message
 * @function findMessageIndex
 * @param {Number} messageId - the id of a message
 * @param {Reference} messagesRef - the reference to the messages
 * @returns {Number} - the index of the given message
 */
export function findMessageIndex(messageId, messagesRef) {
  return messagesRef.current.findIndex((message) => {
    return message.id == messageId;
  });
}

/**
 * Dispatch the re-upload action
 * @function handleFailedMessageReUpload
 * @param failedMessage
 */
export function handleFailedMessageReUpload(failedMessage) {
  store.dispatch(doReUpload(failedMessage));
}

/**
 * Scroll to a message given its index
 * @function scrollToIndex
 * @param {Number} index - the index of the target message
 * @param {Reference} flatListRef - the reference to the Flatlist
 */
export function scrollToIndex(index, flatListRef) {
  // TODO:sometimes flatListRef.current is null, need further investigation
  if (index == -1 || flatListRef.current === null) return;
  flatListRef.current.scrollToIndex({
    index: index,
    viewPosition: 0,
  });
}

/**
 * Scroll to the end of the list
 * @function scrollToEnd
 */
export function scrollToEnd(flatListRef) {
  setTimeout(() => {
    // TODO:sometimes flatListRef.current is null, need further investigation
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
  }, 10);
}

/**
 * Flatten/unroll (one level deep) the messages given unflattened messages
 * @function makeFlatMessageArray
 * @param {Object Array} messages - array of message objects
 * @param {Array} newArray - an empty array to be populated
 * @returns {Object Array} newArray - a new array containing one level deep messages
 */
export function makeFlatMessageArray(messages, newArray) {
  if (messages)
    messages.forEach((message) => {
      newArray.push(message);
      if (message.replies && message.replies.length > 0) {
        newArray = makeFlatMessageArray(message.replies, newArray);
      }
    });

  return newArray;
}

/**
 * Clear the text input value
 * @function clearTextInput
 * @param {Reference} textInput - the reference to the TextInput
 */
export function clearTextInput(textInput) {
  textInput.current?.clear();
}

/**
 * Focus the text input
 * @function focusTextInput
 * @param {Reference} textInput - the reference to the TextInput
 */
export function focusTextInput(textInput) {
  textInput.current.focus();
}

/**
 * Format the createdAt time
 * @function getFormattedDate
 * @param {String} createdAt - the time stamp in string format
 * @returns {String} the formatted time
 */
export function getFormattedDate(createdAt: string) {
  return moment(createdAt).format('h:mm a');
}

/**
 * Transform date into a utc format of eg. 2021-06-02
 * @function formateDateForBE
 */
export function formateDateForBE(dateOfBirth: any) {
  if (dateOfBirth) {
    return moment(dateOfBirth).utc().format('YYYY-MM-DD');
  }
  return null;
}

/**
 * Parses a string representation of a date and returns the number of milliseconds since 1 January, 1970, 00:00:00 UTC, with leap seconds ignored.
 * @function formatDateToMilliseconds
 * @param {String} date - the time stamp in string format
 * @returns {number} number of milliseconds since the date
 */
export function formatDateToMilliseconds(date: string) {
  return Date.parse(date);
}

/**
 * Find the parent's id of the given message
 * @function findParentId
 * @param {Message Object} selectedMessage
 * @return {Number} id - the target id
 */
export function findParentId(selectedMessage) {
  if (selectedMessage === null) {
    return null;
  } else {
    return selectedMessage.parent_message === null
      ? selectedMessage.id
      : selectedMessage.parent_message;
  }
}

/**
 * Return a date from previous week starting from today
 * @function getDateFromPrviousWeeks
 * @param {weeks - number} - Number of week
 */
export function getDateFromPrviousWeeks(weeks: number) {
  return moment().subtract(weeks, 'days').utc().format('YYYY-MM-DD HH:mm:ss');
}

/**
 * Get the difference starting from now
 * @function getTimeDifferenceInHours
 * @param {startTime - string} - Number of week
 */
export function getTimeDifference(
  dateTime: string,
  differenceIn: 'asMinutes' | 'asHours' | 'asDays' | 'asMonths',
) {
  function getTimeDifferenceIn() {
    switch (differenceIn) {
      case 'asMinutes':
        return diff.asMinutes();
      case 'asHours':
        return diff.asHours();
      case 'asDays':
        return diff.asDays();
      case 'asMonths':
        return diff.asMonths();
    }
  }

  const startTime = moment(dateTime).utc();
  const endTime = moment().utc();
  const diff = moment.duration(endTime.diff(startTime));
  var timeDifferenceIn = Math.ceil(24 - getTimeDifferenceIn());
  return timeDifferenceIn;
}

/**
 * Filters the chatRoom messages and return an array of Replies
 * @function getRepliesList
 * @return {Array} - Array of all replies sorted in DESC order by date created
 */
export function getRepliesList(roomsMessages, userProfile, pageRenderSize) {
  function compileUniqueParentMessages(repliesList) {
    const collection = collect(repliesList);
    const sortedRepliesList = collection.sortByDesc('replyId').all();

    //Sort the replistList by last added
    const sortedListOfParentMessages = sortedRepliesList
      .map((e) => e['parentMessageId'])
      .flat();

    //Remove duplicate values
    const listOfUniqueParentMessages = collect(sortedListOfParentMessages)
      .unique()
      .all();

    return listOfUniqueParentMessages;
  }

  const repliesList = [];
  const messages = roomsMessages.slice(0, pageRenderSize);
  const userId = userProfile.id;
  try {
    if (messages.length < 1) return;
    messages.forEach((message) => {
      if (!message.replies) return;
      const replies = message.replies;

      if (message?.app_user.id === userId) {
        const endOfReplies = replies[replies.length - 1];

        if (!endOfReplies) return;
        //only check if the last item added in the replies list is not from you
        //and has not been seen
        //and the message has been approved
        if (
          endOfReplies?.app_user.id !== userId &&
          !endOfReplies?.is_seen &&
          endOfReplies?.is_approved
        ) {
          repliesList.push({
            replyId: endOfReplies?.id,
            parentMessageId: message?.id,
          });
        }
        return;
      }

      message.replies.forEach((reply) => {
        if (reply.app_user.id === userId) {
          const replies = message.replies;
          const endOfReplies = replies[replies.length - 1];

          if (!endOfReplies) return;

          //only check if the last item added in the replies list is not from you
          //and has not been seen
          // and is approved
          if (
            endOfReplies?.app_user.id !== userId &&
            !endOfReplies?.is_seen &&
            endOfReplies?.is_approved
          ) {
            repliesList.push({
              replyId: endOfReplies?.id,
              parentMessageId: message?.id,
            });
          }
        }
      });
    });
  } catch (error) {
    console.log('error: ', error);
  }

  const listOfUniqueParentMessages = compileUniqueParentMessages(repliesList);

  return listOfUniqueParentMessages;
}
