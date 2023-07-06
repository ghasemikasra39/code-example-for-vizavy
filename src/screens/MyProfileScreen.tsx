import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
} from 'react-native';
import { connect } from 'react-redux';
import UserAvatar from '../component-library/UserAvatar';
import Globals from '../component-library/Globals';
import { useNavigation } from '@react-navigation/native';
import CustomHeaderBar from '../component-library/CustomHeaderBar';
import FriendshipManager from '../services/api/FriendshipManager';
import AvatarList from '../component-library/AvatarList';
import EntryItem from '../component-library/EntryItem';
import EditProfileModal from '../modals/EditProfileModal';
import EnlargedUserAvatar from '../component-library/EnlargedUserAvatar';
import { actionCreators } from '../store/actions';
import { store } from '../store';
import UserProfileManager from '../services/api/UserProfileManager';
import IllustrationExplainer from '../component-library/IllustrationExplainer';
import AnnouncementModal from '../modals/AnnouncementModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import SettingsIcon from '../component-library/graphics/Icons/SettingsIcon';
import EditProfileIcon from '../component-library/graphics/Icons/EditProfileIcon';
import DefaultLoadingIndicator from '../component-library/LoadingIndicator/DefaultLoadingIndicator';
import NoPaperPlanesIcon from '../component-library/graphics/Icons/NoPaperPlanesIcon';
import PlusIcon from '../component-library/graphics/Icons/PlusIcon';
import PaperPlanePreviewList from '../component-library/PaperPlanePreviewList';

const mapStateToProps = ({ userProfile, myProfile }) => ({
  userProfile,
  myProfile,
});

const paperPlaneWidth = Dimensions.get('window').width / 2 - 20;
const paperPlaneHeight = paperPlaneWidth * 1.3;

