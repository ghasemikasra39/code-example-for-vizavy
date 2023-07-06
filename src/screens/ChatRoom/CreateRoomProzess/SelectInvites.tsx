import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
} from 'react-native';
import Globals from '../../../component-library/Globals';
import { close_icon } from '../../../component-library/graphics/Images';
import { LinearGradient } from 'expo-linear-gradient';
import SelectFollowersItem from '../../../component-library/SelectFollowersItem';
import UserAvatar from '../../../component-library/UserAvatar';
import HapticFeedBackWrapper from '../../../component-library/HapticFeedBackWrapper';
import LockIcon from '../../../component-library/graphics/Icons/LockIcon';
import SearchIcon from '../../../component-library/graphics/Icons/SearchIcon';
import Collapsible from 'react-native-collapsible';
import WorldIcon from '../../../component-library/graphics/Icons/WorldIcon';

interface Props {
  colors: any;
  followerData: any;
  updateInviteFriendData: (
    inviteFriendsData: Array<Object>,
    includeFollewers: boolean,
  ) => void;
  admin: boolean;
  publicRoomManager: boolean;
  anouncementSelected: boolean;
  selectAnnouncement: () => void;
  publicSelected: boolean;
  selectPublic: () => void;
  isWritable: boolean;
  selectIsWritable: () => void;
  navigation: any;
}

