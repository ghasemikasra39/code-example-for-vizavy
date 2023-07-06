import React, { useRef, useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  ImageBackground,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Video from 'react-native-video';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from '../../component-library/UserAvatar';
import ToggleFriendButton from '../../component-library/ToggleFriendButton';
import FriendshipManager from '../../services/api/FriendshipManager';
import Globals from '../../component-library/Globals';
import UpVoteWidget from '../../component-library/UpVoteWidget';
import AddReplyBox from '../../component-library/AddReplyBox';
import PaperPlaneCommentManager from '../../services/api/PaperPlaneReplyManager';
import BlockReportModal from '../../modals/BlockReportModal';
import ReportBlockManager from '../../services/api/ReportBlockManager';
import UpVoteManager from '../../services/api/UpVoteManager';
import MixPanelClient, {
  UPVOTE_PAPER_PLANE,
} from '../../services/utility/MixPanelClient';
import PersistedMetric from '../../services/utility/PersistedMetric';
import UserProfileManager from '../../services/api/UserProfileManager';
import FadeInOut from '../../Animated Hooks/FadeInOut';
import ConfirmCancelModal from '../../modals/ConfirmCancelModal';
import { connect } from 'react-redux';
import HapticFeedBackWrapper from '../../component-library/HapticFeedBackWrapper';
import CloseIcon from '../../component-library/graphics/Icons/CloseIcon';
import ThreeDotsIcon from '../../component-library/graphics/Icons/ThreeDotsIcon';
import ReplyPaperPlaneComponent from '../../component-library/ReplyPaperPlaneComponent';
import QuickFeedbackComponent from '../../component-library/QuickFeedbackComponent';
import { BlurView } from 'expo-blur';
import SoundIcon from '../../component-library/graphics/Icons/SoundIcon';
import MuteSoundIcon from '../../component-library/graphics/Icons/MuteSoundIcon';
import VibrationPattern from '../../services/utility/VibrationPattern';
import DefaultLoadingIndicator from '../../component-library/LoadingIndicator/DefaultLoadingIndicator';
import { actionCreators } from '../../store/actions';
import { store } from '../../store';

const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

function PaperPlaneDetailsItem(props) {
  const {
    item,
    currentFocusedIndex,
    index,
    isFocused,
    returnRoute,
    userProfile,
    navigation,
  } = props;
  const videoRef = useRef().current;
  const emojiFlags = require('emoji-flags');
  const [isVideoMuted, setIsVideoMuted] = useState(false);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [] = useState(false);
  const [friendship, setFriendship] = useState(null);
  const [showBlockReportModal, setShowBlockReportModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [reportSuccessTitle, setReportSuccessTitle] = useState('');
  const [upvoted, setUpvoted] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [successTitle, setSuccessTitle] = useState('');
  const [scaleOut, setScaleOut] = useState(false);
  const [showReplyComponent, setShowReplyComponent] = useState(false);
  const [messageSentStatus, setMessageSentStatus] = useState('');
  const [showQuickReaction, setShowQuickReaction] = useState(false);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);

  useEffect(() => {
    initialLoad();
  }, []);

  useEffect(() => {
    if (currentFocusedIndex === index && isFocused) {
      setIsVideoPaused(false);
      checkFriendship();
    } else {
      setIsVideoPaused(true);
    }
  }, [currentFocusedIndex, isFocused]);

  /**
   * Report paper plane
   * @method reportPaperPlane
   */
  async function reportPaperPlane(reasons: Array<string>) {
    const {item} = props;
    const userId = item?.author?.internal_id;
    const paper_plane_uuId = item.id;
    setReporting(true);
    setReportSuccessTitle('');
    const result = await ReportBlockManager.reportPaperPlane(
      userId,
      paper_plane_uuId,
      reasons,
    );
    if (result.success) {
      setReportSuccessTitle('Report successful 👍');
    } else {
      setReportSuccessTitle('Report failed 😕');
    }
    setReporting(false);
    setTimeout(toggleBlockReportModal, 1000);
  }

  /**
   * Delete paper plane
   * @method deletePaperPlane
   */
  async function deletePaperPlane() {
    setDeleting(true);
    PaperPlaneCommentManager.deletePaperPlaneAsync(item?.id)
      .then(() => {
        setDeleting(false);
        setSuccessTitle('Successfully deleted 🙂');
        setTimeout(() => {
          setShowConfirmDeleteModal(false);
          navigation.goBack();
        }, 1000);
        setTimeout(deletePaperPlaneRedux, 1400);
      })
      .catch(() => {
        setDeleting(false);
        setSuccessTitle('Deleting failed 😕');
      });
  }

  function deletePaperPlaneRedux() {
    const action = actionCreators.myProfile.deletePaperPlane(item?.id);
    store.dispatch(action);
  }

  async function onLike() {
    if (upvoted) {
      setLikeCount(parseInt(likeCount, 10) - 1);
      setUpvoted(false);
    } else {
      setLikeCount(parseInt(likeCount, 10) + 1);
      setUpvoted(true);
    }
    setUpvoted(!upvoted);
    const response = await UpVoteManager.castVoteAsync(item?.id, !upvoted);
    if (response) {
      const upVoteCount = PersistedMetric.increment(UPVOTE_PAPER_PLANE);
      MixPanelClient.trackEvent(UPVOTE_PAPER_PLANE, {
        upVoteCount,
      });
      MixPanelClient.trackUserInformation({
        [UPVOTE_PAPER_PLANE]: upVoteCount,
      });
    }
  }

  function initialLoad() {
    setLikeCount(item?.upVotes);
    getLikedStatus();
    checkFriendship();
  }

  async function getLikedStatus() {
    const status = await UpVoteManager.fetchForPaperplaneAsync(item.id);
    if (status.success) {
      setUpvoted(status.upVoted);
      setLikeCount(status.count);
    }
  }

  /**
   * Turn the video sound on/off
   * @method toggleVideoSound
   */
  function toggleVideoSound() {
    setIsVideoMuted(!isVideoMuted);
  }

  /**
   * Hide Block/Report Modal
   * @method toggleBlockReportModal
   */
  function toggleBlockReportModal() {
    setScaleOut(!scaleOut);
    setShowBlockReportModal(!showBlockReportModal);
  }

  /**
   * Hide Confirm Delete Modal
   * @method toggleConfirmDeleteModal
   */
  function toggleConfirmDeleteModal() {
    setScaleOut(!scaleOut);
    setShowConfirmDeleteModal(!showConfirmDeleteModal);
  }

  /**
   * Toggle header and footer of screen
   * @method toggleFadeOut
   */
  function toggleFadeOut() {
    setFadeOut(!fadeOut);
  }

  async function sendFriendRequest() {
    //Check if you are not friends with the other user
    if (friendship === null) {
      const pendingFriendship = {
        id: 6265,
        approved_at: null,
      };
      VibrationPattern.doHapticFeedback();
      setFriendship(pendingFriendship);
      const response = await FriendshipManager.sendFriendshipRequest(
        item?.author?.internal_id,
      );
      setFriendship(response?.user?.friendship);
      if (!response.success) {
        setFriendship(null);
      }
    }
  }

  /**
   * Check if user is your friend in redux friendship list
   * @method checkFriendship
   */
  async function checkFriendship() {
    const status = await UserProfileManager.getFriendshipStatus(
      item?.author?.id,
    );
    if (status.success) {
      setFriendship(status?.friendship);
    }
  }

  function toggleReplyPaperPlaneComponent() {
    setShowReplyComponent(!showReplyComponent);
  }

  /**
   * Reply to paper plane
   * @method sendMessage
   */
  async function sendMessage(message: string) {
    setMessageSentStatus(message);
    setShowQuickReaction(true);
  }

  /**
   * Hide QuickReactionsModal
   * @method hideQuickReaction
   */
  function hideQuickReaction() {
    setShowQuickReaction(false);
    setMessageSentStatus('');
  }

  /**
   * Navigate to OtherUserProfileScreen
   * @method goToUserProfile
   */
  function goToUserProfile() {
    if (item && returnRoute !== 'MyProfileScreen') {
      navigation.navigate('UsersProfileScreen', {
        paperPlane: item,
        relatedUser: item?.author,
      });
    }
  }

  /**
   * Navigate back
   * @method navigateBack
   */
  function navigateBack() {
    navigation.goBack();
  }

  /**
   * Render follow icon
   * @method renderFollowIcon
   * @param userProfile - stores user data
   * @param paperPlane - stores paper plane data
   */
  const renderFollowIcon = useMemo(() => {
    const otherUserPaperPlane = returnRoute !== 'MyProfileScreen';
    return otherUserPaperPlane ? (
      <View style={styles.friendShipButtonContainer}>
        <ToggleFriendButton
          friendship={friendship}
          onPress={sendFriendRequest}
          shapeStyle={'tinyItemButton'}
        />
      </View>
    ) : null;
  }, [props.userProfile, props.item, friendship]);

  /**
   * Display the Header Block including (Profile, name, location, cancel Icon)
   * @method renderHeaderBlock
   * @param paperPlane - stores the paper plane data
   */
  function renderHeaderBlock() {
    return (
      <FadeInOut
        duration={200}
        fadeIn={!fadeOut}
        style={styles.headerContainer}>
        <View style={styles.headerBlock}>
          <TouchableWithoutFeedback onPress={goToUserProfile}>
            <View style={styles.userInfoBlock}>
              <Text style={styles.UserInfoName} numberOfLines={1}>
                {item?.author?.name}{' '}
                {item?.author?.location?.country_code
                  ? emojiFlags.countryCode(item?.author?.location?.country_code)
                      .emoji
                  : null}
              </Text>
              <View style={styles.locationContainer}>
                <Text style={styles.UserInfoLocation} numberOfLines={1}>
                  {item?.location?.city}
                  {item?.location?.city !== '' ? ',' : ''}{' '}
                  {item?.location?.country}
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </FadeInOut>
    );
  }

  const renderLoadingIndicator = useMemo(() => {
    return loadingMedia ? (
      <View style={styles.loadingContainer}>
        <DefaultLoadingIndicator show={showLoadingIndicator} />
      </View>
    ) : null;
  }, [loadingMedia, showLoadingIndicator]);

  function renderMediaBackground() {
    /**
     * Turn the video sound on/off
     * @method toggleVideoSound
     */
    function toggleVideoSound() {
      setIsVideoMuted(!isVideoMuted);
    }

    function renderShadingTop() {
      return (
        <LinearGradient
          style={styles.shadingContainerTop}
          colors={['rgba(0,0,0,0.3)', 'transparent']}
        />
      );
    }

    function renderShadingBottom() {
      return !returnRoute ? (
        <LinearGradient
          style={styles.shadingContainerBottom}
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,1)']}
        />
      ) : (
        <LinearGradient
          style={styles.shadingContainerBottom}
          colors={['transparent', 'rgba(0,0,0,0.3)']}
        />
      );
    }

    function startLoading() {
      setShowLoadingIndicator(true);
      setLoadingMedia(true);
    }

    function finishLoading() {
      setShowLoadingIndicator(false);
      setTimeout(() => setLoadingMedia(false), 400);
    }
    return (
      item && (
        <TouchableWithoutFeedback
          onPress={toggleVideoSound}
          onLongPress={toggleFadeOut}
          onPressOut={() => setFadeOut(false)}>
          <View style={styles.mediaContainer}>
            {item?.type === 'image' ? (
              <ImageBackground
                source={{ uri: item?.publicUrl }}
                style={styles.backgroundImage}
                onLoadStart={startLoading}
                onLoadEnd={finishLoading}
                resizeMode={item?.fromGallery ? 'contain' : 'cover'}>
                {item?.publicOverlayUrl ? (
                  <Image
                    style={styles.imageOverlay}
                    source={{ uri: item?.publicOverlayUrl }}
                  />
                ) : null}
                {item?.message && (
                  <View style={styles.textContainer}>
                    <Text style={styles.text}>{item?.message}</Text>
                  </View>
                )}
                {renderShadingTop()}
                {renderShadingBottom()}
              </ImageBackground>
            ) : (
              <View style={styles.video}>
                <Video
                  ref={videoRef}
                  source={{ uri: item?.publicUrl }}
                  style={styles.video}
                  onLoadStart={startLoading}
                  onLoad={finishLoading}
                  automaticallyWaitsToMinimizeStalling={false}
                  bufferConfig={{
                    minBufferMs: 0,
                    maxBufferMs: 0,
                    bufferForPlaybackMs: 0,
                    bufferForPlaybackAfterRebufferMs: 0,
                  }}
                  repeat={true}
                  paused={isVideoPaused}
                  resizeMode={item?.fromGallery ? 'contain' : 'cover'}
                  muted={isVideoMuted}
                  ignoreSilentSwitch={'ignore'}
                />
                {item?.publicOverlayUrl ? (
                  <Image
                    style={styles.imageOverlay}
                    source={{ uri: item?.publicOverlayUrl }}
                  />
                ) : null}
                {renderShadingTop()}
                {renderShadingBottom()}
              </View>
            )}
            {renderLoadingIndicator}
            {renderFooter()}
            {renderHeader()}
            {renderQuickReactionBox}
          </View>
        </TouchableWithoutFeedback>
      )
    );
  }

  /**
   * Display the paper plane media (Image/ Video)
   * @method renderFooter
   */
  function renderFooter() {
    /**
     * Render remove icon
     * @method renderRemoveIcon
     */
    function renderThreeDots() {
      const otherUser = userProfile?.id !== item?.author?.id;
      return (
        <HapticFeedBackWrapper
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() =>
            otherUser ? toggleBlockReportModal() : toggleConfirmDeleteModal()
          }>
          <View style={styles.threeDots}>
            <ThreeDotsIcon color={Globals.color.text.light} />
          </View>
        </HapticFeedBackWrapper>
      );
    }

    function compileFooterPosition() {
      let footerStyle = styles.footer;
      if (returnRoute) {
        footerStyle = {
          ...footerStyle,
          bottom: 0,
        };
      }
      return footerStyle;
    }

    return item && returnRoute !== 'DirectChatScreen' ? (
      <FadeInOut
        duration={200}
        fadeIn={!fadeOut}
        style={compileFooterPosition()}>
        <SafeAreaView style={styles.footerWrapper}>
          <View style={styles.footerActionContainer}>
            {renderHeaderBlock()}
            <View style={styles.iconColumn}>
              <View style={styles.avatarContainer}>
                <UserAvatar
                  onclick={goToUserProfile}
                  size={50}
                  uri={item?.author?.profilePicture}
                />
                {renderFollowIcon}
              </View>
              <UpVoteWidget
                style={styles.upVote}
                count={likeCount}
                onPress={onLike}
                upvoted={upvoted}
              />
              {item.type === 'video' && (
                <HapticFeedBackWrapper onPress={toggleVideoSound}>
                  <View style={styles.videoSoundToggle}>
                    {isVideoMuted ? (
                      <MuteSoundIcon color={Globals.color.background.light} />
                    ) : (
                      <SoundIcon color={Globals.color.background.light} />
                    )}
                  </View>
                </HapticFeedBackWrapper>
              )}
              {renderThreeDots()}
            </View>
          </View>
          {renderReplyBox()}
        </SafeAreaView>
      </FadeInOut>
    ) : null;
  }

  function renderReplyBox() {
    return (
      <View style={styles.replyContainer}>
        <AddReplyBox
          handleOnPress={toggleReplyPaperPlaneComponent}
          message={`Reply to ${item?.author?.name}...`}
        />
      </View>
    );
  }

  function renderHeader() {
    return (
      <SafeAreaView style={styles.searchHeaaderContainer}>
        {returnRoute ? (
          <TouchableWithoutFeedback onPress={navigateBack}>
            <View style={styles.closeIconContainer}>
              <CloseIcon size={12} />
            </View>
          </TouchableWithoutFeedback>
        ) : null}
      </SafeAreaView>
    );
  }

  const renderBlockReportModal = useMemo(
    () => (
      <BlockReportModal
        showBlockReportModal={showBlockReportModal}
        onCancel={toggleBlockReportModal}
        onConfirm={reportPaperPlane}
        loading={reporting}
        loadingFinishedTitle={reportSuccessTitle}
      />
    ),
    [reporting, reportSuccessTitle, showBlockReportModal],
  );

  const renderConfirmCancelModal = useMemo(
    () => (
      <ConfirmCancelModal
        showConfirmCancelModal={showConfirmDeleteModal}
        title={'Remove paper plane'}
        text={'Are you sure you want to remove your paper plane?'}
        confirmText={'No, cancel'}
        cancelText={'Remove'}
        toggleConfirmCancelModal={deletePaperPlane}
        onConfirm={toggleConfirmDeleteModal}
        myKey={'DeleteModal'}
        loading={deleting}
        successTitle={successTitle}
      />
    ),
    [showConfirmDeleteModal, deleting, successTitle],
  );

  const renderReplyPaperPlaneComponent = useMemo(() => {
    return (
      <ReplyPaperPlaneComponent
        messagePlaceholder={`Reply to ${item?.author?.name}...`}
        item={item}
        show={showReplyComponent}
        toggleView={toggleReplyPaperPlaneComponent}
        messageSent={sendMessage}
      />
    );
  }, [showReplyComponent]);

  const renderQuickReactionBox = useMemo(() => {
    return (
      messageSentStatus?.length > 0 && (
        <QuickFeedbackComponent
          message={messageSentStatus}
          show={showQuickReaction}
          toggleView={hideQuickReaction}
        />
      )
    );
  }, [showQuickReaction, messageSentStatus]);
  return (
    <TouchableWithoutFeedback
      onLongPress={toggleFadeOut}
      onPressOut={() => setFadeOut(false)}>
      <ImageBackground
        source={{ uri: item?.publicUrl }}
        style={styles.container}>
        <BlurView
          style={styles.coverBlurView}
          tint={'default'}
          intensity={100}
        />
        {renderMediaBackground()}
        {renderBlockReportModal}
        {renderConfirmCancelModal}
        {renderReplyPaperPlaneComponent}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
}

