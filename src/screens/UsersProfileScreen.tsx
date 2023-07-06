import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import UserAvatar from '../component-library/UserAvatar';
import Globals from '../component-library/Globals';
import BackendApiClient from '../services/api/BackendApiClient';
import { isIos } from '../services/utility/Platform';
import { useRoute, useNavigation } from '@react-navigation/native';
import CustomHeaderBar from '../component-library/CustomHeaderBar';
import BlockReportModal from '../modals/BlockReportModal';
import ReportBlockManager from '../services/api/ReportBlockManager';
import { FlatList } from 'react-native-gesture-handler';
import ToggleFriendButton, {
  ADD,
} from '../component-library/ToggleFriendButton';
import FriendshipManager from '../services/api/FriendshipManager';
import UserProfileManager from '../services/api/UserProfileManager';
import ConfirmCancelModal from '../modals/ConfirmCancelModal';
import EntryItem from '../component-library/EntryItem';
import AvatarList from '../component-library/AvatarList';
import { actionCreators } from '../store/actions';
import { store } from '../store';
import EnlargedUserAvatar from '../component-library/EnlargedUserAvatar';
import MutualFriendsModal from '../modals/MutualFriendsModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import ThreeDotsIcon from '../component-library/graphics/Icons/ThreeDotsIcon';
import DefaultLoadingIndicator from '../component-library/LoadingIndicator/DefaultLoadingIndicator';
import PaperPlanePreviewList from '../component-library/PaperPlanePreviewList';