const AVATAR_SIZE = 60;
export default function SelectInvites(props: Props) {
  const textInputRef = useRef(null);
  const flatListRef = useRef();
  const [selectAll, setSelectAll] = useState(false);
  const [text, setText] = useState('');
  const [showInfoBox, setShowInfoBox] = useState(false);
  const [friendsList, setFriendsList] = useState([]);
  const [newFollowerData, setNewFollowerData] = useState(props.followerData);
  const [userAdded, setUserAdded] = useState(false);
  const {
    colors,
    followerData,
    updateInviteFriendData,
    admin,
    publicRoomManager,
    anouncementSelected,
    selectAnnouncement,
    publicSelected,
    isWritable,
  } = props;

  useEffect(() => {
    const isAllSelected = friendsList?.length === followerData?.length;
    if (isAllSelected && followerData?.length > 0) {
      setSelectAll(isAllSelected);
    } else {
      setSelectAll(false);
    }
    passUpInviteList(friendsList, isAllSelected);
  }, [friendsList, userAdded]);

  useEffect(() => {
    setNewFollowerData(followerData);
  }, [followerData]);

  /**
   * Update the invitation list in the parent component
   * @method passUpInviteList
   */
  function passUpInviteList(friends: Array<Object>, includeFollowers: boolean) {
    updateInviteFriendData(friends, includeFollowers);
  }

  /**
   * Toogle between selecting all friends or deselecting all.
   * Reset inviteData when selecting or deselecting all.
   * @method selectAll
   */
  function onSelectAll() {
    if (selectAll) {
      setFriendsList([]);
      checkmarkAllFriends(false);
    } else {
      setFriendsList(followerData);
      checkmarkAllFriends(true);
    }
  }

  function checkmarkAllFriends(allSelected: boolean) {
    try {
      const newData = [...newFollowerData];
      newData.forEach((element, index) => {
        element = {
          ...element,
          selected: allSelected ? true : false,
        };
        newData[index] = element;
      });
      setNewFollowerData(newData);
    } catch (error) {
      console.log('error: ', error);
    }
  }

  /**
   * Sort the list of friends you wan to invite based on the text entered in the textInput
   * @method sortList
   */
  function getSortedList() {
    const newData = newFollowerData.filter(
      (user) => user.user.name.indexOf(text) >= 0,
    );
    return newData;
  }

  /**
   * Mark the clicked element as included or not included
   * @method updateInviteList
   * @param {index: number} - Passes over the index of the clicked element
   */
  function updateInviteList(item: Object) {
    const friendlistIndex = friendsList.findIndex(
      (element) => element.id === item?.id,
    );
    try {
      if (friendlistIndex === -1) {
        const newFriendsList = [...friendsList];
        item = {
          ...item,
          selected: true,
        };
        newFriendsList.push(item);
        setFriendsList(newFriendsList);
        scrollToEnd();
        const newData = [...newFollowerData];
        const followerDataIndex = newFollowerData.findIndex(
          (element) => element.id === item?.id,
        );
        newData[followerDataIndex].selected = true;
        setNewFollowerData(newData);
      } else {
        const newFriendsList = [...friendsList];
        const newData = [...newFollowerData];
        newFriendsList.splice(friendlistIndex, 1);
        setFriendsList(newFriendsList);
        const followerDataIndex = newFollowerData.findIndex(
          (element) => element.id === item?.id,
        );
        newData[followerDataIndex].selected = false;
        setNewFollowerData(newData);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  }

  function scrollToEnd() {
    try {
      setTimeout(
        () =>
          flatListRef.current?.scrollToOffset({
            offset:
              friendsList?.length *
              (AVATAR_SIZE + Globals.dimension.margin.tiny),
            animated: true,
          }),
        150,
      );
    } catch (error) {
      console.log('error: ', error);
    }
  }

  /**
   * Show or hide infoBox for public rooms
   * @method toggleInfoBox
   */
  function toggleInfoBox() {
    setShowInfoBox(!showInfoBox);
  }

  function infoIcon() {
    return (
      <TouchableOpacity
        style={styles.infoContainer}
        onPress={() => toggleInfoBox()}>
        <Text style={styles.questionMark}>?</Text>
      </TouchableOpacity>
    );
  }

  function informationTextBox() {
    function getText() {
      if (publicSelected) {
        return 'Start a room open for everyone to join.';
      } else {
        return 'Public rooms are visible to everyone on Youpendo.';
      }
    }

    return (showInfoBox || publicSelected) && !selectAll ? (
      <View style={styles.infoBoxContainer}>
        <Text style={styles.infoBoxTextStyle}>{getText()}</Text>
      </View>
    ) : null;
  }

  function header() {
    return (
      <View style={styles.header}>
        <Text style={styles.headerDescription}>
          You can invite friends who aren’t on Youpendo after pressing the
          create button.
        </Text>
      </View>
    );
  }

  function searchBar() {
    return (
      <View style={styles.searchBarContainer}>
        <SearchIcon />
        <TextInput
          ref={textInputRef}
          style={styles.searchBar}
          onChangeText={(text) => setText(text)}
          defaultValue={text}
          maxLength={140}
          placeholderTextColor={Globals.color.text.grey}
          placeholder={'Search'}
          selectionColor={Globals.color.text.grey}
          clearButtonMode={'while-editing'}
          keyboardAppearance={'light'}
        />
      </View>
    );
  }

  function renderSelectedInvites({ item }) {
    return (
      <View style={styles.inviteItemContainer}>
        <UserAvatar uri={item?.user?.profilePicture} size={AVATAR_SIZE} />
        <HapticFeedBackWrapper
          onPress={() => updateInviteList(item)}
          hitSlop={Globals.dimension.hitSlop.regular}>
          <View style={styles.removeInviteContainer}>
            <LinearGradient style={styles.gradientCloseIcon} colors={colors}>
              <Image source={close_icon} style={styles.closeIcon} />
            </LinearGradient>
          </View>
        </HapticFeedBackWrapper>
      </View>
    );
  }

  function renderInvitesListUSerCount() {
    return (
      <View style={styles.invitesListUserCountContainer}>
        <LinearGradient style={styles.gradientCloseIcon} colors={colors}>
          <Text style={styles.invitedCount} numberOfLines={1}>
            {friendsList?.length}/{followerData?.length}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  const selectedInvitesList = useMemo(() => {
    return !publicSelected ? (
      <Collapsible collapsed={friendsList?.length === 0} duration={200}>
        <View>
          <FlatList
            ref={flatListRef}
            data={friendsList}
            renderItem={renderSelectedInvites}
            contentContainerStyle={styles.inviteUserFlatList}
            keyExtractor={(item) => item?.id.toString()}
            ListHeaderComponent={renderInvitesListUSerCount()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            onScrollToIndexFailed={() => scrollToEnd()}
          />
        </View>
      </Collapsible>
    ) : null;
  }, [friendsList, colors, publicSelected]);

  function selectAllFollowers() {
    return !publicSelected ? (
      <View style={styles.selectAllFollower}>
        <View style={styles.publicRoomRow}>
          <LockIcon style={styles.lockIcon} />
          <Text style={styles.selectAllFriends}>Only friends</Text>
        </View>
        <Switch
          trackColor={{
            false: Globals.color.button.disabled,
            true: props.colors[1],
          }}
          thumbColor={
            props.anouncementSelected
              ? Globals.color.background.light
              : Globals.color.background.light
          }
          ios_backgroundColor={Globals.color.button.disabled}
          onValueChange={onSelectAll}
          value={selectAll}
        />
      </View>
    ) : null;
  }

  function selectAnnouncementRoom() {
    return props.admin ? (
      <View style={styles.selectAllContainer}>
        <View style={styles.publicRoomRow}>
          <Text style={styles.name}>Announcement room</Text>
        </View>
        <Switch
          trackColor={{
            false: Globals.color.button.disabled,
            true: props.colors[1],
          }}
          thumbColor={
            props.anouncementSelected
              ? Globals.color.background.light
              : Globals.color.background.light
          }
          ios_backgroundColor={Globals.color.button.disabled}
          onValueChange={props.selectAnnouncement}
          value={props.anouncementSelected}
        />
      </View>
    ) : null;
  }

  function selectPublicRoom() {
    return (publicRoomManager || props.admin) && !selectAll ? (
      <View style={styles.selectAllContainer}>
        <View style={styles.publicRoomRow}>
          <WorldIcon style={{ marginRight: Globals.dimension.margin.tiny }} />
          <Text style={styles.name}>Public</Text>
          {infoIcon()}
        </View>
        <Switch
          trackColor={{
            false: Globals.color.button.disabled,
            true: props.colors[1],
          }}
          thumbColor={
            props.anouncementSelected
              ? Globals.color.background.light
              : Globals.color.background.light
          }
          ios_backgroundColor={Globals.color.button.disabled}
          onValueChange={props.selectPublic}
          value={props.publicSelected}
        />
      </View>
    ) : null;
  }

  function selectReadOnly() {
    return props.admin ? (
      <View style={styles.selectAllContainer}>
        <Text style={styles.name}>Read only</Text>
        <Switch
          trackColor={{
            false: Globals.color.background.mediumgrey,
            true: props.colors[1],
          }}
          thumbColor={
            !props.isWritable
              ? Globals.color.background.light
              : Globals.color.background.light
          }
          ios_backgroundColor={Globals.color.background.mediumgrey}
          onValueChange={() => props.selectIsWritable()}
          value={!props.isWritable}
        />
      </View>
    ) : null;
  }

  function listHeader() {
    return (
      <View style={styles.headerContainer}>
        {selectAnnouncementRoom()}
        {selectPublicRoom()}
        {informationTextBox()}
        {selectReadOnly()}
        {selectAllFollowers()}
        {selectedInvitesList}
      </View>
    );
  }

  function renderItem({ item }) {
    return !publicSelected ? (
      <SelectFollowersItem
        colors={props.colors}
        item={item.user}
        active={!!item?.selected}
        onSelectUser={() => updateInviteList(item)}
        navigation={props.navigation}
      />
    ) : null;
  }

  return (
    <View style={styles.container}>
      {header()}
      {searchBar()}
      <FlatList
        data={getSortedList()}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={listHeader()}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  selectAllFriends: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  header: {
    width: '100%',
  },
  headerDescription: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    paddingHorizontal: Globals.dimension.padding.small,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.tiny,
  },
  createButtonContainer: {
    width: '90%',
    height: 50,
    borderRadius: Globals.dimension.borderRadius.large,
    overflow: 'hidden',
    alignSelf: 'center',
    marginTop: Globals.dimension.margin.small,
  },
  createButtonWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  create: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
  },
  searchBarContainer: {
    width: '90%',
    height: 38,
    alignSelf: 'center',
    paddingHorizontal: Globals.dimension.padding.tiny,
    marginVertical: Globals.dimension.padding.mini,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  searchBar: {
    flex: 1,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Globals.dimension.margin.tiny,
  },
  selectAllContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Globals.dimension.margin.tiny,
  },
  selectAllFollower: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invitedCount: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.light,
  },
  checkmarkContainer: {
    width: 30,
    height: 30,
    borderRadius: 100,
    overflow: 'hidden',
  },
  checkmarkWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: 13,
    height: 10,
  },
  noResultsContainer: {
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    marginTop: Globals.dimension.margin.small,
  },
  noResults: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.small,
  },
  infoContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    top: -5,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  publicRoomRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionMark: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.tiny,
  },
  infoBoxContainer: {
    paddingHorizontal: Globals.dimension.padding.small,
    marginBottom: Globals.dimension.margin.tiny,
  },
  infoBoxTextStyle: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.tiny,
  },
  lockIcon: {
    marginLeft: 3,
    marginRight: Globals.dimension.padding.mini * 0.7,
  },
  headerContainer: {
    width: '100%',
    paddingTop: Globals.dimension.padding.tiny,
    backgroundColor: Globals.color.background.light,
  },
  inviteListContainer: {
    width: '100%',
    height: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  inviteUserFlatList: {
    paddingVertical: Globals.dimension.padding.mini,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  inviteItemContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginRight: Globals.dimension.margin.tiny,
  },
  listEmptyItem: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    borderStyle: 'dashed',
    borderColor: Globals.color.background.grey,
    borderWidth: 1,
    marginRight: Globals.dimension.margin.tiny,
  },
  invitesListUserCountContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    marginRight: Globals.dimension.margin.tiny,
    overflow: 'hidden',
  },
  removeInviteContainer: {
    width: 20,
    height: 20,
    borderRadius: 100,
    overflow: 'hidden',
    position: 'absolute',
    alignSelf: 'flex-end',
  },
  gradientCloseIcon: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    width: 25,
    height: 25,
    top: 2,
  },
});
