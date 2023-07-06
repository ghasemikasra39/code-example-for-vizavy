import React, { useMemo, useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  SafeAreaView,
} from 'react-native';
import Globals from '../component-library/Globals';
import {
  firstExplainerPhone,
  thirdExplainerPhone,
  secondExplainerPhone,
} from '../component-library/graphics/Images';
import { LinearGradient } from 'expo-linear-gradient';
import Carousel from 'react-native-snap-carousel';
import { useNavigation } from '@react-navigation/native';
import BackArrowIcon from '../component-library/graphics/Icons/BackArrowIcon';
import HapticFeedBackWrapper from '../component-library/HapticFeedBackWrapper';
import ChatRoomManager from '../services/api/ChatRoomManager';
import MixPanelClient, {
  SIGN_UP_VIA_ROOM_INVITE,
} from '../services/utility/MixPanelClient';
import CodePushService from '../services/utility/CodePushService';
import { connect } from 'react-redux';

/**
 * Map Redux state to the props
 * @function mapStateToProps
 * @param {Redux state}
 * @return {Object} maps state to props
 */
const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

const DATA = [
  {
    image: firstExplainerPhone,
    title: '1. Meet',
    description:
      'Leave your thought and moments as paper planes for others to discover.',
    gradient: ['#E34965', '#F1004E'],
    style: {
      left: -30,
    },
  },
  {
    image: secondExplainerPhone,
    title: '2. Chat',
    description: 'Reply to paper planes to start a conversation.',
    gradient: ['#F48083', '#E86875'],
    style: {
      left: -20,
    },
  },
  {
    image: thirdExplainerPhone,
    title: '3. Join rooms',
    description:
      'Talk about topics you love with people from around the world.',
    gradient: ['#FAAEA1', '#F48083'],
    style: {
      left: -37,
    },
  },
];

function ExplainerSequenceScreen(props) {
  const { appStatus } = props;
  const navigation = useNavigation();
  const carouselRef = useRef();
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * Finish the signup
   * @function finishSignup
   */
  function finishSignup() {
    // navigation.navigate('PaperPlane');
    function handleOpenViaDynamicLink() {
      navigation.navigate('PaperPlane', { screen: 'Rooms' });
      //If the app has been opened with a dynamic link, navigate to ChatRoom screen
      ChatRoomManager.getRoomByLink(appStatus.dynamicLink);

      //Track if user signs up via invite link
      MixPanelClient.trackEvent(SIGN_UP_VIA_ROOM_INVITE);
    }

    function handleNoReturnRoute() {
      if (appStatus.dynamicLink) {
        handleOpenViaDynamicLink();
      } else {
        navigation.navigate('PaperPlane', {
          screen: 'Discover',
        });
        CodePushService.getCodePushUpdate();
      }
    }
    handleNoReturnRoute();
  }

  /**
   * Update the current focus index when snapping to an explainer screen
   * @function onSnapToItem
   */
  function onSnapToItem() {
    const index = carouselRef.current.currentIndex;
    setCurrentIndex(index);
  }

  /**
   * Navigate forward in the explainer sequence
   * @function moveForward
   */
  function moveForward() {
    if (currentIndex === 2) {
      finishSignup();
      return;
    }
    carouselRef.current?.snapToNext();
  }

  function compileButtonTextStyle() {
    let buttonStyle = styles.buttonText;
    if (currentIndex === 2) {
      buttonStyle = {
        ...buttonStyle,
        color: Globals.color.text.light,
      };
    }

    return buttonStyle;
  }

  function compileButtonStyle() {
    let buttonStyle = styles.buttonContainer;
    if (currentIndex === 2) {
      buttonStyle = {
        ...buttonStyle,
        backgroundColor: Globals.color.brand.primary,
      };
    }
    return buttonStyle;
  }

  function renderItem({ item }) {
    return (
      <LinearGradient style={styles.wrapper} colors={item.gradient}>
        <SafeAreaView style={styles.wrapper}>
          <View style={styles.explainerWrapper}>
            <View style={styles.titleContainer}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>{item.title}</Text>
              </View>
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </View>
          <Image
            style={[styles.image, item.style]}
            source={item.image}
            resizeMode={'contain'}
          />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const renderDots = useMemo(() => {
    function compileDotsStyle(index: number) {
      let dotStyle = styles.dotContainer;
      if (currentIndex === index) {
        dotStyle = {
          ...dotStyle,
          ...{
            backgroundColor: Globals.color.background.light,
            width: 25,
          },
        };
      }
      return dotStyle;
    }
    return (
      <View style={styles.dotWrapper}>
        {DATA.map((item, index) => {
          return (
            <SafeAreaView>
              <View style={compileDotsStyle(index)} />
            </SafeAreaView>
          );
        })}
      </View>
    );
  }, [currentIndex]);

  return (
    <View style={styles.wrapper}>
      <Carousel
        ref={carouselRef}
        data={DATA}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        itemHeight={height}
        itemWidth={width}
        renderItem={renderItem}
        onSnapToItem={onSnapToItem}
        sliderHeight={height}
        sliderWidth={width}
        enableSnap={true}
        decelerationRate={0}
        horizontal
      />
      <SafeAreaView style={styles.footer}>
        <View>{renderDots}</View>
        <HapticFeedBackWrapper onPress={moveForward}>
          <View style={compileButtonStyle()}>
            <Text style={compileButtonTextStyle()}>
              {currentIndex === 2 ? 'Finish' : 'Next'}
            </Text>
            <BackArrowIcon
              color={
                currentIndex !== 2
                  ? Globals.color.brand.primary
                  : Globals.color.background.light
              }
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </View>
        </HapticFeedBackWrapper>
      </SafeAreaView>
    </View>
  );
}

export default connect(mapStateToProps)(ExplainerSequenceScreen);

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  wrapper: {
    width: width,
    height: '100%',
  },
  explainerWrapper: {
    width: width,
    marginTop: Globals.dimension.padding.mini,
    justifyContent: 'center',
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.light,
    textAlign: 'center',
    marginBottom: Globals.dimension.margin.tiny,
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  description: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.light,
    lineHeight: Globals.dimension.padding.small,
    textAlign: 'center',
    paddingHorizontal: Globals.dimension.padding.medium,
  },
  dotContainer: {
    width: 7,
    height: 7,
    backgroundColor: Globals.color.background.grey,
    borderRadius: 100,
    marginHorizontal: Globals.dimension.margin.tiny,
  },
  activeDotContainer: {
    width: 25,
    height: 9,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    marginHorizontal: Globals.dimension.margin.tiny,
  },
  image: {
    flex: 0.95,
    alignSelf: 'center',
  },
  submitButton: {
    marginBottom: Globals.dimension.margin.small,
  },
  footer: {
    width: width * 0.9,
    alignSelf: 'center',
    bottom: 0,
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: Globals.dimension.padding.mini,
    alignItems: 'center',
    position: 'absolute',
  },
  buttonContainer: {
    height: 40,
    paddingHorizontal: Globals.dimension.padding.mini,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: Globals.color.background.light,
  },
  buttonText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.brand.primary,
    marginRight: Globals.dimension.margin.tiny,
  },
  dotWrapper: {
    flexDirection: 'row',
  },
});
