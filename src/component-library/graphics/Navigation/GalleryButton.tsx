import * as React from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View, Image } from 'react-native';
// import { ButtonComponentProps } from 'react-navigation-tabs/lib/typescript/src/types';
import Globals from '../../Globals';
import { TouchableOpacity } from 'react-native-gesture-handler';
import {galleryIcon} from '../../graphics/Images';

interface Props {

}
interface Props {
  openGallery?: () => void;
}

export default class GalleryButton extends React.Component<Props> {

  render() {
    return (
      <View style={[this.props.style, styles.container]}>
        <TouchableOpacity
          onPress={() =>
            this.props.openGallery()
          }
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
  
         <Image source={galleryIcon}/>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    zIndex: 1,
  },
});
