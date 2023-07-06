import React, { useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { connect } from 'react-redux';
import Globals from '../../component-library/Globals';
import CustomHeaderBar from '../../component-library/CustomHeaderBar';
import NoDirectChatsIcon from '../../component-library/graphics/Icons/NoDirectChatsIcon';
import IllustrationExplainer from '../../component-library/IllustrationExplainer';
import DirectChatUserListItem from '../../component-library/ChatRoom/DirectChatUserListItem';
import DirectChatsManager from '../../services/api/DirectChatsManager';
import SearchHeader from '../../component-library/SearchHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnnouncementModal from '../../modals/AnnouncementModal';

const mapStateToProps = ({ directChat, userProfile, appStatus }) => ({
  directChat,
  userProfile,
  appStatus,
});

function DirectRoomsScreen(props) {
  const { userProfile, directChat, appStatus } = props;
  const { showInitialLoadingIndicator } = appStatus;
  const navigation = useNavigation();
  const screenHeight = Dimensions.get('window').height;
  const [loading, setLoading] = useState(false);

  async function fetchDirectRoomsData() {
    setLoading(true);
    DirectChatsManager.getDirectChatList().then(() => setLoading(false));
  }

  const listEmptyComponent = (
    <View style={styles.chatIllustrationContainer}>
      <IllustrationExplainer
        image={
          <NoDirectChatsIcon
            size={screenHeight * 0.3}
            style={styles.chatIllustration}
          />
        }
        headline={'Start connecting'}
        description={
          'When you reply to paper planes, the messages will appear here.'
        }
      />
    </View>
  );

  const renderItem = ({ item }) => {
    return (
      <DirectChatUserListItem
        item={item}
        navigation={navigation}
        userProfile={userProfile}
      />
    );
  };

  function sortByDate() {
    let clone = [...directChat.directChatList]
    clone.sort((a, b) => {
      const dateA = new Date(a.last_message.created_at);
      const dateB = new Date(b.last_message.created_at);
      return dateB - dateA;
    });
    return clone;
  }

  return (
    <SafeAreaView style={styles.screenContainer}>
      <SearchHeader title={'Messages'} />
      <FlatList
        contentContainerStyle={styles.flatList}
        renderItem={renderItem}
        data={sortByDate()}
        ListEmptyComponent={listEmptyComponent}
        refreshing={loading || showInitialLoadingIndicator}
        onRefresh={fetchDirectRoomsData}
      />
      <AnnouncementModal />
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(DirectRoomsScreen);

const styles = StyleSheet.create({
  screenContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.light,
  },
  flatList: {
    width: '100%',
    paddingTop: Globals.dimension.padding.mini,
  },
  chatIllustrationContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    paddingTop: Globals.dimension.padding.xlarge,
  },
  chatIllustration: {
    marginBottom: Globals.dimension.margin.large,
  },
});
