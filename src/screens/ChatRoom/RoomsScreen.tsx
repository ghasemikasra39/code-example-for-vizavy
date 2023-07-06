import React, { useMemo, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  Dimensions,
} from 'react-native';
import Globals from '../../component-library/Globals';
import { roomIcon } from '../../component-library/graphics/Images';
import { useNavigation } from '@react-navigation/native';
import RoomItem from '../../component-library/ChatRoom/RoomItem';
import { connect } from 'react-redux';
import Swipeable from 'react-native-swipeable';
import { LinearGradient } from 'expo-linear-gradient';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';
import ChatRoomManager from '../../services/api/ChatRoomManager';
import InitialLoadingService from '../../services/utility/InitialLoadingService';
import TinyArrow from '../../component-library/graphics/Icons/TinyArrow';
import ConfirmCancelModal from '../../modals/ConfirmCancelModal';
import MixPanelClient, {
  VISIT_THIS_WEEK,
} from '../../services/utility/MixPanelClient';
import AnnouncementModal from '../../modals/AnnouncementModal';
import SearchHeader from '../../component-library/SearchHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrashIcon from '../../component-library/graphics/Icons/TrashIcon';
import DefaultLoadingIndicator from '../../component-library/LoadingIndicator/DefaultLoadingIndicator';


const mapStateToProps = ({ userProfile, chatRoom, appStatus }) => ({
  userProfile,
  chatRoom,
  appStatus,
});

