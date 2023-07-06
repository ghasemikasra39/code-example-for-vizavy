import React, { useMemo, useEffect, useState } from 'react';
import Modal from '../component-library/Modal';
import { StyleSheet, Text, View, FlatList, Dimensions } from 'react-native';
import Globals from '../component-library/Globals';
import UserAvatar from '../component-library/UserAvatar';
import { useNavigation } from '@react-navigation/native';
import ChatRoomManager, {
  MessageInterface,
} from '../services/api/ChatRoomManager';
import DirectChatsManager from '../services/api/DirectChatsManager';

interface Props {
  openModal: boolean;
  toogleModal: () => void;
  onClose: () => void;
  userProfile: any;
  selectedMessage: MessageInterface;
  directChatroom?: boolean;
}

export default function ReactionsModal(props: Props) {
  const {
    openModal,
    onClose,
    userProfile,
    selectedMessage,
    directChatroom,
  } = props;
  const emojiFlags = require('emoji-flags');
  const navigation = useNavigation();
  const [reactionList, setReactionList] = useState([]);
  const [loadingReactionList, setLoadingReactionList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (openModal) {
      getLoadingReactionList();
      getReactionList();
    }
  }, [openModal]);

  async function getReactionList() {
    setLoading(true);
    if (directChatroom) {
      DirectChatsManager.getReactionsSingleMessage(selectedMessage?.id)
        .then((response) => {
          setReactionList(response.reactions);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      ChatRoomManager.getReactionsSingleMessage(selectedMessage?.id)
        .then((response) => {
          setReactionList(response.reactions);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }

  function getLoadingReactionList() {
    const newLoadingList = [
      ...Array(selectedMessage.total_users_reacted).keys(),
    ];
    setLoadingReactionList(newLoadingList);
  }

  function goToUserProfile(item: any) {
    //Navigate to my profile screen
    if (userProfile.id === item.app_user.id) {
      navigation.navigate('MyProfileScreen', {
        userProfile,
      });
    } else {
      //Navigate to other user profile screen
      navigation.navigate('UsersProfileScreen', {
        paperPlane: { author: { id: item.app_user.id } },
        relatedUser: item.app_user,
      });
    }
  }

  function renderEmojies({ item }) {
    return <Text style={styles.emoji}>{item}</Text>;
  }

  const listHeaderComponent = useMemo(() => {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.title}>
          Reactions{' '}
          {reactionList?.length > 0 ? `(${reactionList?.length})` : null}
        </Text>
      </View>
    );
  }, [loading]);

  function compileNameStyle(item) {
    let nameStyle = styles.name;
    if (item.app_user.location?.country_code) {
      nameStyle = {
        ...nameStyle,
        paddingTop: 0,
        top: -3,
      };
    }
    return nameStyle;
  }

  function renderEmptyItem({ item }) {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemWrapper}>
          <View style={styles.loadingUserAvatar} />
          <View style={styles.wrapper}>
            <View style={styles.userInformationContainer}>
              <View style={styles.loadingName} />
              <View style={styles.loadingLocation} />
            </View>
          </View>
        </View>
      </View>
    );
  }

  function renderItem({ item }) {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.listItemWrapper}>
          <UserAvatar
            uri={item.app_user?.profilePicture}
            size={44}
            onclick={() => goToUserProfile(item)}
          />
          <View style={styles.wrapper}>
            <View style={styles.userInformationContainer}>
              <Text style={compileNameStyle(item)} numberOfLines={1}>
                {item.app_user?.name}{' '}
                {item.app_user.location?.country_code
                  ? emojiFlags.countryCode(item.app_user.location?.country_code)
                      .emoji
                  : null}
              </Text>
              <Text style={styles.location} numberOfLines={1}>
                {item.app_user.location?.city
                  ? item.app_user.location.city + ', '
                  : null}
                {item.app_user.location?.country
                  ? item.app_user.location.country
                  : null}
              </Text>
            </View>
          </View>

          <View style={styles.emojiContainer}>
            <FlatList
              data={item.emojies}
              renderItem={renderEmojies}
              keyExtractor={(index) => index.toString()}
              horizontal={true}
              scrollEnabled={false}
            />
            {item?.total_count > 0 ? (
              <Text style={styles.countStyle}>{item.total_count}x</Text>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  const renderInviteFriendsModal = useMemo(
    () =>
      navigation.isFocused() ? (
        <Modal
          key="inviteFriendModal"
          isVisible={openModal}
          modalheightType={'modal2'}
          onClosed={() => onClose()}
          placement="bottom">
          <View style={styles.container}>
            {loading ? (
              <FlatList
                data={loadingReactionList}
                renderItem={renderEmptyItem}
                ListHeaderComponent={listHeaderComponent}
                keyExtractor={(item) => item.key}
                stickyHeaderIndices={[0]}
              />
            ) : (
              <FlatList
                data={reactionList}
                renderItem={renderItem}
                ListHeaderComponent={listHeaderComponent}
                keyExtractor={(item) => item.key}
                stickyHeaderIndices={[0]}
              />
            )}
          </View>
        </Modal>
      ) : null,
    [openModal, reactionList, listHeaderComponent, goToUserProfile],
  );

  return renderInviteFriendsModal;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  headerContainer: {
    width: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.mini,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    textAlign: 'center',
  },
  closeContainer: {
    position: 'absolute',
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
  listItemContainer: {
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    marginBottom: Globals.dimension.margin.small,
  },
  listItemWrapper: {
    flexDirection: 'row',
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInformationContainer: {
    justifyContent: 'space-between',
    paddingLeft: Globals.dimension.padding.tiny,
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    paddingRight: Globals.dimension.padding.small,
    paddingTop: 2,
  },
  location: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    paddingRight: Globals.dimension.padding.small,
  },
  emojiContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  countStyle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  emoji: {
    fontSize: Globals.font.size.small,
  },
  loadingUserAvatar: {
    width: 44,
    height: 44,
    borderRadius: Globals.dimension.borderRadius.large,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  loadingName: {
    height: 12,
    width: Dimensions.get('window').width * 0.5,
    borderRadius: Globals.dimension.borderRadius.small,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  loadingLocation: {
    height: 12,
    width: Dimensions.get('window').width * 0.3,
    borderRadius: Globals.dimension.borderRadius.small,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  loadingIndicator: {
    width: '100%',
    paddingTop: Globals.dimension.padding.mini,
  },
});
