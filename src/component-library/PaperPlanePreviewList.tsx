import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, FlatList, Dimensions } from 'react-native';
import Globals from './Globals';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  paperPlanes: Array<object>;
  loading: boolean;
}

export default function PaperPlanePreviewList(props: Props) {
  const { paperPlanes, loading } = props;
  const MIN_PAPER_PLANES = 25;
  const LOADING_PAPER_PLANE_LIST = Array.from(Array(MIN_PAPER_PLANES).keys());
  const [previewList, setPreviewList] = useState([]);

  useEffect(() => {
    if (paperPlanes?.length > MIN_PAPER_PLANES) {
      setPreviewList(paperPlanes);
      return;
    }
    if (paperPlanes !== undefined) {
      let newPaperPlaneList = [];
      if (paperPlanes.length === 0) return;
      const lastSixPaperPlanes = paperPlanes.slice(0, 6);
      const multiplier = MIN_PAPER_PLANES / lastSixPaperPlanes.length;
      const roundedUpMultiplier = Math.ceil(multiplier);
      for (let i = 0; i < roundedUpMultiplier; i++) {
        const concatinatedList = newPaperPlaneList.concat(lastSixPaperPlanes);
        newPaperPlaneList = concatinatedList;
      }
      setPreviewList(newPaperPlaneList);
    }
  }, [paperPlanes]);

  function renderPreviewPaperPlane(item) {
    return !loading && previewList?.length > 0 ? (
      <View>
        <Image
          style={styles.paperPlanePreviewItem}
          source={{ uri: item?.item?.publicThumbnailUrl }}
        />
      </View>
    ) : (
      <View style={styles.loadingContainer} />
    );
  }
  return (
    <View style={styles.previewListContainer}>
      <FlatList
        data={
          !loading && previewList?.length > 0
            ? previewList
            : LOADING_PAPER_PLANE_LIST
        }
        renderItem={renderPreviewPaperPlane}
        numColumns={6}
        style={styles.previewPaperPlaneList}
      />
      <LinearGradient
        style={styles.bottomGradientOverlay}
        colors={['rgba(255,255,255,0)', Globals.color.background.light]}
      />
      <LinearGradient
        style={styles.topGradientOverlay}
        colors={[Globals.color.background.light, 'rgba(255,255,255,0)']}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  previewListContainer: {
    width: '100%',
    aspectRatio: 2.5,
    overflow: 'hidden',
    alignItems: 'center',
  },
  previewPaperPlaneList: {
    top: -100,
    transform: [{ rotate: '-35deg' }],
  },
  bottomGradientOverlay: {
    width: '100%',
    height: '40%',
    position: 'absolute',
    bottom: 0,
  },
  topGradientOverlay: {
    width: '100%',
    height: '40%',
    position: 'absolute',
    top: 0,
  },
  paperPlanePreviewItem: {
    width: Dimensions.get('window').width / 5,
    aspectRatio: 0.8,
    borderRadius: Globals.dimension.borderRadius.tiny,
    margin: Globals.dimension.margin.tiny * 0.2,
    backgroundColor: Globals.color.background.mediumgrey,
  },
  loadingContainer: {
    width: Dimensions.get('window').width / 5,
    aspectRatio: 0.8,
    borderRadius: Globals.dimension.borderRadius.tiny,
    margin: Globals.dimension.margin.tiny * 0.2,
    backgroundColor: Globals.color.background.mediumgrey,
  },
});
