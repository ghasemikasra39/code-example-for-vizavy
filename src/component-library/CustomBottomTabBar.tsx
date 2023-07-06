import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Text,
} from 'react-native';
import { Dimensions } from 'react-native';
import Globals from './Globals';
import MapButton from './graphics/Navigation/MapButton';
import { useNavigation } from '@react-navigation/native';
import ProfileButton from './graphics/Navigation/ProfileButton';
import NotificationButton from './graphics/Navigation/NotificationButton';
import { LinearGradient } from 'expo-linear-gradient';
import CouchButton from './graphics/Navigation/CouchButton';
import { connect } from 'react-redux';
import PaperPlaneIcon from './graphics/Icons/PaperPlaneIcon';
import { BlurView } from 'expo-blur';
import MessageIcon from './graphics/Icons/MessageIcon';

const mapStateToProps = ({
  chatRoom,
  appStatus,
  bottomTabBar,
  directChat,
}) => ({
  chatRoom,
  appStatus,
  bottomTabBar,
  directChat,
});

function CustomBottomTabBar(props) {
  const { state, directChat, chatRoom, bottomTabBar, appStatus } = props;
  const navigation = useNavigation();
  const [hasNews, setHasNews] = useState(false);

  useEffect(() => {
    getNewCount();
  }, [chatRoom.roomData]);

  function getNewCount() {
    const hasNewMessages = !!chatRoom.roomData.find(
      (room) => room.new_message_count > 0,
    );
    setHasNews(hasNewMessages);
  }

  function navigationHelper(screen: string) {
    navigation.navigate(screen);
  }

  function navigateToScreen(index: number) {
    switch (index) {
      case 0:
        navigationHelper('DiscoverScreen');
        break;
      case 1:
        navigationHelper('DirectRoomsScreen');
        break;
      case 2:
        navigation.navigate('TakePaperPlaneScreen');
        break;
      case 3:
        navigationHelper('Rooms');

        break;
      case 4:
        navigationHelper('MyProfileScreen');
        break;
    }
  }

  const renderNewMessageCount = useMemo(() => {
    const { directChatList } = directChat;
    let total_new_message_count = 0;
    directChatList.forEach((directChat) => {
      total_new_message_count += directChat.new_message_count;
    });

    return total_new_message_count > 0 ? (
      <View style={styles.countContainer}>
        <Text style={styles.count}>{total_new_message_count}</Text>
      </View>
    ) : null;
  }, [directChat.directChatList]);

  function sendPaperPlaneButton() {
    function compileGradientStyle() {
      if (state.index === 0) {
        return ['transparent', 'transparent'];
      }
      return Globals.gradients.primary;
    }

    return (
      <View style={styles.sendButtonContainer}>
        <View style={compileOpacityStyle()}>
          <TouchableOpacity
            style={styles.sendButtonWrapper}
            onPress={() => navigateToScreen(2)}>
            <LinearGradient
              style={styles.sendButtonGradient}
              colors={compileGradientStyle()}>
              <PaperPlaneIcon />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function compileBackgroundStyle() {
    let backgroundStyle = styles.background;
    if (state.index === 0) {
      backgroundStyle = {
        ...backgroundStyle,
        backgroundColor: 'transparent',
      };
    }
    return backgroundStyle;
  }

  function compileDotStyle() {
    let dotStyle = styles.dotContainer;
    if (state.index === 0) {
      dotStyle = {
        ...dotStyle,
        backgroundColor: Globals.color.background.light,
      };
    }
    return dotStyle;
  }

  function compileOpacityStyle() {
    if (state.index === 0) {
      return {
        opacity: 0.5,
      };
    }
  }

  function compileContainerStyle() {
    let containerStyle = styles.container;
    if (state.index === 0) {
      containerStyle = {
        ...containerStyle,
        backgroundColor: Globals.color.background.dark,
        borderTopStartRadius: null,
        borderTopEndRadius: null,
      };
    }
    return containerStyle;
  }

  return bottomTabBar.visibility ? (
    <SafeAreaView style={compileContainerStyle()}>
      <View style={compileBackgroundStyle()}>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigateToScreen(0)}>
          <MapButton style={styles.icon} focused={state.index === 0} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigateToScreen(1)}>
          <View style={compileOpacityStyle()}>
            <MessageIcon
              style={styles.icon}
              focused={state.index === 1}
              fade={state.index === 0}
            />
            {renderNewMessageCount}
          </View>
        </TouchableOpacity>
        {sendPaperPlaneButton()}

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigateToScreen(3)}>
          {hasNews || !appStatus.onboardingRoomsSeen ? (
            <View style={compileDotStyle()} />
          ) : null}
          <View style={compileOpacityStyle()}>
            <CouchButton
              style={styles.icon}
              focused={state.index === 2}
              fade={state.index === 0}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => navigateToScreen(4)}>
          <View style={compileOpacityStyle()}>
            <ProfileButton
              style={styles.icon}
              focused={state.index === 3}
              fade={state.index === 0}
            />
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  ) : null;
}

export default connect(mapStateToProps)(CustomBottomTabBar);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: Globals.color.background.light,
    borderTopStartRadius: Globals.dimension.borderRadius.mini,
    borderTopEndRadius: Globals.dimension.borderRadius.mini,
  },
  background: {
    width: Dimensions.get('window').width,
    height: 50,
    flexDirection: 'row',
    backgroundColor: Globals.color.background.light,
    paddingHorizontal: Globals.dimension.padding.tiny,
    elevation: 8,
    shadowColor: Globals.color.background.grey,
    shadowOffset: {
      height: -30,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
    borderTopStartRadius: Globals.dimension.borderRadius.mini,
    borderTopEndRadius: Globals.dimension.borderRadius.mini,
  },
  iconWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: Globals.dimension.margin.tiny * 0.5,
  },
  buttonTitle: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.xTiny - 1,
    color: Globals.color.text.grey,
    textAlign: 'center',
  },
  sendButtonContainer: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonWrapper: {
    width: 45,
    aspectRatio: 1,
    borderWidth: 2.5,
    borderColor: Globals.color.background.light,
    borderRadius: 100,
    overflow: 'hidden',
  },
  sendButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotContainer: {
    width: 7,
    height: 7,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    position: 'absolute',
    alignSelf: 'flex-end',
    top: 4,
    right: 14,
  },
  countContainer: {
    position: 'absolute',
    height: 20,
    minWidth: 20,
    borderColor: Globals.color.background.light,
    borderWidth: 1,
    paddingHorizontal: 5,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    top: -10,
    right: -7,
  },
  count: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.brand.white,
    fontSize: Globals.font.size.xTiny,
  },
});
