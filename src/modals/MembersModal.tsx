import React, { useEffect } from 'react';
import Modal from '../component-library/Modal';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import Globals from '../component-library/Globals';
import UserListItem from '../component-library/UserListItem';


interface Props {
  host: any;
  members: any;
  openModal: boolean;
  toogleModal: () => void;
  onClose: () => void;
  userProfile: any;
  updateMembersList: (user: Object) => void;
}

export default function MembersModal(props: Props) {
  const { host, members, openModal, onClose, updateMembersList } = props;

  function renderItem({ item }) {
    return (
      <UserListItem
        item={item.app_user}
        hideAddFriendButton={props.userProfile.id === item.app_user.id}
        updateList={updateMembersList}
      />
    );
  }
  function header() {
    return (
      <View style={styles.hostContainer}>
        <Text style={styles.title}>Host</Text>
        <UserListItem item={host} hideAddFriendButton={true} />
        <Text style={styles.title}>Members</Text>
      </View>
    );
  }
  return (
    <Modal
      key="MembersModal"
      modalheightType={'modal2'}
      isVisible={openModal}
      placement="bottom"
      onClosed={() => onClose()}>
      <View style={styles.container}>
        <FlatList
          data={members}
          renderItem={renderItem}
          keyExtractor={(item) => item?.app_user.internal_id.toString()}
          ListHeaderComponent={header}
          contentContainerStyle={styles.flatListContainer}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    zIndex: 0,
    paddingTop: Globals.dimension.padding.mini,
  },
  flatListContainer: {
    width: '100%',
  },
  membersContainer: {
    flexDirection: 'row',
    marginTop: Globals.dimension.margin.tiny,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginBottom: Globals.dimension.margin.mini,
    paddingHorizontal: Globals.dimension.padding.mini,
  },
  hostContainer: {
    marginTop: Globals.dimension.margin.tiny,
  },
  wrapper: {
    flexDirection: 'row',
  },
  name: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
  },
  location: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.tiny,
    color: Globals.color.text.grey,
  },
  userInfoContainer: {
    justifyContent: 'center',
    marginLeft: Globals.dimension.margin.mini,
  },
  closeContainer: {
    width: '100%',
    alignItems: 'flex-end',
    paddingRight: Globals.dimension.padding.mini,
  },
  closeIconWrapper: {
    padding: Globals.dimension.padding.mini,
  },
  closeButton: {
    width: 15,
    height: 15,
  },
});
