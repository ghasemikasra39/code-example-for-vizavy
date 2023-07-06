import React from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import Globals from './Globals';
import { userIcon } from '../component-library/graphics/Images';


interface Props {
  uri: string;
  size?: number;
  onclick?: () => void;
  nagivagion?: () => void;
  disableShaddow?: boolean;
  borderWidth?: number;
}
export default function UserAvatar(props: Props) {
  const { uri, size, onclick, disableShaddow, borderWidth } = props;
  function compileWrapper() {
    if (disableShaddow) {
      return {};
    }
    return styles.userProfilePictureWrap;
  }

  function compilePictureStyle() {
    let pictureStyle = styles.userProfilePicture;
    if (size) {
      pictureStyle = {
        ...pictureStyle,
        width: size,
        height: size,
      };
    }
    if (props.borderWidth) {
      pictureStyle = {
        ...pictureStyle,
        borderWidth: borderWidth,
      };
    }
    return pictureStyle;
  }

  return (
    <TouchableWithoutFeedback onPress={onclick}>
      <View style={compileWrapper()}>
        <Image
          style={compilePictureStyle()}
          source={
            uri
              ? {
                  uri: uri,
                }
              : userIcon
          }
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  userProfilePictureWrap: {
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowColor: Globals.color.background.grey,
    elevation: 8,
  },
  userProfilePicture: {
    borderRadius: 1000,
    borderColor: Globals.color.brand.white,
    borderWidth: 3,
    width: 36,
    height: 36,
  },
});