export default function UsersProfileScreen() {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const route = useRoute<UsersProfileRouteProp>();
  const navigation = useNavigation<UsersProfileScreenNavigationProp>();
  const emojiFlags = require('emoji-flags');
  const [profileInfo, setProfileInfo] = useState(null);
  const [paperArray, setPaperArray] = useState([]);
  const [total_count, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing] = useState(false);
  const [page, setPage] = useState(1);
  const [pages_count, setPagesCount] = useState(2);
  const [showBlockUserModal, setShowBlockUserModal] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportSuccessTitle, setReportSuccessTitle] = useState('');
  const [friendshipStatus, setFriendshipStatus] = useState('');
  const [friendshipId, setFriendshipId] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingFriendship, setLoadingFriendship] = useState(false);
  const [userReported, setUserReported] = useState(false);
  const [reportId, setReportId] = useState(null);
  const [unBlockSuccessTitle, setUnBlockSuccessTitle] = useState('');
  const [unblocking, setUnblocking] = useState(false);
  const [showConfirmCancelModal, setShowConfirmCancelModal] = useState(false);
  const [showConfirmUnfriendModal, setShowConfirmUnfriendModal] = useState(
    false,
  );
  const [showMutualFriendsModal, setShowMutualFriendsModal] = useState(false);
  const [fetchingNextPage, setFetchingNextPage] = useState(false);
  const [showEnlargedUserAvatar, setShowEnlargedUserAvatar] = useState(false);

  useEffect(() => {
    let userInfo;
    if (route?.params) {
      setProfileInfo(route?.params?.relatedUser);
      userInfo = route?.params?.relatedUser;
    }
    getUserData(userInfo);
    getPaperList(userInfo);
  }, []);

  /**
   * Load profile information
   * @function getUserData
   */
  async function getUserData(userInfo) {
    setLoadingProfile(true);
    const profile = await UserProfileManager.getOtherUserProfile(userInfo.id);
    setLoadingProfile(false);
    if (profile.success) {
      setProfileInfo(profile.profile);
      setFriendshipId(profile.profile.friendship?.id);
      //Check if user is reported
      if (profile.profile.report !== null) {
        setUserReported(true);
        setReportId(profile.profile.report?.id);
      }
    }
  }

  /**
   * Load paper planes
   * @function getPaperList
   */
  async function getPaperList(userInfo) {
    const paperList = await BackendApiClient.requestAuthorizedAsync({
      method: 'GET',
      url: `/paperplane/list??filter_group=Profile&profile=${userInfo.id}&page=${page}`,
    });
    setPage(page + 1);
    setPagesCount(paperList.data.paper_planes.pages_count);
    setTotalCount(paperList.data.paper_planes.total_count);
    setPaperArray(paperList.data.paper_planes.data);
    setIsLoading(false);
  }

  /**
   * Load next paper plane list page from BE
   * @function getPaperListNextPage
   */
  async function getPaperListNextPage() {
    if (page <= pages_count) {
      setFetchingNextPage(true);
      const paperList = await BackendApiClient.requestAuthorizedAsync({
        method: 'GET',
        url: `/paperplane/list??filter_group=Profile&profile=${profileInfo.id}&page=${page}`,
      });
      setPage(page + 1);
      setPagesCount(paperList.data.paper_planes.pages_count);
      setTotalCount(paperList.data.paper_planes.total_count);
      setPaperArray([...paperArray, ...paperList.data.paper_planes.data]);
      setFetchingNextPage(false);
    }
  }

  async function toggleFriendship() {
    if (profileInfo.friendship !== null) {
      toggleUnfriendModal();
      return;
    }
    try {
      setLoadingFriendship(true);
      const addResponse = await FriendshipManager.sendFriendshipRequest(
        profileInfo?.internal_id,
      );
      setProfileInfo(addResponse.user);
      setLoadingFriendship(false);
    } catch (error) {
      setLoadingFriendship(false);
    }
  }

  async function unFriend() {
    setLoadingFriendship(true);
    const rejectResponse = await FriendshipManager.rejectFriendship(
      profileInfo.friendship?.id,
    );
    if (rejectResponse.success) {
      let newUser = profileInfo;
      newUser = {
        ...newUser,
        friendship: null,
      };
      setProfileInfo(newUser);
    }
    setLoadingFriendship(false);
    toggleUnfriendModal();
  }

  function toggleUnfriendModal() {
    setShowConfirmUnfriendModal(!showConfirmUnfriendModal);
  }

  const buildIsFollowing = useMemo(() => {
    return isFollowing ? (
      <View style={styles.followingButton}>
        <Text style={styles.buttonFollowingText}>Following</Text>
      </View>
    ) : (
      <View style={styles.followButton}>
        <Text style={styles.buttonText}>Follow</Text>
      </View>
    );
  }, [isFollowing]);

  /**
   * Show and hide the block report modal
   * @function toggleBlockReportModal
   */
  function toggleBlockReportModal() {
    if (userReported) {
      setShowConfirmCancelModal(!showConfirmCancelModal);
    } else {
      setShowBlockUserModal(!showBlockUserModal);
    }
  }

  /**
   * Show and hide Enlarged User avatar
   * @function toggleEnlargedUserAvatar
   */
  function toggleEnlargedUserAvatar() {
    if (showEnlargedUserAvatar === false) {
      const action = actionCreators.bottomTabBar.setVisibility(false);
      store.dispatch(action);
    }
    setShowEnlargedUserAvatar(!showEnlargedUserAvatar);
  }

  function toggleMutualFriendsModal(close?: boolean) {
    if (close) {
      setShowMutualFriendsModal(false);
    } else {
      setShowMutualFriendsModal(!showMutualFriendsModal);
    }
  }

  /**
   * Report the other user
   * @function reportUser
   */
  async function reportUser(reasons: Array<string>) {
    setReporting(true);
    setReportSuccessTitle('');

    const result = await ReportBlockManager.reportUser(
      profileInfo.internal_id,
      reasons,
    );
    if (result.success) {
      setReportSuccessTitle('Report successful 👍');
      setUserReported(true);
      setReportId(result.report.id);
    } else {
      setReportSuccessTitle('Report failed 😕');
      setUserReported(false);
    }
    setReporting(false);
    setFriendshipStatus(ADD);
    setTimeout(toggleBlockReportModal, 1000);
  }

  /**
   * Un block user
   * @function unBlockUser
   */
  async function unBlockUser() {
    setUnBlockSuccessTitle('');
    setUnblocking(true);
    const response = await ReportBlockManager.deletReport(reportId);
    if (response.success) {
      setUserReported(false);
      setUnBlockSuccessTitle('Unblock successful 👍');
    } else {
      setUnBlockSuccessTitle('Unblock failed 😕');
    }
    setUnblocking(false);
    setTimeout(toggleBlockReportModal, 1000);
  }

  /**
   * Go back to previous screen and pass back data
   * @function onGoBack
   */
  function onGoBack() {
    navigation.goBack();
    if (route.params?.returnData) {
      route.params?.returnData(profileInfo);
    }
  }

  function renderItem({ item, index }) {
    return (
      <EntryItem
        item={item}
        index={index}
        paperPlanes={paperArray}
        months={months}
        navigation={navigation}
        page={page}
        returnRoute={'UsersProfileScreen'}
        relatedUser={profileInfo}
      />
    );
  }

  const buildProfileHeader = useMemo(() => {
    return (
      <View style={styles.profileHeader}>
        {renderPaperPlanePreviewList()}
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              size={100}
              uri={profileInfo?.profilePicture}
              onclick={toggleEnlargedUserAvatar}
            />
            <View style={styles.followBlock}>
              <ToggleFriendButton
                friendship={profileInfo?.friendship}
                onPress={toggleFriendship}
                requesting={loadingFriendship}
              />
            </View>
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {profileInfo?.name}
          </Text>
          <Text style={styles.profileLocation} numberOfLines={1}>
            📍{' '}
            {`${profileInfo?.location?.city}${
              profileInfo?.location?.city !== '' ? ', ' : ' '
            }${profileInfo?.location?.country}`}{' '}
            {profileInfo?.location?.country_code
              ? emojiFlags.countryCode(profileInfo?.location?.country_code)
                  .emoji
              : null}
          </Text>
        </View>
      </View>
    );
  }, [
    buildIsFollowing,
    friendshipStatus,
    friendshipId,
    loadingProfile,
    loadingFriendship,
    profileInfo,
    showMutualFriendsModal,
    paperArray,
    isLoading,
  ]);

  function renderPrompts({ item }) {
    return (
      <View>
        <Text style={styles.promptTitle}>{item?.question}</Text>
        <Text style={styles.bioDescripton}>{item?.answer}</Text>
      </View>
    );
  }

  function renderAddBioPlaceholder() {
    return profileInfo?.bio_text?.length > 0 ||
      profileInfo?.prompts?.length > 0 ? (
      <View style={styles.bioContainer}>
        {profileInfo?.bio_text ? (
          <Text style={styles.bioDescripton}>{profileInfo?.bio_text}</Text>
        ) : null}
        {profileInfo?.prompts ? (
          <FlatList data={profileInfo?.prompts} renderItem={renderPrompts} />
        ) : null}
      </View>
    ) : null;
  }

  function renderMutualFriends() {
    function getAllNames() {
      if (profileInfo === null) return [];
      return profileInfo.mutual_friends?.map((friend, index) => {
        const friendListLength = profileInfo.mutual_friends?.length;
        let seperator;
        if (friendListLength < 3) {
          seperator = index === friendListLength - 1 ? ' ' : ', ';
        } else {
          seperator = index === 2 ? ' ' : ', ';
        }
        return friend.name + seperator;
      });
    }
    const allNames = getAllNames();
    function getExtraFriends() {
      if (allNames?.length > 3) {
        if (allNames.length - 3 === 1) {
          return (allNames.length - 3).toString() + ' other';
        } else {
          return (allNames.length - 3).toString() + ' others';
        }
      } else {
        return null;
      }
    }

    const extraFriends = getExtraFriends();
    return allNames?.length > 0 ? (
      <TouchableWithoutFeedback onPress={() => toggleMutualFriendsModal()}>
        <View style={styles.mutalFriendsContainer}>
          <View>
            <AvatarList
              data={profileInfo ? profileInfo.mutual_friends : []}
              disableShaddow
              hideCount
              type={'mutualFriends'}
              onClick={toggleMutualFriendsModal}
              iconSize={38}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.mutualFriends} numberOfLines={2}>
              Friends with{' '}
              <Text style={styles.boldMutualFriends}>
                {allNames.slice(0, 3)}
              </Text>
              {extraFriends ? 'and ' : null}
              <Text style={styles.boldMutualFriends}>{extraFriends}</Text>
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : null;
  }

  function renderPaperPlanePreviewList() {
    return (
      <PaperPlanePreviewList paperPlanes={paperArray} loading={isLoading} />
    );
  }

  const buildPostsHeaderBlock = useMemo(() => {
    return (
      <View style={styles.headerDescriptionContainer}>
        {renderAddBioPlaceholder()}
        {renderMutualFriends()}
        <View style={styles.postsHeaderBlock}>
          <Text style={styles.postsHeaderText}>
            Entries {isLoading ? '' : total_count}
          </Text>
        </View>
      </View>
    );
  }, [isLoading, total_count, profileInfo]);

  const listHeaderComponent = useMemo(
    () => (
      <View style={styles.headerContainer}>
        {buildProfileHeader}
        {buildPostsHeaderBlock}
      </View>
    ),
    [buildProfileHeader, buildPostsHeaderBlock],
  );

  const listEmptyComponent = useMemo(
    () => (
      <View style={styles.loadingContainer}>
        <DefaultLoadingIndicator size={'large'} show={isLoading} />
      </View>
    ),
    [isLoading],
  );

  const listFooterComponent = useMemo(
    () =>
      fetchingNextPage ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : null,
    [fetchingNextPage],
  );

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        onDismiss={onGoBack}
        backgroundColor={Globals.color.background.light}
        customIcon={<ThreeDotsIcon />}
        onPress={toggleBlockReportModal}
      />
      <FlatList
        data={paperArray}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={listHeaderComponent}
        ListEmptyComponent={listEmptyComponent}
        ListFooterComponent={listFooterComponent}
        onEndReachedThreshold={0.2}
        onEndReached={getPaperListNextPage}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        getItemLayout={(data, index) => ({
          length: paperPlaneHeight,
          offset: paperPlaneHeight * index,
          index,
        })}
      />

      <BlockReportModal
        showBlockReportModal={showBlockUserModal}
        onCancel={toggleBlockReportModal}
        onConfirm={reportUser}
        loading={reporting}
        loadingFinishedTitle={reportSuccessTitle}
      />

      <ConfirmCancelModal
        toggleConfirmCancelModal={toggleBlockReportModal}
        showConfirmCancelModal={showConfirmCancelModal}
        onConfirm={unBlockUser}
        title={'Unblock'}
        text={`Are you sure you want to unblock ${profileInfo?.name}`}
        confirmText={'Unblock'}
        cancelText={'Cancel'}
        myKey={'unblock'}
        successTitle={unBlockSuccessTitle}
        loading={unblocking}
      />

      <ConfirmCancelModal
        toggleConfirmCancelModal={unFriend}
        showConfirmCancelModal={showConfirmUnfriendModal}
        onConfirm={toggleUnfriendModal}
        title={'Unfriend'}
        text={`Are you sure you want to remove ${profileInfo?.name} as a friend?`}
        confirmText={'Cancel'}
        cancelText={'Unfriend'}
        myKey={'unfriend'}
      />
      <EnlargedUserAvatar
        show={showEnlargedUserAvatar}
        toggleComponent={toggleEnlargedUserAvatar}
        uri={profileInfo?.profilePicture}
      />
      <MutualFriendsModal
        data={profileInfo ? profileInfo.mutual_friends : []}
        openModal={showMutualFriendsModal}
        toogleModal={toggleMutualFriendsModal}
        onClose={() => toggleMutualFriendsModal(true)}
      />
    </SafeAreaView>
  );
}

