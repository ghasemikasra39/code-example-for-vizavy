import React from 'react';
import Modal from '../component-library/Modal';
import { StyleSheet, View, FlatList } from 'react-native';
import Globals from '../component-library/Globals';
import UserListItem from '../component-library/UserListItem';

interface Props {
  data: Array<Object>;
  openModal: boolean;
  toogleModal: () => void;
  onClose: () => void;
}

export default function MutualFriendsModal(props: Props) {
  const { data, openModal, onClose } = props;


  function renderItem({ item }) {
    return <UserListItem item={item} />;
  }
  return (
    <Modal
      key="MutualFriendsModal"
      modalheightType={'modal2'}
      isVisible={openModal}
      placement="bottom"
      onClosed={() => onClose()}>
      <View style={styles.container}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(index) => index.toString()}
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
  host: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  members: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    color: Globals.color.text.default,
    marginTop: Globals.dimension.margin.small,
    paddingHorizontal: Globals.dimension.padding.small,
  },
  membersContainer: {
    flexDirection: 'row',
    marginTop: Globals.dimension.margin.tiny,
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
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
