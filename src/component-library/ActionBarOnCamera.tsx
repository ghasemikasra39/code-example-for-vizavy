import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Globals from './Globals';
import { camera_flash, camera_flip } from './graphics/Images';
import FadeInOut from '../Animated Hooks/FadeInOut';
import CloseIcon from './graphics/Icons/CloseIcon';
import { LinearGradient } from 'expo-linear-gradient';
import WriteIcon from './graphics/Icons/WriteIcon';

interface Props {
  onDismiss: () => void;
  onTextEditor?: () => void;
  onToggleFlash?: () => void;
  onToogleCamera?: () => void;
  reply?: boolean;
  fadeIn?: boolean;
  onMedia?: boolean;
}

export default function ActionBarOnCamera(props: Props) {
  const renderActionBar = useMemo(
    () => (
      <FadeInOut fadeIn={props.fadeIn} style={styles.container} delay={100}>
        <LinearGradient
          style={styles.shading}
          colors={['rgba(0,0,0,0.5)', 'transparent']}
        />
        <View style={styles.actionBar}>
          <View style={{ flex: 0.5, alignItems: 'flex-start' }}>
            <TouchableOpacity
              onPress={() => props.onDismiss()}
              hitSlop={Globals.dimension.hitSlop.regular}>
              <CloseIcon />
            </TouchableOpacity>
          </View>
          {props.onMedia ? (
            <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
              <TouchableOpacity
                onPress={() => props.onTextEditor()}
                hitSlop={Globals.dimension.hitSlop.regular}>
                <WriteIcon color={Globals.color.text.light} />
              </TouchableOpacity>
            </View>
          ) : null}
          {!props.onMedia ? (
            <View
              style={{
                flex: 0.5,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => props.onToggleFlash()}
                hitSlop={Globals.dimension.hitSlop.regular}>
                <Image source={camera_flash} />
              </TouchableOpacity>
            </View>
          ) : null}
          {!props.onMedia ? (
            <View
              style={{
                flex: 0.5,
                alignItems: 'flex-end',
                justifyContent: 'center',
                paddingRight: Globals.dimension.padding.mini,
              }}>
              <TouchableOpacity
                onPress={() => props.onToogleCamera()}
                hitSlop={Globals.dimension.hitSlop.regular}>
                <Image source={camera_flip} />
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </FadeInOut>
    ),
    [props.fadeIn],
  );

  return renderActionBar;
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: Dimensions.get('window').height / 10,
    top: 0,
    justifyContent: 'flex-end',
  },
  shading: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  containerEditText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Globals.dimension.padding.medium,
    marginBottom: 5,
  },
  containerClose: {
    flex: 1,
    zIndex: 10,
  },
  hidden: {
    display: 'none',
  },
  editText: {
    marginTop: 10,
    marginRight: 13,
  },
});
