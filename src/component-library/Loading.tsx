import React, { useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import Globals from './Globals';
import { connect } from 'react-redux';
import ScaleInOut from '../Animated Hooks/ScaleInOut';
import { actionCreators } from '../store/actions';
import { store } from '../store';
import { close_icon_black } from './graphics/Images';
import DefaultLoadingIndicator from './LoadingIndicator/DefaultLoadingIndicator';

const mapStateToProps = ({ chatRoom }) => ({
  chatRoom,
});

function Loading(props) {
  const { loadingSingleRoom } = props.chatRoom;
  function toggleLoadingModal() {
    const loading = actionCreators.chatRoom.setLoadingSingleRoom(false);
    store.dispatch(loading);
  }

  const loadingConatiner = useMemo(() => {
    return (
      <ScaleInOut
        style={styles.container}
        delay={500}
        start={!loadingSingleRoom}
        scaleValue={0}
        initialScale={0.001}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={styles.closeIconWrapper}
            onPress={toggleLoadingModal}
            hitSlop={Globals.dimension.hitSlop.regular}>
            <Image source={close_icon_black} style={styles.closeButton} />
          </TouchableOpacity>
          <DefaultLoadingIndicator show={loadingSingleRoom} />
          <Text style={styles.loading}>Hang on ☺️</Text>
          <Text style={styles.loadingDescription}>
            We are loading the room you have been invited to.
          </Text>
        </View>
      </ScaleInOut>
    );
  }, [loadingSingleRoom]);

  return loadingConatiner;
}

export default connect(mapStateToProps)(Loading);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: Globals.color.background.light,
    borderRadius: Globals.dimension.borderRadius.small,
    padding: Globals.dimension.padding.small,
    elevation: 8,
    shadowOffset: {
      height: 5,
      width: 0,
    },
    shadowRadius: 60,
    shadowOpacity: 0.2,
    overflow: 'visible',
  },
  loading: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginVertical: Globals.dimension.margin.tiny,
    textAlign: 'center',
  },
  loadingDescription: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    textAlign: 'center',
    lineHeight: Globals.font.lineHeight.small,
  },
  closeContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: Globals.dimension.padding.mini,
  },
  closeIconWrapper: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: Globals.dimension.padding.mini,
    right: 5,
  },
  closeButton: {
    width: 15,
    height: 15,
  },
});
