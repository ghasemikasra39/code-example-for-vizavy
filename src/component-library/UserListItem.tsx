import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableWithoutFeedback } from 'react-native';
import Globals from './Globals';
import { useNavigation } from '@react-navigation/native';
import UserAvatar from './UserAvatar';
import ToggleFriendButton from './ToggleFriendButton';
import FriendshipManager from '../services/api/FriendshipManager';

interface Props {
  item: any;
  nestedObject?: boolean;
  hideAddFriendButton?: boolean;
  loading?: boolean;
  mutualFriends?: number;
  updateList: (user: Object) => void;
}

export default function UserListItem(props: Props) {
  const {
    item,
    hideAddFriendButton,
    loading,
    nestedObject,
    mutualFriends,
    updateList,
  } = props;
  const navigation = useNavigation();
  const emojiFlags = require('emoji-flags');
  const [newItem, setNewItem] = useState(checkItemNested());
  const [loadingFriendship, setLoadingFriendship] = useState(false);

  useEffect(() => {
    setNewItem(checkItemNested());
  }, [item]);

  function checkItemNested() {
    if (nestedObject) {
      return item?.user;
    } else {
      return item;
    }
  }

  function returnData(user: Object) {
    if (user === null) return;
    setNewItem(user);
    updateList && updateList(user);
  }

  async function toggleFriendship() {
    try {
      setLoadingFriendship(true);
      const addResponse = await FriendshipManager.sendFriendshipRequest(
        newItem.internal_id,
      );
      returnData(addResponse.user);
      // setNewItem(addResponse.user);
      setLoadingFriendship(false);
    } catch (error) {
      setLoadingFriendship(false);
    }
  }

  function goToUserProfile() {
    navigation.navigate('UsersProfileScreen', {
      paperPlane: {
        author: {
          id: newItem.id,
        },
      },
      relatedUser: newItem,
      returnData,
    });
  }

  function compileTextPosition() {
    let nameStyle = styles.userName;
    if (newItem?.location?.country_code) {
      nameStyle = {
        ...nameStyle,
        marginTop: -5,
      };
    }
    return nameStyle;
  }

  const renderListItem = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={goToUserProfile}>
        <View style={styles.userBlock}>
          <View style={styles.innerContainer}>
            <View style={styles.userAvatar}>
              {!loading ? (
                <UserAvatar
                  size={44}
                  uri={newItem.profilePicture}
                  onclick={goToUserProfile}
                />
              ) : (
                <View style={styles.avatarLoadingContainer} />
              )}
            </View>
            <View style={styles.userInfoContainer}>
              {!loading ? (
                <Text style={compileTextPosition()} numberOfLines={1}>
                  {newItem?.name}{' '}
                  {newItem?.location?.country_code
                    ? emojiFlags.countryCode(newItem?.location?.country_code)
                        .emoji
                    : null}
                </Text>
              ) : (
                <View style={styles.userNameLoadingContainer} />
              )}
              {!loading ? (
                <Text numberOfLines={1} style={styles.description}>{`${
                  newItem.location.city !== null ? newItem.location.city : ''
                }${newItem?.location?.city ? ', ' : ''}${
                  newItem.location.country !== null
                    ? newItem.location.country
                    : ''
                }`}</Text>
              ) : (
                <View style={styles.locationLoadingContainer} />
              )}

              {mutualFriends !== undefined && mutualFriends !== 0 ? (
                !loading ? (
                  <Text numberOfLines={1} style={styles.description}>
                    Mutual Friends {'('}
                    {mutualFriends}
                    {')'}
                  </Text>
                ) : (
                  <View style={styles.descriptionLoadingContainer} />
                )
              ) : null}

              {newItem?.bio_text ? (
                !loading ? (
                  <Text numberOfLines={1} style={styles.subDescription}>
                    {newItem?.bio_text}
                  </Text>
                ) : (
                  <View style={styles.subDescriptionLoadingContainer} />
                )
              ) : newItem?.prompts?.length > 0 ? (
                !loading ? (
                  <Text numberOfLines={1} style={styles.subDescription}>
                    {newItem?.prompts[0] !== undefined
                      ? newItem?.prompts[0]?.answer
                      : null}
                  </Text>
                ) : (
                  <View style={styles.subDescriptionLoadingContainer} />
                )
              ) : null}
            </View>
            {!hideAddFriendButton ? (
              <ToggleFriendButton
                friendship={newItem?.friendship}
                onPress={toggleFriendship}
                shapeStyle={'listItemButton'}
                mounting={loading}
                requesting={loadingFriendship}
              />
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, [newItem, loading, loadingFriendship]);
  try {
    return renderListItem;
  } catch (error) {
    return null;
  }
}

const styles = StyleSheet.create({
  userBlock: {
    backgroundColor: Globals.color.background.light,
    marginBottom: Globals.dimension.margin.small,
    marginHorizontal: Globals.dimension.padding.mini,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userAvatar: {
    marginRight: Globals.dimension.margin.mini,
  },
  userInfoContainer: {
    flex: 1,
    paddingRight: Globals.dimension.padding.tiny,
    justifyContent: 'center',
  },
  userName: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  description: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
  },
  subDescription: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
  },
  avatarLoadingContainer: {
    width: 44,
    height: 44,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
  },
  userNameLoadingContainer: {
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.large,
    height: 10,
    width: '40%',
    marginBottom: Globals.dimension.margin.tiny,
  },
  locationLoadingContainer: {
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.large,
    height: 10,
    width: '50%',
    marginBottom: Globals.dimension.margin.tiny,
  },
  descriptionLoadingContainer: {
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.large,
    height: 10,
    width: '40%',
    marginBottom: Globals.dimension.margin.tiny,
  },
  subDescriptionLoadingContainer: {
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.large,
    height: 10,
    width: '80%',
    marginBottom: Globals.dimension.margin.tiny,
  },
});
