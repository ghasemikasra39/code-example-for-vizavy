import React, { useMemo, useEffect, useState, useRef } from 'react';
import Modal from '../component-library/Modal';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Globals from '../component-library/Globals';
import UserAvatar from '../component-library/UserAvatar';
import PermissionRequester from '../services/utility/PermissionRequester';
import * as ImagePicker from 'expo-image-picker';
import UserProfileManager from '../services/api/UserProfileManager';
import { TextInput } from 'react-native-gesture-handler';
import { UserProfileState } from '../store/slices/UserProfileSlice';
import { formateDateForBE } from '../screens/ChatRoom/ChatroomUtils';
import { BlurView } from 'expo-blur';
import { Bugtracker } from '../services/utility/BugTrackerService';

interface Props {
  openModal: boolean;
  toogleModal: () => void;
  onClose: () => void;
  userProfile: UserProfileState;
}

export default function EditProfileModal(props: Props) {
  const flatListRef = useRef();
  const { openModal, toogleModal, onClose, userProfile } = props;
  const [name, setName] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [bioText, setBioText] = useState('');
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userProfile?.name) {
      setName(userProfile.name);
    }
    if (userProfile?.profilePictureUrl) {
      setProfilePictureUrl(userProfile.profilePictureUrl);
    }
    if (userProfile?.bio_text) {
      setBioText(userProfile.bio_text);
    }
    if (userProfile?.prompts) {
      setPrompts([...userProfile.prompts]);
    }
  }, [userProfile]);

  /**
   * Update Proifle picture and name
   * @function updateProfile
   */
  async function updateProfile() {
    const handler = (res) => {
      if (res?.success) {
        UserProfileManager.updateProfilePictureBase64(profilePictureUrl);
        toogleModal();
      }
      setLoading(false);
    };

    setLoading(true);
    const filteredPrompts = prompts.filter((e) => e.answer !== '');
    const formattedDateOfBirth = formateDateForBE(userProfile.dayOfBirth);
    UserProfileManager.updateAsync({
      name: name,
      profilePictureUrl: profilePictureUrl,
      gender: userProfile.gender,
      dateOfBirth: formattedDateOfBirth,
      bio_text: bioText,
      prompts: filteredPrompts,
    }).then(handler);
  }

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
        setProfilePictureUrl(result.uri);
      }
    }
  }

  /**
   * Update prompt textInput
   * @function updatePrompts
   */
  function updatePrompts(index: number, question: string, answer: string) {
    prompts[index] = {
      question,
      answer,
    };
    setPrompts(prompts);
  }

  function scrollToPrompt(index: number) {
    flatListRef.current?.scrollToIndex({
      index: index,
      viewPosition: 0.5,
    });
  }

  function renderSaveButton() {
    return (
      <TouchableWithoutFeedback
        onPress={updateProfile}
        data-test={'update-button'}>
        <View style={styles.saveButtonContainer}>
          {!loading ? (
            <Text style={styles.buttonTitle}>Done</Text>
          ) : (
            <ActivityIndicator color={Globals.color.background.light} />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  function renderEditNameTextbox() {
    return (
      <View style={styles.smallTextBox}>
        <TextInput
          placeholder={'Name'}
          placeholderTextColor={Globals.color.text.lightgrey}
          style={styles.description}
          onChangeText={(text) => setName(text)}
          defaultValue={name}
          selectionColor={Globals.color.text.default}
          multiline={false}
          keyboardAppearance={'light'}
          clearButtonMode={'while-editing'}
        />
      </View>
    );
  }

  function renderBioTextbox() {
    return (
      <View style={styles.largeTextBox}>
        <TextInput
          placeholder={'Tell the world a bit about you...'}
          placeholderTextColor={Globals.color.text.lightgrey}
          style={styles.description}
          onChangeText={(text) => setBioText(text)}
          defaultValue={bioText}
          selectionColor={Globals.color.text.default}
          keyboardAppearance={'light'}
          maxLength={160}
          multiline
        />
        <Text style={styles.textCount}>{bioText?.length}/160</Text>
      </View>
    );
  }

  function renderPromptsTitle() {
    return (
      <View style={styles.inspirationTitleContainer}>
        <Text style={styles.inspiration}>
          Need inspiration? Add a prompt to your profile 😍
        </Text>
      </View>
    );
  }

  function renderPrompts({ item, index }) {
    return (
      <View style={styles.promtTextBox}>
        <Text style={styles.promtTitle}>{item}</Text>
        <TextInput
          placeholder={'Type your response here'}
          placeholderTextColor={Globals.color.text.lightgrey}
          style={styles.description}
          onChangeText={(text) => updatePrompts(index, item, text)}
          defaultValue={prompts[index]?.answer}
          selectionColor={Globals.color.text.default}
          keyboardAppearance={'light'}
          multiline
          onFocus={() => scrollToPrompt(index)}
        />
      </View>
    );
  }

  function renderUserAvatar() {
    return (
      <View>
        <UserAvatar
          uri={profilePictureUrl}
          size={100}
          onclick={pickImageAsync}
        />
        {loading ? (
          <View style={styles.avatarLoadingContainer}>
            <BlurView
              style={styles.avatarLoadingWrapper}
              intensity={100}
              tint={'dark'}>
              <ActivityIndicator />
            </BlurView>
          </View>
        ) : null}
        <TouchableWithoutFeedback onPress={pickImageAsync}>
          <View style={styles.plusIconContainer}>
            <Text style={styles.plusText}>+</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  const listHeaderComponent = useMemo(() => {
    return (
      <View style={styles.header}>
        {renderSaveButton()}
        {renderUserAvatar()}
        {renderEditNameTextbox()}
        {renderBioTextbox()}
        {renderPromptsTitle()}
      </View>
    );
  }, [name, bioText, loading, profilePictureUrl, renderBioTextbox]);

  return (
    <Modal
      key="EditProfileModal"
      isVisible={openModal}
      modalheightType={'modal1'}
      onClosed={onClose}
      data-test={'component-updateProfileScreen'}
      placement="bottom">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={flatListRef}
          data={userProfile.promptsDescription}
          renderItem={renderPrompts}
          ListHeaderComponent={listHeaderComponent}
          keyExtractor={(index) => index.toString()}
          contentContainerStyle={styles.flatListContainer}
        />
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    paddingTop: Globals.dimension.padding.mini,
  },
  header: {
    width: '100%',
    alignItems: 'center',
  },
  smallTextBox: {
    width: '90%',
    height: 50,
    alignSelf: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: '#FCFCFC',
    borderWidth: 0.3,
    borderColor: 'rgba(154, 154,154, 0.5)',
    marginTop: Globals.dimension.margin.mini,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  largeTextBox: {
    width: '90%',
    height: 140,
    alignSelf: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: '#FCFCFC',
    paddingVertical: Globals.dimension.padding.mini,
    borderWidth: 0.3,
    borderColor: 'rgba(154, 154,154, 0.5)',
    marginTop: Globals.dimension.margin.mini,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'space-between',
  },
  promtTextBox: {
    width: '90%',
    minHeight: 60,
    alignSelf: 'center',
    borderRadius: Globals.dimension.borderRadius.tiny,
    backgroundColor: '#FCFCFC',
    paddingVertical: Globals.dimension.padding.mini,
    borderWidth: 0.3,
    borderColor: 'rgba(154, 154,154, 0.5)',
    marginTop: Globals.dimension.margin.mini,
    paddingHorizontal: Globals.dimension.padding.mini,
    justifyContent: 'space-between',
  },
  description: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    flex: 1,
    paddingBottom: Globals.dimension.padding.tiny,
  },
  promtTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
  },
  textCount: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.lightgrey,
    alignSelf: 'flex-end',
  },
  inspirationTitleContainer: {
    width: '90%',
  },
  inspiration: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginTop: Globals.dimension.margin.mini,
  },
  saveButtonContainer: {
    backgroundColor: Globals.color.brand.primary,
    paddingVertical: Globals.dimension.padding.tiny,
    paddingHorizontal: Globals.dimension.padding.mini,
    borderRadius: Globals.dimension.borderRadius.large,
    position: 'absolute',
    alignSelf: 'flex-end',
    right: Globals.dimension.margin.mini,
  },
  buttonTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  plusIconContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    right: Globals.dimension.margin.tiny,
    width: 25,
    height: 25,
    borderRadius: 100,
    backgroundColor: Globals.color.brand.primary,
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.2,
    overflow: 'visible',
  },
  plusText: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.light,
  },
  flatListContainer: {
    paddingBottom: Globals.dimension.padding.medium,
  },
  avatarLoadingContainer: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Globals.color.background.light,
    position: 'absolute',
    overflow: 'hidden',
  },
  avatarLoadingWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
