import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Globals from '../../component-library/Globals';

import PermissionRequester from '../../services/utility/PermissionRequester';
import * as ImagePicker from 'expo-image-picker';
import HighlightText from '@sanar/react-native-highlight-text';
import AddProfilePictureIcon from '../../component-library/graphics/Icons/AddProfilePictureIcon';

interface Props {
  name: string;
  profilePicture: string;
  updateProfilePicture: (profile: string) => void;
  loading: boolean;
}

export default function EditProfilePictureComponent(props: Props) {
  const { profilePicture, name, updateProfilePicture, loading } = props;
  /**
   * Select an image from the gallery
   * @function pickImageAsync
   */
  async function pickImageAsync() {
    const permissionGranted = await PermissionRequester.openImagePickerAsync({
      title: 'Permission required',
      description:
        'The app needs permission to access your photos in order to select a profile picture. Open settings to grant the permission.',
    });
    if (permissionGranted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
      });
      if (result.cancelled === false) {
        updateProfilePicture(result.uri);
      }
    }
  }

  const renderEditProfilePictureScreen = useMemo(
    () => (
      <View style={styles.wrapper}>
        <HighlightText
          style={styles.title}
          highlightStyle={styles.name}
          searchWords={[name]}
          textToHighlight={`Hey ${name}, set up your profile picture`}
        />
        <View style={styles.profileWrapper}>
          <TouchableOpacity
            style={styles.profileImageWrapper}
            onPress={() => pickImageAsync()}>
            {!loading ? (
              !profilePicture ? (
                <View style={styles.addProfileContainer}>
                  <AddProfilePictureIcon style={styles.addProfile} />
                </View>
              ) : (
                <Image
                  source={{ uri: profilePicture }}
                  style={styles.profileImage}
                />
              )
            ) : (
              <ActivityIndicator
                style={{ alignSelf: 'center' }}
                size={'large'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    ),
    [name, profilePicture, pickImageAsync],
  );

  return renderEditProfilePictureScreen;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
  },
  wrapper: {
    width: Dimensions.get('window').width,
    height: '100%',
    alignItems: 'center',
    padding: Globals.dimension.padding.medium,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xlarge,
    color: Globals.color.brand.accent1,
    lineHeight: Globals.font.lineHeight.large,
    width: '100%',
  },
  profileWrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: Globals.dimension.margin.medium,
  },
  profileImageWrapper: {
    width: Dimensions.get('window').width / 2.5,
    height: Dimensions.get('window').width / 2.5,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: Globals.color.text.light,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: Globals.color.background.dark,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 30,
    shadowOpacity: 0.2,
    overflow: 'visible',
  },
  plus: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.xxLarge * 3,
    color: Globals.color.text.light,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  addProfileContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 100,
  },
  addProfile: {
    top: 20,
  },
});
