import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  Animated,
} from 'react-native';
import {BlurView} from 'expo-blur';
import UserAvatar from './UserAvatar';
import Globals from './Globals';
import {actionCreators} from '../store/actions';
import {store} from '../store';


interface Props {
  uri: string;
  show: boolean;
  toggleComponent: () => void;
}

export default function EnlargedUserAvatar(props: Props) {
  const {uri, show, toggleComponent} = props;
  const AvatarSize = Dimensions.get('window').width * 0.8;
  const [active, setActive] = useState(false);
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (show) {
      setActive(true);
    } else {
      showNavigationBottomBar();
    }
    animateComponent();
  }, [show]);

  function animateComponent() {
    if (show) {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setActive(false);
      });
    }
  }

  function showNavigationBottomBar() {
    const action = actionCreators.bottomTabBar.setVisibility(true);
    store.dispatch(action);
  }

  return active ? (
    <TouchableWithoutFeedback onPress={toggleComponent}>
      <Animated.View style={{...styles.container, opacity: fade}}>
        <BlurView style={styles.wrapper} intensity={100} tint={'dark'}>
          <Animated.View style={{transform: [{scale: scale}]}}>
            <UserAvatar size={AvatarSize} uri={uri} borderWidth={5}/>
          </Animated.View>
        </BlurView>
      </Animated.View>
    </TouchableWithoutFeedback>
  ) : null;
}
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 20,
  },
  wrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarContainer: {
    padding: Globals.dimension.padding.small,
    overflow: 'hidden',
  },
});
