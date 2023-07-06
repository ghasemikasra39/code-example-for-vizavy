import { FlatList, StyleSheet, View } from 'react-native';
import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import Globals from './Globals';
import UserListItem from './UserListItem';
import IllustrationExplainer from './IllustrationExplainer';
import { noPeopleFound } from './graphics/Images';

/**
 * Update the Search list
 * @method FirstRoute
 * @param {object} users - the users data which match the search
 * @return {JSX.Element} - Rendered component
 */
export default function FirstRoute(props) {
  const navigation = useNavigation();

  /**
   * handle navigation when avatar is pressed
   * @method avatarOnPressHandler
   * @param {object} item - the item data
   */
  const avatarOnPressHandler = (item) =>
    navigation.navigate('UsersProfileScreen', {
      paperPlane: {
        author: {
          id: item.id,
        },
      },
      relatedUser: item,
    });

  /**
   * handle navigation when TouchableOpacity is pressed
   * @method TouchableOpacityOnPressHandler
   * @param {object} item - the item data
   */
  const TouchableOpacityOnPressHandler = (item) =>
    navigation.navigate('UsersProfileScreen', {
      paperPlane: {
        author: {
          id: item.id,
        },
      },
      relatedUser: item,
    });

  /**
   * Renders FlatList items
   * @method renderItem
   * @param {object} - item data
   * @return {React.Element} - the item to be rendered
   */
  const renderItem = ({ item }) => <UserListItem item={item} />;

  /**
   * renders component when the FlatList has no item to show
   * @method RenderListEmptyComponent
   * @return {React.Element}
   */
  const RenderListEmptyComponent = () => (
    <View style={styles.listEmptyComponent}>
      <IllustrationExplainer
        image={noPeopleFound}
        imageStyle={styles.noPeopleFoundIcon}
        headline={'No Results'}
        description={'Please try another search.'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={props.searchResult}
        style={styles.flatList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        onScroll={props.onScroll}
        onEndReached={props.handleLoadMore}
        onEndReachedThreshold={0.001}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          props.inputValue && !props.searchResult.length ? (
            <RenderListEmptyComponent />
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.light,
    paddingVertical: Globals.dimension.padding.mini,
  },
  scene: {
    flex: 1,
  },
  userAvatar: {
    marginRight: 20,
  },
  userBlock: {
    flexDirection: 'row',
    marginBottom: Globals.dimension.margin.mini,
    padding: Globals.dimension.padding.mini,
    backgroundColor: Globals.color.background.light,
    width: '100%',
    borderRadius: Globals.dimension.borderRadius.mini,
    elevation: Globals.shadows.shading1.elevation,
    shadowOffset: Globals.shadows.shading1.shadowOffset,
    shadowRadius: Globals.shadows.shading1.shadowRadius,
    shadowOpacity: Globals.shadows.shading1.shadowOpacity,
  },
  userName: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    marginBottom: 10,
    color: Globals.color.text.default,
    paddingRight: Globals.dimension.padding.small,
  },
  userLocation: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    paddingRight: Globals.dimension.padding.large,
  },
  flatListColumnWrapper: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  flatList: { width: '100%' },
  listEmptyComponent: {
    width: '100%',
    paddingTop: Globals.dimension.padding.mini,
  },
  noResults: {
    fontFamily: Globals.font.family.regular,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
  },
  noPeopleFoundIcon: {
    width: 160,
    height: 160,
  },
});