const paperPlaneWidth = Dimensions.get('window').width / 2 - 20;
const paperPlaneHeight = paperPlaneWidth * 1.3;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Globals.color.background.light,
    flex: 1,
  },
  headerContainer: {
    width: Dimensions.get('window').width,
    backgroundColor: Globals.color.background.light,
    marginBottom: Globals.dimension.margin.mini,
    shadowColor: Globals.color.background.grey,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  profileHeader: {
    marginBottom: -60,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileInfo: {
    top: -50,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginTop: Globals.dimension.margin.small,
  },
  profileLocation: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
    marginBottom: Globals.dimension.margin.small,
  },
  followBlock: {
    flex: 1,
    flexDirection: 'row',
    marginTop: Globals.dimension.margin.tiny,
    justifyContent: 'center',
    top: 25,
  },
  headerDescriptionContainer: {
    width: '100%',
  },
  mutalFriendsContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutualFriends: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
  },
  boldMutualFriends: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
  },
  postsHeaderBlock: {
    flexDirection: 'row',
    alignContent: 'center',
    marginTop: Globals.dimension.margin.mini,
    paddingVertical: Globals.dimension.padding.mini,
    paddingHorizontal: Globals.dimension.padding.small,
    backgroundColor: Globals.color.background.light,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Globals.color.background.mediumgrey,
  },
  postsImage: {
    width: 32,
    height: 32,
  },
  postsHeaderText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
  paperPlanes: {
    padding: 5,
    backgroundColor: Globals.color.background.light,
    width: paperPlaneWidth,
    height: paperPlaneHeight,
    borderRadius: 6,
    shadowColor: '#B3B6B9',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 6,
    marginBottom: 20,
    marginHorizontal: 5,
    elevation: isIos() ? 0 : 5,
  },
  paperPlanesText: {
    fontSize: 10,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
  },
  paperPlanesTextData: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.default,
    fontSize: Globals.font.size.tiny,
    marginRight: 5,
  },
  imageBackground: {
    width: paperPlaneWidth - 10,
    height: paperPlaneHeight - 40,
    backgroundColor: '#ECE9F1',
    borderRadius: Globals.dimension.borderRadius.mini * 0.5,
    overflow: 'hidden',
  },
  followButton: {
    width: 150,
    height: 33,
    backgroundColor: '#f1004e',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    shadowColor: Globals.color.brand.accent1,
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.31,
    shadowRadius: 6,
    elevation: 15,
  },
  buttonText: {
    color: Globals.color.text.light,
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
  },
  followingButton: {
    width: 150,
    height: 33,
    backgroundColor: Globals.color.text.light,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    shadowRadius: 16,
    shadowColor: '#B3B6B9',
    shadowOffset: { width: 0, height: 7 },
    shadowOpacity: 0.24,
    elevation: 15,
  },
  buttonFollowingText: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
  },
  activityIndicator: {
    alignSelf: 'center',
  },
  avatarShadow: {
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    elevation: 15,
  },
  recordIconContainer: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: Globals.dimension.padding.tiny,
    paddingRight: Globals.dimension.padding.tiny,
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  flatListContainer: {
    width: '100%',
    paddingBottom: Globals.dimension.padding.large,
  },
  bioContainer: {
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  addBioContainer: {
    width: '90%',
    height: 100,
    alignSelf: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: '#FCFCFC',
    paddingVertical: Globals.dimension.padding.mini,
    borderWidth: 1,
    borderColor: Globals.color.brand.neutral3,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBioDescription: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.grey,
  },
  bioDescripton: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginBottom: Globals.dimension.margin.tiny,
  },
  promptTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
});