export default connect(mapStateToProps)(PaperPlaneDetailsItem);

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
  },
  mediaContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverBlurView: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    width: width,
    height: '100%',
  },
  shadingContainerBottom: {
    width: width,
    height: height * 0.35,
    position: 'absolute',
    bottom: 0,
  },
  shadingContainerTop: {
    width: width,
    height: height * 0.15,
    position: 'absolute',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerBlock: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingTop: Globals.dimension.padding.tiny,
    zIndex: 1,
  },
  avatarContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 20,
  },
  closeIconContainer: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: Globals.dimension.margin.small,
  },
  imageOverlay: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  userInfoBlock: {
    flex: 1,
    justifyContent: 'space-between',
    paddingRight: Globals.dimension.padding.tiny,
    zIndex: 0,
    marginBottom: Globals.dimension.margin.tiny,
  },
  UserInfoName: {
    fontFamily: Globals.font.family.bold,
    fontSize: 17,
    color: Globals.color.text.light,
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: Globals.dimension.padding.tiny,
  },
  locationIcon: {
    width: 13,
    height: 16,
    marginRight: Globals.dimension.padding.tiny,
  },
  UserInfoLocation: {
    color: Globals.color.text.light,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    textAlign: 'left',
    flex: 1,
  },
  closeButton: {
    flex: 1,
    zIndex: 20,
    alignItems: 'flex-end',
  },
  topButtonWrap: {
    zIndex: 1,
    width: 45,
    height: 45,
  },
  textContainer: {
    position: 'absolute',
    top: '40%',
    width: '100%',
    bottom: Globals.dimension.margin.small,
    justifyContent: 'center',
  },
  text: {
    width: '100%',
    color: Globals.color.brand.white,
    fontFamily: Globals.font.family.spec,
    fontSize: 17,
    fontWeight: '700',
    textAlignVertical: 'center',
    textAlign: 'center',
    alignItems: 'center',
    padding: Globals.dimension.padding.tiny,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  video: {
    width: width,
    height: '100%',
  },
  footer: {
    width: width,
    bottom: 60,
    position: 'absolute',
    paddingBottom: Globals.dimension.padding.tiny,
  },
  footerWrapper: {
    width: width,
  },
  footerActionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  replyWrapper: {
    width: '100%',
  },
  replyContainer: {
    width: width,
    marginTop: Globals.dimension.margin.tiny * 0.5,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  nextButtonContainer: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Globals.dimension.margin.tiny,
    elevation: Globals.shadows.shading2.elevation,
    shadowOffset: Globals.shadows.shading2.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
  },
  searchHeaaderContainer: {
    width: width,
    position: 'absolute',
    top: 0,
  },
  inspirationContainer: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  inspirationIcon: {
    marginRight: Globals.dimension.margin.tiny,
    width: 35,
    height: 35,
  },
  inspirationText: {
    fontFamily: Globals.font.family.regular,
    color: Globals.color.text.light,
    fontSize: Globals.font.size.medium,
    marginRight: Globals.dimension.margin.large * 2,
  },
  iconColumn: {
    width: 75,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.mini,
  },
  videoSoundToggle: {
    alignSelf: 'center',
    marginTop: Globals.dimension.margin.small,
  },
  videoSoundToggleImage: {
    width: 34,
    height: 34,
  },
  upVote: {
    zIndex: 10,
    marginTop: Globals.dimension.margin.medium,
  },
  repliesWidget: {
    alignItems: 'center',
    alignContent: 'space-between',
    zIndex: 10,
    paddingBottom: Globals.dimension.padding.mini,
  },
  repliesList: {
    position: 'absolute',
    bottom: 0,
  },
  removeIconHitSlope: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  threeDots: {
    alignItems: 'center',
    marginTop: Globals.dimension.margin.small,
    height: 10,
    justifyContent: 'center',
  },
  followIconAnimation: {
    position: 'absolute',
    height: 33,
    width: 33,
  },
  onboardingContainer: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: Globals.dimension.padding.medium,
    zIndex: 1,
  },
  onBoardingWrapper: {
    top: Dimensions.get('window').height / 9,
  },
  onboardingtext: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge * 0.8,
    color: Globals.color.text.light,
    lineHeight: Globals.font.lineHeight.large,
  },
  focusArrow: {
    transform: [{ rotateX: '180deg' }, { rotate: '70deg' }],
    marginBottom: Globals.dimension.margin.small,
    left: Globals.dimension.padding.mini,
  },

  arrowUpAnimation: {
    width: 100,
    height: 100,
    transform: [{ scaleX: -1 }, { rotate: '-15deg' }],
    marginBottom: Globals.dimension.margin.small,
  },
  friendShipButtonContainer: {
    position: 'absolute',
    bottom: -7,
  },
  loadingContainer: {
    width: width,
    height: height,
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