function RoomsScreen(props) {
  const { appStatus, chatRoom, userProfile } = props;
  const { showInitialLoadingIndicator } = appStatus;
  const navigation = useNavigation();
  const [deletingRoom, setDeletingRoom] = useState(false);
  const [removeRoom, setRemoveRoom] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEligible, setIsEligible] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [todaySelected, setTodaySelected] = useState(true);
  const [deletingRoomSuccessTitle, setDeletingRoomSuccessTitle] = useState('');
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const { roomData, inactiveRooms } = props.chatRoom;

  useEffect(() => {
    checkEligibilty();
    checkForAdminRole();
    navigation.addListener('blur', onDidBlur);

    return () => navigation.removeListener('blur', onDidBlur);
  }, [props.userProfile]);

  useEffect(() => {
    toggleInitialLoadStatus();
  }, []);

  function onDidBlur() {
    markOnboardingRoomTextSeen();
  }

  /**
   * Check if user is elegible to create rooms
   * @function checkEligibilty
   */
  function checkEligibilty() {
    if (
      props.userProfile.roles?.find(
        (element) =>
          element === 'ROLE_ADMIN' ||
          element === 'ROLE_CHAT_ROOM_MANAGER' ||
          element === 'ROLE_PUBLIC_CHAT_ROOM_MANAGER',
      )
    ) {
      setIsEligible(true);
    } else {
      setIsEligible(false);
    }
  }

  /**
   * Check if user is an admin
   * @function checkForAdminRole
   */
  function checkForAdminRole() {
    if (
      !!props.userProfile.roles?.find((element) => element === 'ROLE_ADMIN')
    ) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }

  /**
   * Delete a single room
   * @function deleteRoom
   * @param {number} roomId - specific room id
   */
  async function deleteRoom() {
    setDeletingRoom(true);
    ChatRoomManager.deleteSingleChatRoomAsync(removeRoom)
      .then((response) => {
        if (response.success) {
          if (todaySelected) {
            const action = actionCreators.chatRoom.deleteRoom({
              id: removeRoom,
            });
            store.dispatch(action);
          } else {
            deleteRoomFromThisWeek(removeRoom);
          }

          setDeletingRoomSuccessTitle('Successfully deleted your room 😊');
          setShowDeleteModal(false);
        } else {
          setDeletingRoomSuccessTitle('Failed to delete your room 😕');
        }
        setDeletingRoom(false);
        setShowDeleteModal(false);
      })
      .catch((err) => {
        setDeletingRoom(false);
        setShowDeleteModal(false);
      });
  }

  /**
   * Delete a room from this week
   * @function deleteRoomFromThisWeek
   * @param {roomId - number} - Id of room that should be deleted
   */
  function deleteRoomFromThisWeek(roomId: number) {
    const action = actionCreators.chatRoom.deleteInActiveRoom(roomId);
    store.dispatch(action);
  }

  /**
   * Toggle the delete modal and set the id of the room that will be deleted
   * @function toggleDeleteModal
   */
  function toggleDeleteModal(id?: number) {
    setShowDeleteModal(!showDeleteModal);
    if (id) {
      setRemoveRoom(id);
    } else {
      setRemoveRoom(null);
    }
  }

  /**
   * Mark onboarding text for today tab as seen
   * @function markOnboardingRoomTextSeen
   */
  function markOnboardingRoomTextSeen() {
    if (props.appStatus.onboardingRoomsSeen) return;
    const action = actionCreators.appStatus.markOnboardingRoomsSeen(true);
    store.dispatch(action);
  }

  /**
   * Mark the onboarding room as seen
   * @function openOnboardingRoom
   */
  function openOnboardingRoom() {
    if (props.appStatus.onboardingRoomsSeen) return;
    const action = actionCreators.appStatus.markFirstRoom(true);
    store.dispatch(action);
  }

  /**
   * Load all the rooms
   * @function fetchRooms
   */
  function fetchRooms() {
    InitialLoadingService.fetchRooms();
  }

  /**
   * Mark rooms from this week as seen
   * @function markThisWeekOboardingSeen
   */
  function markThisWeekOboardingSeen() {
    if (props.appStatus.onboardingRoomsThisWeekSeen) return;
    const action = actionCreators.appStatus.markOnboardingRoomsThisWeekSeen(
      true,
    );
    store.dispatch(action);
  }

  /**
   * Toogle between Today and This week
   * @function toogleRoomsPicker
   */
  function toogleRoomsPicker() {
    setTodaySelected(!todaySelected);
    if (todaySelected) {
      markOnboardingRoomTextSeen();
      MixPanelClient.trackEvent(VISIT_THIS_WEEK);
    } else {
      markThisWeekOboardingSeen();
    }
  }

  function toggleInitialLoadStatus() {
    setTimeout(() => {
      setShowLoadingIndicator(!showLoadingIndicator);
    }, 1000);
    setTimeout(() => {
      setHasLoadedInitially(!hasLoadedInitially);
    }, 1400);
  }

  function compileArrowRotation() {
    let arrowStyle = styles.arrow;
    if (!todaySelected) {
      arrowStyle = {
        ...arrowStyle,
        transform: [{ scaleY: -1 }],
      };
    }
    return arrowStyle;
  }

  const renderLoadingIncidator = useMemo(() => {
    return !hasLoadedInitially ? (
      <View style={styles.loadingContainer}>
        <DefaultLoadingIndicator show={showLoadingIndicator} size={'large'} />
      </View>
    ) : null;
  }, [hasLoadedInitially, showLoadingIndicator])

  function renderShading() {
    return (
      <LinearGradient
        style={styles.scrollShading}
        colors={['rgba(255,255,255,1)', 'rgba(255,255,255,0)']}
      />
    );
  }

  const roomsPicker = useMemo(() => {
    return (
      <TouchableOpacity
        style={styles.pickerContainer}
        onPress={toogleRoomsPicker}>
        <Text style={styles.pickerText}>
          {todaySelected ? 'Today' : 'This Week'}
        </Text>
        <TinyArrow style={compileArrowRotation()} />
      </TouchableOpacity>
    );
  }, [todaySelected]);

  const onboardingTextRooms = useMemo(() => {
    return !props.appStatus.onboardingRoomsSeen && todaySelected ? (
      <View style={styles.headerWrapper}>
        <Text style={styles.onboardingTitle}>Meet your rooms tab!</Text>
        <Text style={styles.onboardingDescription}>
          Join public group conversations or start one with your friends about
          topics you care about.
        </Text>
      </View>
    ) : null;
  }, [props.appStatus.onboardingRoomsSeen, todaySelected]);

  const onBoardingTextRoomsThisWeek = useMemo(() => {
    return !props.appStatus.onboardingRoomsThisWeekSeen && !todaySelected ? (
      <View style={styles.headerWrapper}>
        <Text style={styles.onboardingDescription}>
          Here, you can see expired rooms from the past week. Since the
          conversations are over, you can’t write or react to messages anymore
          😊
        </Text>
      </View>
    ) : null;
  }, [props.appStatus.onboardingRoomsThisWeekSeen, todaySelected]);

  const createRoomButton = useMemo(() => {
    return isEligible ? (
      <TouchableOpacity
        style={styles.createRoomContainer}
        onPress={() => navigation.navigate('CreateRoom')}>
        <View style={styles.createRoomWrapper}>
          <View style={styles.roomIconContainer}>
            <Image source={roomIcon} style={styles.roomIcon} />
          </View>
          <View style={styles.newRoomTextWrapper}>
            <Text style={styles.newRoom}>+ New Room</Text>
            <Text style={styles.startConversation}>
              Create a room, start a conversation!
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    ) : null;
  }, [isEligible]);

  function listHeaderComponent() {
    return (
      <View style={styles.headerContainer}>
        {roomsPicker}
        {onboardingTextRooms}
        {onBoardingTextRoomsThisWeek}
        {createRoomButton}
      </View>
    );
  }

  function renderItem({ item, index }) {
    const buttons = (<View style={styles.shadowContainer}>
      <TouchableOpacity
        style={styles.deleteWrapper}
        onPress={() => toggleDeleteModal(item.id)}>
        <LinearGradient
          style={styles.deleteGradient}
          colors={[item.color_1, item.color_2]}>
          <TrashIcon />
        </LinearGradient>
      </TouchableOpacity>
    </View>);
    const rightButtons = [
      <View style={styles.deleteContainer}>
        {props.userProfile?.id === item?.app_user?.id || isAdmin
          ? buttons
          : null}
      </View>,
    ];
    if (!item.is_direct) {
      return (
        <Swipeable
          disable={props.userProfile?.id !== item?.app_user?.id}
          rightButtonWidth={140}
          rightButtons={rightButtons}>
          <RoomItem
            room={item}
            index={index}
            userProfile={props.userProfile}
            showFirstRoomShimmer={item.is_onboarding && !props.appStatus.markFirstRoom}
            markFirstRoomAsOpened={openOnboardingRoom}
            today={todaySelected}
          />
        </Swipeable>
      );
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchHeader title={'Rooms'} />
      <FlatList
        keyExtractor={(item) => item?.id.toString()}
        data={todaySelected ? roomData : inactiveRooms}
        onRefresh={fetchRooms}
        refreshing={chatRoom.loading || showInitialLoadingIndicator}
        ListHeaderComponent={listHeaderComponent}
        contentContainerStyle={{ paddingBottom: Globals.dimension.padding.xlarge }}
        renderItem={renderItem}
      />
      {renderShading()}
      <ConfirmCancelModal
        key={'DeleteRoomModal'}
        showConfirmCancelModal={showDeleteModal}
        confirmText={'Remove'}
        cancelText={'No, cancel'}
        title={'Delete room'}
        text={`Are you sure you want to delete your room?`}
        toggleConfirmCancelModal={toggleDeleteModal}
        onConfirm={deleteRoom}
        loading={deletingRoom}
        successTitle={deletingRoomSuccessTitle}
      />
      <AnnouncementModal />
      {renderLoadingIncidator}
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(RoomsScreen);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '95%',
    backgroundColor: Globals.color.background.light,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    paddingTop: Dimensions.get('window').height / 16,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: Globals.dimension.margin.mini,
  },
  headerWrapper: {
    width: '93%',
    paddingTop: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.tiny,
  },
  createRoomContainer: {
    width: '93%',
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.borderRadius.mini,
    justifyContent: 'center',
    paddingTop: Globals.dimension.margin.mini,
    marginVertical: Globals.dimension.margin.tiny,
    elevation: Globals.shadows.shading1.elevation,
    shadowOffset: Globals.shadows.shading1.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
  },
  createRoomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Globals.dimension.margin.mini,
    paddingBottom: Globals.dimension.padding.mini,
  },
  roomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Globals.dimension.margin.mini,
  },
  newRoomTextWrapper: {
    marginLeft: Globals.dimension.margin.tiny,
  },
  newRoom: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    fontSize: Globals.font.size.medium,
  },
  startConversation: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.tiny,
  },
  roomIconContainer: {
    borderRadius: 100,
    shadowColor: Globals.color.brand.primary,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
  },
  roomIcon: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    width: 40,
    height: 40,
  },
  deleteContainer: {
    height: '100%',
    width: Dimensions.get('window').width / 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowContainer: {
    elevation: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  deleteWrapper: {
    width: 50,
    height: 50,
    borderWidth: 3,
    borderColor: Globals.color.background.light,
    borderRadius: 100,
    overflow: 'hidden',
  },
  deleteGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge * 0.8,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny,
  },
  onboardingDescription: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny,
    lineHeight: Globals.font.lineHeight.small,
  },
  emptyContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: Globals.dimension.padding.small,
  },
  groupChatIcon: {
    width: 180,
    height: 170,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    paddingTop: Globals.dimension.padding.mini,
  },
  description: {
    marginTop: Globals.dimension.margin.tiny,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.padding.large,
    textAlign: 'center',
  },
  pickerContainer: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: Globals.color.background.light,
    alignSelf: 'flex-start',
    paddingHorizontal: Globals.dimension.padding.mini,
    marginHorizontal: Globals.dimension.margin.mini,
    borderRadius: Globals.dimension.borderRadius.large,
    marginBottom: Globals.dimension.margin.tiny,
    elevation: Globals.shadows.shading1.elevation,
    shadowOffset: Globals.shadows.shading1.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
    alignItems: 'center',
  },
  pickerText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  arrow: {
    marginLeft: Globals.dimension.margin.tiny * 0.5,
  },
  scrollShading: {
    width: '100%',
    height: '4%',
    position: 'absolute',
    top: Dimensions.get('window').height / 10 - 2,
  },
  loadingContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: Globals.color.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Globals.dimension.padding.large,
    position: 'absolute',
  },
});
