import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from 'react-native';
import NotificationsManager from '../../services/api/NotificationsManager';
import NotificationListItem from '../../component-library/NotificationListItem';
import Globals from '../../component-library/Globals';
import { LinearGradient } from 'expo-linear-gradient';
import { store } from '../../store';
import { actionCreators } from '../../store/actions';

import { useNavigation } from '@react-navigation/native';
import FriendRequestListItem from '../../component-library/FriendRequestListItem';
import FriendshipManager from '../../services/api/FriendshipManager';
import { TabView, TabBar } from 'react-native-tab-view';
import IllustrationExplainer from '../../component-library/IllustrationExplainer';
import AnnouncementModal from '../../modals/AnnouncementModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import DefaultLoadingIndicator from '../../component-library/LoadingIndicator/DefaultLoadingIndicator';
import NoFriendRequestsIcon from '../../component-library/graphics/Icons/NoFriendRequestsIcon';
import NoNotificationsIcon from '../../component-library/graphics/Icons/NoNotificationsIcon';
import InitialLoadingService, {
  RequestsEnum,
} from '../../services/utility/InitialLoadingService';
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import CloseIcon from '../../component-library/graphics/Icons/CloseIcon';

const mapStateToProps = ({ userProfile, notifications, appStatus }) => ({
  userProfile,
  notifications,
  appStatus,
});