function MyProfileScreen(props) {
  const { userProfile, myProfile } = props;
  const {
    data,
    current_page,
    pages_count,
    total_count,
  } = myProfile.paperPlanes;
  const navigation = useNavigation();
  const emojiFlags = require('emoji-flags');
  const [fetchNextPage, setFetchNextPage] = useState(false);
  const [isLoadingEntries] = useState(false);
  const [showEditprofileModal, setShowEditprofileModal] = useState(false);
  const [showEnlargedUserAvatar, setShowEnlargedUserAvatar] = useState(false);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);

  useEffect(() => {
    getFriendshipList();
    toggleInitialLoadStatus();
  }, []);

  // useEffect(() => {
  //   //Update Paper plane list when redux list gets updated
  //   setPaperPlanes(myProfile.paperPlanes?.data);
  // }, [myProfile]);

  /**
   * Gets the next pages of pagination from Paper Plane list from Backend
   * @method getPaperListNextPage
   **/
  async function getPaperListNextPage() {
    if (data?.length < 6) return;
    if (current_page >= pages_count) return;
    setFetchNextPage(true);
    UserProfileManager.fetchPaperPlanesMyProfile(current_page + 1)
      .then((paperPlanesList) => {
        // let newPaperPlaneList = [
        //   ...paperPlanes,
        //   ...paperList.paper_planes.data,
        // ];
        // setPagesCount(paperList.paper_planes.pages_count);
        // setPaperPlanes(newPaperPlaneList);
        // setFetchNextPage(false);
        // setPage(page + 1);
        setFetchNextPage(false);
        appendPaperPlanesRedux(paperPlanesList.data?.paper_planes);
      })
      .catch(() => {
        setFetchNextPage(false);
      });
  }
  /**
   * Add new paper plane page to redux
   * @method appendPaperPlanesRedux
   * @param {paperPlanes} - list of 6 new paper planes
   **/
  function appendPaperPlanesRedux(paperPlanesList) {
    const action = actionCreators.myProfile.appendPaperPlanes(paperPlanesList);
    store.dispatch(action);
  }

  async function getFriendshipList() {
    FriendshipManager.getFriendsList();
  }

  function goToFriendsList() {
    navigation.navigate('FriendsScreen', {
      friendships: props.userProfile.friendships,
    });
  }

  function toggleEditProfileModal(close?: boolean) {
    if (close) {
      setShowEditprofileModal(false);
    } else {
      setShowEditprofileModal(!showEditprofileModal);
    }
  }

  function toggleEnlargedUserAvatar() {
    if (showEnlargedUserAvatar === false) {
      const action = actionCreators.bottomTabBar.setVisibility(false);
      store.dispatch(action);
    }
    setShowEnlargedUserAvatar(!showEnlargedUserAvatar);
  }

  function toggleInitialLoadStatus() {
    setTimeout(() => {
      setShowLoadingIndicator(!showLoadingIndicator);
    }, 1000);
    setTimeout(() => {
      setHasLoadedInitially(!hasLoadedInitially);
    }, 1400);
  }

  const renderLoadingIncidator = useMemo(() => {
    return !hasLoadedInitially ? (
      <View style={styles.loadingIndicatorContainer}>
        <DefaultLoadingIndicator show={showLoadingIndicator} size={'large'} />
      </View>
    ) : null;
  }, [hasLoadedInitially, showLoadingIndicator]);

  function renderFriendsButton() {
    const { friendships } = props.userProfile;

    function compileAvatarListStyle() {
      switch (friendships?.length) {
        case 0:
        case 2:
          return {};
        case 1:
          return { marginRight: Globals.dimension.margin.tiny * 0.5 };
        case 3:
          return { marginRight: -Globals.dimension.margin.tiny };
        default:
          return { marginRight: -Globals.dimension.margin.tiny * 1.5 };
      }
    }

    return friendships?.length > 0 ? (
      <TouchableWithoutFeedback onPress={goToFriendsList}>
        <View style={styles.friendButtonContainer}>
          <View style={compileAvatarListStyle()}>
            <AvatarList
              data={friendships}
              onClick={goToFriendsList}
              iconSize={38}
              type={'myProfile'}
            />
          </View>
          <Text style={styles.friend}>Friends</Text>
        </View>
      </TouchableWithoutFeedback>
    ) : null;
  }

  function renderPrompts({ item }) {
    return (
      <View style={styles.promptContainer}>
        <Text style={styles.promptTitle}>{item.question}</Text>
        <Text style={styles.bioDescripton}>{item.answer}</Text>
      </View>
    );
  }

  function renderAddBioPlaceholder() {
    const { prompts, bio_text } = userProfile;
    return bio_text?.length > 0 || prompts?.length > 0 ? (
      <View style={styles.bioContainer}>
        <Text style={styles.bioDescripton}>{bio_text}</Text>
        <FlatList data={prompts} renderItem={renderPrompts} />
      </View>
    ) : null;
  }

  function renderEditProfileButton() {
    return <EditProfileIcon />;
  }

  const renderPaperPlanePreviewList = useMemo(() => {
    return (
      <PaperPlanePreviewList paperPlanes={data} loading={isLoadingEntries} />
    );
  }, [data, isLoadingEntries]);

  function buildProfileHeader() {
    return (
      <View style={styles.profileHeader}>
        {renderPaperPlanePreviewList}

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <UserAvatar
              size={100}
              uri={'data:image/png;base64,' + userProfile.profilePictureBase64}
              borderWidth={4}
              onclick={toggleEnlargedUserAvatar}
            />
          </View>

          <Text style={styles.name} numberOfLines={1}>
            {userProfile.name}
          </Text>
          {userProfile.location?.city || userProfile.location?.country ? (
            <Text style={styles.profileLocation} numberOfLines={1}>
              📍{' '}
              {`${userProfile.location?.city}${
                userProfile.location?.city !== '' ? ', ' : ' '
              }${userProfile.location?.country}`}{' '}
              {userProfile.location.country_code
                ? emojiFlags.countryCode(userProfile.location.country_code)
                    .emoji
                : null}
            </Text>
          ) : null}
          {renderFriendsButton()}
        </View>
      </View>
    );
  }

  function buildPostsHeaderBlock() {
    const { prompts, bio_text } = userProfile;
    return (
      <View style={styles.headerDescriptionContainer}>
        {(bio_text?.length === 0 || bio_text === null) &&
        (prompts?.length === 0 || prompts === undefined || prompts === null) ? (
          <TouchableWithoutFeedback onPress={() => toggleEditProfileModal()}>
            <View style={styles.addBioContainer}>
              <PlusIcon color={Globals.color.text.grey} />
              <Text style={styles.addBioDescription}>Add a bio</Text>
            </View>
          </TouchableWithoutFeedback>
        ) : null}
        {renderAddBioPlaceholder()}
        <View style={styles.postsHeaderBlock}>
          <Text style={styles.postsHeaderText}>
            Entries {isLoadingEntries ? '' : total_count}
          </Text>
        </View>
      </View>
    );
  }

  function renderItem({ item }) {
    return (
      <EntryItem
        item={item}
        navigation={navigation}
        returnRoute={'MyProfileScreen'}
        userProfile={userProfile}
      />
    );
  }

  function listHeaderComponent() {
    return (
      <View style={styles.headerContainer}>
        {buildProfileHeader()}
        {buildPostsHeaderBlock()}
      </View>
    );
  }

  function listEmptyComponent() {
    return (
      <View style={styles.noPapersContainer}>
        <IllustrationExplainer
          image={<NoPaperPlanesIcon />}
          headline={'We got you.'}
          description={
            'We make sure that you never lose a moment or thought. Paper planes that you throw out will appear here.'
          }
        />
      </View>
    );
  }

  const listFooterComponent = useMemo(
    () =>
      fetchNextPage ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator />
        </View>
      ) : null,
    [fetchNextPage],
  );

  const editProfileMoal = useMemo(
    () => (
      <EditProfileModal
        openModal={showEditprofileModal}
        toogleModal={toggleEditProfileModal}
        onClose={() => toggleEditProfileModal(true)}
        userProfile={userProfile}
      />
    ),
    [showEditprofileModal, userProfile],
  );

  return (
    <SafeAreaView style={styles.profileScreen}>
      <CustomHeaderBar
        onDismiss={toggleEditProfileModal}
        backgroundColor={Globals.color.background.light}
        customIcon={<SettingsIcon />}
        leftIcon={renderEditProfileButton()}
        onPress={() => navigation.navigate('SettingsScreen')}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item?.id}
        ListHeaderComponent={listHeaderComponent()}
        ListEmptyComponent={listEmptyComponent()}
        ListFooterComponent={listFooterComponent}
        onEndReachedThreshold={0.5}
        onEndReached={getPaperListNextPage}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        getItemLayout={(data, index) => ({
          length: paperPlaneHeight,
          offset: paperPlaneHeight * index,
          index,
        })}
      />
      {editProfileMoal}
      <EnlargedUserAvatar
        show={showEnlargedUserAvatar}
        toggleComponent={toggleEnlargedUserAvatar}
        uri={userProfile.profilePictureUrl}
      />
      <AnnouncementModal />
      {renderLoadingIncidator}
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(MyProfileScreen);

