import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import Globals from '../Globals';
import { SafeAreaView } from 'react-native-safe-area-context';
import Shimmer from 'react-native-shimmer';
import { LinearGradient } from 'expo-linear-gradient';
import UserAvatar from '../UserAvatar';
import UpVoteWidget from '../UpVoteWidget';
import ThreeDotsIcon from '../graphics/Icons/ThreeDotsIcon';
import AddReplyBox from '../AddReplyBox';
import NextIcon from '../graphics/Icons/NextIcon';

export default function PaperPlaneLoadingIndicator() {
  return (
    <Shimmer duration={750}>
      <LinearGradient style={styles.container} colors={['#3C3C3C', '#3C3C3C']}>
        <View style={styles.footer}>
          <SafeAreaView style={styles.footerWrapper}>
            <View style={styles.footerActionContainer}>
              <View style={styles.iconColumn}>
                <View style={styles.avatarContainer}>
                  <UserAvatar size={50} />
                  <View style={styles.friendShipButtonContainer}></View>
                </View>
                <UpVoteWidget
                  style={styles.upVote}
                  count={' '}
                  color={Globals.color.background.mediumgrey}
                />

                <View style={styles.threeDots}>
                  <ThreeDotsIcon color={Globals.color.background.mediumgrey} />
                </View>
              </View>
            </View>
            <View style={styles.replyContainer}>
              <AddReplyBox message={``} />
            </View>
          </SafeAreaView>
        </View>
      </LinearGradient>
    </Shimmer>
  );
}

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    alignItems: 'center',
    backgroundColor: Globals.color.background.dark,
  },
  footer: {
    width: width,
    bottom: 60,
    position: 'absolute',
    paddingBottom: Globals.dimension.padding.tiny,
  },
  footerWrapper: {
    width: width,
    alignItems: 'flex-end',
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
    marginTop: Globals.dimension.margin.tiny,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  nextButtonContainer: {
    height: 50,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Globals.dimension.margin.tiny,
    elevation: Globals.shadows.shading2.elevation,
    shadowOffset: Globals.shadows.shading2.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
  },
  iconColumn: {
    width: 75,
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.mini,
  },
  avatarContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 20,
  },
  upVote: {
    zIndex: 10,
    marginTop: Globals.dimension.margin.medium,
  },
  threeDots: {
    alignItems: 'center',
    marginTop: Globals.dimension.margin.small,
    height: 10,
    justifyContent: 'center',
  },
  friendShipButtonContainer: {
    height: 20,
    aspectRatio: 1,
    borderRadius: 100,
    backgroundColor: Globals.color.background.mediumgrey,
    position: 'absolute',
    bottom: -7,
  },
});
