import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList
} from 'react-native';
import UserAvatar from '../component-library/UserAvatar';
import Globals from '../component-library/Globals';
import UserProfileManager from '../services/api/UserProfileManager';
import { useNavigation } from '@react-navigation/native';
import { isIos } from '../services/utility/Platform';
import CustomHeaderBar from '../component-library/CustomHeaderBar';
import { connect } from 'react-redux';

interface Followers {
  id: number;
  profilePicture: string;
  name: string;
  location: {
    city: string;
    country: string;
  };
}

interface FollowersArray extends Array<Followers> { }

const mapStateToProps = ({ userProfile }) => ({
  userProfile,
});

function FollowersScreen(props) {
  const navigation = useNavigation();
  const [followers, setFollowers] = useState<FollowersArray>([]);
  const [isLoadFollowers, setIsLoadFollowers] = useState<boolean>(false);

  useEffect(() => {
    async function fetchFollowersAsync() {
      const data = await UserProfileManager.fetchFollowersAsync();
      setFollowers(data.followers);
      setIsLoadFollowers(data.success);
    }
    fetchFollowersAsync();
  }, []);

  function renderItem({ item }) {
    return (
      <TouchableOpacity
        style={styles.userBlock}
        key={item.id}
        onPress={() =>
          navigation.navigate('UsersProfileScreen', {
            payload: {
              paperPlane: {
                author: {
                  id: item.id,
                },
              },
              relatedUser: item,
            },
          })
        }>
        <View style={styles.userAvatar}>
          <UserAvatar
            size={50}
            uri={item.profilePicture}
            onclick={() =>
              navigation.navigate('UsersProfileScreen', {
                payload: {
                  paperPlane: {
                    author: {
                      id: item.id,
                    },
                  },
                  relatedUser: item,
                },
              })
            }
          />
        </View>
        <View>
          <Text style={styles.userName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.userLocation}>{`${item.location.city}${
            item.location.city !== '' ? ', ' : ' '
            }${item.location.country}`}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.container}>
      <CustomHeaderBar
        text={'Followers'}
        onDismiss={() => navigation.goBack()}
      />
      <View style={styles.contentContainer}>
        <FlatList
          data={props.userProfile.followers}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
}

export default connect(
  mapStateToProps,
  null,
)(FollowersScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Globals.color.background.lightgrey,
  },
  contentContainer: {
    width: '100%',
    paddingHorizontal: Globals.dimension.padding.mini,
    paddingVertical: Globals.dimension.padding.tiny,
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
    elevation: 8,
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
  userName: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.medium,
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
  preloader: {
    top: 20,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
