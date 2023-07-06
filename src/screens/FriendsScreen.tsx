import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import Globals from '../component-library/Globals';
import { useNavigation } from '@react-navigation/native';
import CustomHeaderBar from '../component-library/CustomHeaderBar';
import { connect } from 'react-redux';
import { friends } from '../component-library/graphics/Images';
import UserListItem from '../component-library/UserListItem';
import IllustrationExplainer from '../component-library/IllustrationExplainer';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoFriendsIcon from '../component-library/graphics/Icons/NoFriendsIcon';

const mapStateToProps = ({ userProfile }) => ({
  userProfile,
});

function FriendsScreen(props) {
  const navigation = useNavigation();

  function getTitle() {
    const count = props.userProfile.friendships.length;
    if (count > 0) {
      return 'My friends ' + count;
    }
    return 'My friends';
  }

  function listEmptyComponent() {
    return (
      <View style={styles.emptyContainer}>
        <IllustrationExplainer
          image={<NoFriendsIcon />}
          headline={'No Friends'}
          description={'Your friends will appear here.'}
        />
      </View>
    );
  }

  function renderItem({ item }) {
    return <UserListItem item={item} nestedObject hideAddFriendButton />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderBar
        text={getTitle()}
        onDismiss={() => navigation.goBack()}
      />
      <FlatList
        data={props.userProfile.friendships}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={listEmptyComponent}
        style={styles.flatListContainer}
      />
    </SafeAreaView>
  );
}

export default connect(mapStateToProps)(FriendsScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
  },
  flatListContainer: {
    paddingTop: Globals.dimension.padding.small,
  },
  emptyContainer: {
    width: '100%',
    paddingTop: Globals.dimension.padding.small,
  },
  friendsIcon: {
    width: 180,
    height: 170,
  },
  title: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
    color: Globals.color.text.default,
    paddingTop: Globals.dimension.padding.mini,
  },
  description: {
    marginTop: Globals.dimension.margin.tiny,
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    lineHeight: Globals.font.lineHeight.small,
    paddingHorizontal: Globals.dimension.padding.large,
    textAlign: 'center',
  },
});
