import React, { useMemo } from 'react';
import { StyleSheet, View, Dimensions, Image, Text } from 'react-native';
import Modal from '../component-library/Modal';
import Globals from '../component-library/Globals';
import Swiper from 'react-native-swiper';
import AnnouncementManager from '../services/api/AnnouncementManager';
import { connect } from 'react-redux';

const mapStateToProps = ({ appStatus }) => ({
  appStatus,
});

const sliderWidth = Dimensions.get('window').width;
function AnnouncementModal(props) {
  const { newUnseenFeatureList } = props.appStatus;

  /**
   * Mark newly launched feature as seen in redux
   * @method markNewFeatureAsSeen
   */
  function markNewFeatureAsSeen() {
    AnnouncementManager.markAnnouncementSeen();
  }

  function inActiveDot() {
    return newUnseenFeatureList?.length > 1 ? (
      <View style={styles.dotContainer} />
    ) : null;
  }

  function activeDot() {
    return newUnseenFeatureList?.length > 1 ? (
      <View style={styles.activeDotContainer} />
    ) : null;
  }

  function renderItem(item) {
    return (
      <View style={styles.announcementContainer}>
        <Image
          source={{ uri: item?.image_url }}
          style={styles.image}
          resizeMode={'contain'}
        />
        <View style={styles.descriptionContainer}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text style={styles.description}>{item?.description}</Text>
        </View>
      </View>
    );
  }

  function renderAnnouncements() {
    try {
      return newUnseenFeatureList?.map((item) => renderItem(item));
    } catch (error) {
      return null;
    }
  }

  const renderSlider = useMemo(() => {
    return (
      <Modal
        key={'AnnouncementModal'}
        placement="bottom"
        modalheightType={'modal1'}
        isVisible={newUnseenFeatureList?.length > 0}
        onClosed={markNewFeatureAsSeen}>
        <View style={styles.container}>
          <Text style={styles.newTitle}>What's New 🎉</Text>
          <Swiper
            horizontal={true}
            dot={inActiveDot()}
            activeDot={activeDot()}
            paginationStyle={styles.dotPosition}>
            {renderAnnouncements()}
          </Swiper>
        </View>
      </Modal>
    );
  }, [newUnseenFeatureList]);

  return renderSlider;
}

export default connect(mapStateToProps)(AnnouncementModal);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    paddingTop: Globals.dimension.padding.small,
  },
  image: {
    width: sliderWidth,
    height: sliderWidth * 0.7,
    alignSelf: 'center',
  },
  announcementContainer: {
    flex: 1,
  },
  descriptionContainer: {
    paddingVertical: Globals.dimension.padding.small,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  newTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny,
    textAlign: 'center',
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.tiny,
  },
  description: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
  },
  dotContainer: {
    width: 9,
    height: 9,
    backgroundColor: Globals.color.background.grey,
    borderRadius: 100,
    marginHorizontal: Globals.dimension.margin.tiny,
  },
  activeDotContainer: {
    width: 9,
    height: 9,
    backgroundColor: Globals.color.brand.primary,
    borderRadius: 100,
    marginHorizontal: Globals.dimension.margin.tiny,
  },
  dotPosition: {
    bottom: 0,
  },
});