function NotificationsScreen(props) {
  const { userProfile, notifications, appStatus } = props;
  const {
    data,
    current_page,
    pages_count,
    total_count,
  } = notifications.notifications;
  const { showInitialLoadingIndicator } = appStatus;
  const navigation = useNavigation();
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);
  const [showLoadingIndicator, setShowLoadingIndicator] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [routes] = React.useState([
    { key: 'Notifications', title: 'Notifications' },
    { key: 'Requests', title: 'Requests' },
  ]);
  const [index, setIndex] = React.useState(0);

  useEffect(() => {
    toggleInitialLoadStatus();
    navigation.addListener('blur', onDidBlur);
    navigation.addListener('focus', onDidFocus);

    return () => {
      navigation.removeListener('blur', onDidBlur);
      navigation.removeListener('focus', onDidFocus);
    };
  }, []);

  /**
   * is called when the user leave the screen (component remains mounted)
   * @method onDidBlur
   */
  function onDidBlur() {
    store.dispatch(actionCreators.notifications.cancel());
  }

  function onDidFocus() {
    NotificationsManager.resetNotificationsCount();
  }

  function refresh() {
    InitialLoadingService.loadAllData([
      RequestsEnum.NOTIFICATIONS,
      RequestsEnum.FRIENDSHIP_REQUESTS,
    ]);
  }

  async function onEndReached() {
    if (current_page >= pages_count) return;
    setIsLoading(true);
    NotificationsManager.loadNotifiations(current_page + 1).then((response) => {
      setIsLoading(false);
      if (!response?.success) return;
      appendNotificationsRedux(response?.notifications);
    });
  }

  function appendNotificationsRedux(newNotifications) {
    const action = actionCreators.notifications.appendNotifications(
      newNotifications,
    );
    store.dispatch(action);
  }

  function toggleInitialLoadStatus() {
    setTimeout(() => {
      setShowLoadingIndicator(!showLoadingIndicator);
    }, 600);
    setTimeout(() => {
      setHasLoadedInitially(!hasLoadedInitially);
    }, 850);
  }

  function compileActiveStatusTitleStyle(focus: boolean) {
    let titleStyle = styles.title;
    if (!focus) {
      titleStyle = {
        ...titleStyle,
        color: Globals.color.text.grey,
      };
    }
    return titleStyle;
  }

  function renderCloseIcon() {
    return (
      <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
        <View style={styles.closeIconContainer}>
          <CloseIcon color={Globals.color.text.default} size={12} />
        </View>
      </TouchableWithoutFeedback>
    );
  }

  const renderLoadingIncidator = useMemo(() => {
    return !hasLoadedInitially ? (
      <View style={styles.loadingContainer}>
        <DefaultLoadingIndicator show={showLoadingIndicator} size={'large'} />
      </View>
    ) : null;
  }, [hasLoadedInitially, showLoadingIndicator]);

  function listEmptyComponent() {
    return (
      <View style={styles.noNotificationsWrap}>
        <IllustrationExplainer
          image={<NoNotificationsIcon />}
          headline={'No Notifications'}
          description={
            ' Your notifications from paper planes will be displayed here.'
          }
        />
      </View>
    );
  }

  function listFooterComponent() {
    return isLoading ? <ActivityIndicator /> : null;
  }

  function renderNoFriendRequests() {
    return (
      <View style={styles.noNotificationsWrap}>
        <IllustrationExplainer
          image={<NoFriendRequestsIcon />}
          headline={'No Requests'}
          description={'Your friend requests will appear here.'}
        />
      </View>
    );
  }

  function renderItem({ item }) {
    return (
      <NotificationListItem
        userProfile={userProfile}
        notification={item}
        seenNotification={(id) => setNewNotificationId(id)}
      />
    );
  }

  function renderFriendRequestItem({ item }) {
    return (
      <FriendRequestListItem
        requestId={item?.id}
        user={item?.user}
        requestCreateAt={item?.createdAt}
      />
    );
  }

  const requestsList = useMemo(() => {
    const { friendRequests } = notifications;
    return (
      <FlatList
        data={friendRequests}
        renderItem={renderFriendRequestItem}
        ListEmptyComponent={renderNoFriendRequests()}
        contentContainerStyle={styles.notificationList}
        refreshing={showInitialLoadingIndicator}
        onRefresh={refresh}
      />
    );
  }, [notifications.friendRequests, showInitialLoadingIndicator]);

  const notificationsList = useMemo(() => {
    return (
      <View>
        <FlatList
          data={data}
          refreshing={showInitialLoadingIndicator}
          onRefresh={refresh}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          onEndReachedThreshold={0.2}
          onEndReached={onEndReached}
          contentContainerStyle={styles.notificationList}
          ListEmptyComponent={listEmptyComponent()}
          ListFooterComponent={listFooterComponent()}
        />
      </View>
    );
  }, [notifications, isLoading, showInitialLoadingIndicator]);

  const renderLabel = ({ route, focused }) => {
    const { friendRequests } = props.notifications;
    const requestsCount =
      friendRequests?.length > 0 ? friendRequests?.length : null;
    if (route.key === 'Requests') {
      return (
        <View style={styles.requestsTitleContainer}>
          <Text style={compileActiveStatusTitleStyle(focused)}>
            {route.title} {requestsCount ? '( ' + requestsCount + ' )' : null}
          </Text>
          {requestsCount ? <View style={styles.newRequestsDot} /> : null}
        </View>
      );
    }
    return (
      <Text style={compileActiveStatusTitleStyle(focused)}>{route.title}</Text>
    );
  };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'Notifications':
        return notificationsList;
      case 'Requests':
        return requestsList;
      default:
        return null;
    }
  };

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicatorStyle}
      style={styles.tabBar}
      renderLabel={renderLabel}
    />
  );

  const initialLayout = { width: Dimensions.get('window').width };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        text={'New'}
        isTransparent
        userProfileInitialized={false}
        customIcon={renderCloseIcon()}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
      />
      <LinearGradient
        colors={[
          'rgba(255,255,255,0)',
          'rgba(255,255,255,0.8)',
          'rgba(255,255,255,1)',
        ]}
        style={styles.gradientOverlay}
      />
      {renderLoadingIncidator}
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(NotificationsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
  },
  notificationList: {
    paddingTop: Globals.dimension.padding.mini,
    paddingBottom: Globals.dimension.padding.xlarge,
  },
  noNotificationsWrap: {
    width: '100%',
    paddingTop: Globals.dimension.padding.small,
  },
  noNotificationsHeadline: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    paddingTop: Globals.dimension.padding.mini,
  },
  noNotificationsDescription: {
    marginTop: Globals.dimension.margin.tiny,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.padding.large,
    textAlign: 'center',
  },
  noNotificationIcon: {
    width: 180,
    height: 160,
  },
  bottomSpacer: {
    height: 180,
  },
  bottomSpacerActivity: {
    bottom: 120,
    padding: Globals.dimension.padding.small,
  },
  gradientOverlay: {
    height: 50,
    width: '100%',
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  footerContainer: {
    width: '100%',
    padding: Globals.dimension.padding.small,
  },
  titleContainer: {
    width: '100%',
    padding: Globals.dimension.padding.mini,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  noRequestsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Globals.dimension.padding.small,
  },
  noRequestsDescription: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  friendRequestIcon: {
    width: 164,
    height: 150,
  },
  scene: {
    flex: 1,
    backgroundColor: Globals.color.background.lightgrey,
  },
  indicatorStyle: {
    backgroundColor: Globals.color.text.default,
    height: 3,
    borderRadius: 100,
  },
  tabBar: {
    backgroundColor: Globals.color.background.light,
  },
  requestsTitleContainer: {
    flexDirection: 'row',
  },
  newRequestsDot: {
    width: 7,
    height: 7,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    marginLeft: Globals.dimension.margin.tiny,
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
  closeIconContainer: {
    width: 30,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