const styles = StyleSheet.create({
  profileScreen: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
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
    marginBottom: -40,
  },
  profileInfo: {
    top: -50,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationContainer: {
    flex: 1,
    paddingRight: Globals.dimension.padding.mini,
    marginTop: Globals.dimension.padding.tiny,
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
  followContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  followColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: Globals.dimension.padding.large,
  },
  followerCount: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.large,
  },
  followerText: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
  },
  postsHeaderBlock: {
    flexDirection: 'row',
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
    width: '100%',
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
  activityIndicator: {
    width: '100%',
    position: 'absolute',
    alignItems: 'center',
    bottom: 10,
  },
  noPaperPlaneIcon: {
    width: 160,
    height: 150,
  },
  noPapersContainer: {
    width: '100%',
  },
  noPapersTextBlock: {
    width: '100%',
    alignItems: 'center',
    paddingTop: Globals.dimension.padding.small,
  },
  noPaperTextTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    paddingTop: Globals.dimension.padding.mini,
  },
  noPaperParagraf: {
    marginTop: Globals.dimension.margin.tiny,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.padding.large,
    textAlign: 'center',
  },
  friendButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendButtonWrapper: {
    height: 33,
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: Globals.color.text.default,
    paddingHorizontal: Globals.dimension.padding.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friend: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    flex: 1,
  },
  friendsIcon: {
    marginRight: Globals.dimension.margin.tiny,
  },
  loadingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  flatListContainer: {
    width: '100%',
    paddingBottom: Globals.dimension.padding.large,
  },
  headerDescriptionContainer: {
    width: '100%',
    alignItems: 'center',
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
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    textAlign: 'center',
    marginTop: Globals.dimension.margin.tiny,
  },
  bioDescripton: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    marginBottom: Globals.dimension.margin.tiny,
  },
  promptContainer: {
    marginBottom: Globals.dimension.margin.tiny,
  },
  promptTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
  editIcon: {
    width: 22,
    height: 22,
  },
  loadingIndicatorContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Globals.color.background.light,
  },
  editButtonWrapper: {
    flexDirection: 'row',
  },
  edit: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
  },
  settingsIconContainer: {
    height: 40,
    width: 40,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Globals.dimension.margin.tiny,
  },
});
