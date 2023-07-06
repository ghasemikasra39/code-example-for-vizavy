import React from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Globals from './Globals';
import { store } from '../store';
import { popupProps } from '../store/slices/PopupSlice';
import { MyProfileProps } from '../store/slices/MyProfileSlice';
import MyProfileSlice from '../store/slices/MyProfileSlice';
import { connect } from 'react-redux';
import BackendApiClient from '../services/api/BackendApiClient';
import Button from './Button';
import { close_icon } from './graphics/Images';
import PaperPlaneManager from '../services/api/PaperPlaneManager';
import { actionCreators } from '../store/actions';
import {
  CATCH_PP_FAILED,
  PP_UPLOAD_FAILED,
  PP_UPLOAD_LOADING,
  PP_UPLOAD_SUCCESSFUL,
} from '../store/slices/PopupSlice';
import PaperPlaneCommentManager from '../services/api/PaperPlaneReplyManager';
import {Bugtracker} from "../services/utility/BugTrackerService";

const connectProps = state => ({
  ...popupProps(state),
  myProfile: MyProfileProps(state),
});

class UploadPaperPlaneStatus extends React.Component<Props, {}> {
  slide = new Animated.Value(0);

  componentDidUpdate() {
    const { state } = this.props;
    switch (state) {
      case PP_UPLOAD_SUCCESSFUL:
      case CATCH_PP_FAILED:
        this.animateFadeOut(500, 250);
        setTimeout(() => {
          const action = actionCreators.myProfile.setFailedPPs(null);
          store.dispatch(action);
          store.dispatch({
            type: 'popup/setPopup',
            payload: {
              enable: false,
              state: '',
              message: '',
            },
          });
        }, 750);
        break;
    }
  }

  animateFadeOut = (duration, timeout) => {
    setTimeout(
      () =>
        Animated.timing(this.slide, {
          toValue: Dimensions.get('window').width,
          duration: duration,
          useNativeDriver: true,
        }).start(() => {
          store.dispatch({
            type: 'popup/setPopup',
            payload: {
              enable: false,
              state: '',
              message: '',
            },
          });
        }),
      timeout,
    );
  };

  compileContainerStyle() {
    const { uploadFailed } = this.props;
    let backgroundStyle = styles.container;
    if (uploadFailed) {
      backgroundStyle = {
        ...backgroundStyle,
        ...{ backgroundColor: Globals.color.brand.primary },
      };
    }
    return backgroundStyle;
  }

  compileTextStyle() {
    const { uploadFailed } = this.props;
    let fontStyle = styles.description;
    if (uploadFailed) {
      fontStyle = {
        ...fontStyle,
        ...{ color: Globals.color.text.light },
      };
    }
    return fontStyle;
  }

  /**
   * Dismiss the alert box
   * @method onDismiss
   */
  onDismiss = () => {
    const { setFailedPPs } = this.props;
    this.animateFadeOut(0, 0);
    setFailedPPs(null);
  };

  /**
   * Handle re-upload for the failed PP or failed reply
   * @method handleReUpload
   */
  handleReUpload = () => {
    const { myProfile } = this.props;
    const failedPPRequestConfig = JSON.parse(myProfile.failedPPs);
    switch (failedPPRequestConfig.url) {
      case '/paperplane':
        PaperPlaneManager.reUploadMediaAsync(failedPPRequestConfig);
        break;
      case '/paperplane-comments':
        PaperPlaneCommentManager.reUploadReplyAsync(failedPPRequestConfig);
        break;
    }
  };

  render() {
    const { enable } = this.props;
    return enable ? this.renderUploadView() : null;
  }

  /**
   * Render the content of the popup
   * @method renderUploadView
   * @return {React.JSX} - the JSX to be rendered
   */
  renderUploadView = () => (
    <Animated.View
      style={{
        ...this.compileContainerStyle(),
        transform: [{ translateX: this.slide }],
      }}>
      {this.renderUploadText()}
      <TouchableOpacity
        onPress={this.onDismiss}
        hitSlop={Globals.dimension.hitSlop.regular}
        style={styles.closeIcon}>
        {this.renderCloseIcon()}
      </TouchableOpacity>
      {this.renderActionButton()}
    </Animated.View>
  );

  /**
   * Fetch first 20 PPs for the myProfile
   * @function updateMyProfilePPs
   */
  updateMyProfilePPs = async () => {
    const { setPaperPlanes } = this.props;
    const promise = BackendApiClient.requestAuthorized({
      method: 'GET',
      url: `/paperplane/list?filter_group=Profile&page=1&page_size=20`,
    });

    promise.then(
      paperList => store.dispatch(setPaperPlanes(paperList.data.paper_planes)),
      err => Bugtracker.captureException(err, {scope: 'UploadPaperPlaneStatus'}),
    );
  };

  /**
   * Render the button of the popup
   * @method renderActionButton
   * @return {React.JSX} - the JSX to be rendered
   */
  renderActionButton = () => {
    const { state } = this.props;
    switch (state) {
      case PP_UPLOAD_LOADING:
        return (
          <View style={styles.activityIndicator}>
            <ActivityIndicator color={Globals.color.text.grey} size="large" />
          </View>
        );
      case PP_UPLOAD_FAILED:
        return (
          <Button
            title={<Text style={styles.buttonLabel}>Upload</Text>}
            light
            onPress={this.handleReUpload}
            style={styles.shadowAndroid}
          />
        );
      default:
        return <View style={{ minHeight: 10 }} />;
    }
  };

  /**
   * Render the close icon on the top right-hand corner
   * @method renderCloseIcon
   * @return {React.JSX} - the JSX to be rendered
   */
  renderCloseIcon = () => {
    const { state } = this.props;
    return state === PP_UPLOAD_FAILED ? <Image source={close_icon} /> : null;
  };

  /**
   * Render the message of the popup
   * @method renderUploadText
   * @return {React.JSX} - the JSX to be rendered
   */
  renderUploadText = () => {
    const { state, message } = this.props;
    switch (state) {
      case PP_UPLOAD_LOADING:
        return <Text style={this.compileTextStyle()}>{message}</Text>;
      case PP_UPLOAD_SUCCESSFUL:
        // update the PPs on myProfile, so that it contains the newly added PP
        this.updateMyProfilePPs();
        return <Text style={this.compileTextStyle()}>{message}</Text>;
      case PP_UPLOAD_FAILED:
      case CATCH_PP_FAILED:
        return <Text style={this.compileTextStyle()}>{message}</Text>;
      default:
        return null;
    }
  };
}

export default connect(
  connectProps,
  MyProfileSlice.actions,
)(UploadPaperPlaneStatus);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Dimensions.get('window').height / 9,
    width: Dimensions.get('window').width,
    backgroundColor: Globals.color.brand.white,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  description: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.medium,
    textAlign: 'center',
    color: Globals.color.text.grey,
    lineHeight: 25,
    alignSelf: 'center',
    marginTop: 10,
  },
  buttonLabel: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.default,
  },
  shadowAndroid: {
    backgroundColor: Globals.color.background.light,
    elevation: 15,
    borderRadius: Globals.dimension.borderRadius.large,
    width: 120,
    alignSelf: 'center',
  },
  bottomSpacerActivity: {
    marginBottom: 50,
    padding: Globals.dimension.padding.small,
  },
  closeIcon: {
    position: 'absolute',
    flex: 1,
    right: 3,
    paddingTop: 5,
  },
  activityIndicator: { minHeight: 80, justifyContent: 'center' },
});
