import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from 'react-native';
import Globals from './Globals';
import { PaperPlaneInterface } from '../services/api/PaperPlaneManager';
import { LinearGradient } from 'expo-linear-gradient';
import { videoIcon } from './graphics/Images';
import { UserProfileStatePropsInterface } from '../store/slices/UserProfileSlice';

interface Props {
  item: PaperPlaneInterface;
  navigation: any;
  userProfile?: UserProfileStatePropsInterface;
  returnRoute: string;
  relatedUser?: Object;
}

export default function EntryItem(props: Props) {
  const { item, navigation, returnRoute, userProfile } = props;
  const MONTHS = [
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

  function openPaperPlane() {
    navigation.push('PaperPlaneDetailsScreen', {
      item,
      returnRoute: returnRoute,
      userProfile: userProfile,
    });
  }

  /**
   * Gets the date for the profile entries
   * @method  onDidFocus
   **/
  function getMonth(item: PaperPlaneInterface): string {
    const date = new Date(item?.createdAt);
    const month = MONTHS[date.getMonth()]?.toString()?.substring(0, 3);
    return `${month}`;
  }

  function getDay(item: PaperPlaneInterface): string {
    const date = new Date(item?.createdAt);
    const day = date.getDate();
    return `${day}`;
  }

  const renderEntryItem = useMemo(() => {
    return (
      <TouchableWithoutFeedback onPress={openPaperPlane}>
        <View style={styles.container}>
          <View style={styles.paperPlanes} key={item?.id}>
            <Image
              style={styles.imageBackground}
              source={
                item?.publicThumbnailUrl
                  ? { uri: item?.publicThumbnailUrl }
                  : null
              }
              resizeMode={'cover'}
            />
            {item?.type === 'video' ? (
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent']}
                style={styles.recordIconContainer}>
                <Image source={videoIcon} />
              </LinearGradient>
            ) : null}
            {returnRoute === 'MyProfileScreen' ? (
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.5)']}
                style={styles.paperPlanesText}>
                <Text style={styles.paperPlanesTextData} numberOfLines={1}>
                  {getDay(item)}
                </Text>
                <Text style={styles.paperPlanesTextData} numberOfLines={1}>
                  {getMonth(item)}
                </Text>
              </LinearGradient>
            ) : null}
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }, []);

  return renderEntryItem;
}

const halfWidth = Dimensions.get('window').width / 2;
const styles = StyleSheet.create({
  container: {
    width: halfWidth,
    alignItems: 'center',
  },
  paperPlanes: {
    width: '93%',
    borderRadius: Globals.dimension.borderRadius.mini,
    marginBottom: Globals.dimension.margin.tiny,
    overflow: 'hidden',
  },
  paperPlanesText: {
    width: '100%',
    paddingBottom: Globals.dimension.padding.tiny,
    paddingLeft: Globals.dimension.padding.tiny * 1.2,
    position: 'absolute',
    bottom: 0,
  },
  paperPlanesTextData: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.light,
    fontSize: Globals.font.size.small,
    textTransform: 'uppercase',
  },
  imageBackground: {
    width: '100%',
    aspectRatio: 0.9,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.mini,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  recordIconContainer: {
    width: '100%',
    height: 20,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingTop: Globals.dimension.padding.tiny * 1.5,
    paddingRight: Globals.dimension.padding.tiny * 1.2,
    position: 'absolute',
  },
});
