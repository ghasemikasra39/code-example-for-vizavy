import React, {useMemo} from 'react';
import {StyleSheet, View, Text, FlatList} from 'react-native';
import Globals from './Globals';
import UserAvatar from './UserAvatar';

interface Props {
  data: Array<Object>;
  iconLarge?: boolean;
  iconSize?: number;
  onClick?: () => void;
  type?: 'myProfile' | 'mutualFriends';
  iconBorderWidth?: number;
  hideCount?: boolean;
}

export default function AvatarList(props: Props) {
  const {data, iconLarge, iconSize, iconBorderWidth, hideCount, type} = props;

  function compileMemberCountStyle(count) {
    let countStyle = styles.memberCount;
    if (props.iconLarge) {
      countStyle = {
        ...countStyle,
        right: count * 8,
        height: 45,
        paddingHorizontal: Globals.dimension.padding.mini,
      };
    } else if (iconSize) {
      countStyle = {
        ...countStyle,
        right: count * 8,
        height: iconSize,
        paddingHorizontal: Globals.dimension.padding.mini,
      };
    } else {
      countStyle = {
        ...countStyle,
        right: count * 8,
      };
    }

    return countStyle;
  }

  function renderItem({item, index}) {
    switch (type) {
      case 'myProfile':
        return (
          <View
            style={{right: index * 8, borderRadius: 100, overflow: 'hidden'}}>
            <UserAvatar
              uri={item.user.profilePicture}
              size={iconLarge ? 45 : iconSize ? iconSize : 30}
              onclick={() => (props.onClick ? props.onClick() : null)}
              borderWidth={iconBorderWidth}
            />
          </View>
        );
      case 'mutualFriends':
        return (
          <View
            style={{right: index * 8, borderRadius: 100, overflow: 'hidden'}}>
            <UserAvatar
              uri={item.profilePicture}
              size={iconLarge ? 45 : iconSize ? iconSize : 30}
              onclick={() => (props.onClick ? props.onClick() : null)}
              borderWidth={iconBorderWidth}
            />
          </View>
        );
      default:
        return (
          <View
            style={{right: index * 8, borderRadius: 100, overflow: 'hidden'}}>
            <UserAvatar
              uri={item.app_user.profilePicture}
              size={iconLarge ? 45 : iconSize ? iconSize : 30}
              onclick={() => (props.onClick ? props.onClick() : null)}
              borderWidth={iconBorderWidth}
            />
          </View>
        );
    }
  }

  function listFooterComponent() {
    if (data === undefined) return null;
    return data.length - data.slice(0, 3).length !== 0 && !hideCount ? (
      <View style={compileMemberCountStyle(data.slice(0, 3).length)}>
        <Text style={styles.join}>
          +{data.length - data.slice(0, 3).length}
        </Text>
      </View>
    ) : null;
  }

  const renderAvatarList = useMemo(
    () => (
      <FlatList
        data={data ? data.slice(0, 3) : []}
        horizontal={true}
        scrollEnabled={false}
        renderItem={renderItem}
        ListFooterComponent={listFooterComponent}
        keyExtractor={(item, index) => index.toString()}
      />
    ),
    [data, iconLarge, props.onClick],
  );

  return renderAvatarList;
}

const styles = StyleSheet.create({
  createRoomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Globals.dimension.margin.mini,
    paddingBottom: Globals.dimension.padding.mini,
  },
  roomWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: Globals.dimension.margin.mini,
  },
  newRoomTextWrapper: {
    marginLeft: Globals.dimension.margin.tiny,
  },
  newRoom: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.default,
    fontSize: Globals.font.size.medium,
    paddingRight: Globals.dimension.padding.large,
  },
  startConversation: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.tiny,
    paddingRight: Globals.dimension.padding.large,
  },
  timeRemaining: {
    fontFamily: Globals.font.family.semibold,
    color: Globals.color.text.grey,
    fontSize: Globals.font.size.tiny,
    position: 'absolute',
    top: -5,
    right: 0,
  },
  roomIconContainer: {
    borderRadius: 100,
    shadowColor: Globals.color.brand.primary,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
  },
  gradientContainer: {
    width: '100%',
    borderBottomEndRadius: Globals.dimension.borderRadius.mini,
    borderBottomStartRadius: Globals.dimension.borderRadius.mini,
    overflow: 'hidden',
  },
  gradientBackground: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
    paddingHorizontal: Globals.dimension.padding.mini,
    marginTop: Globals.dimension.margin.tiny,
    alignItems: 'center',
  },
  membersContainer: {
    marginHorizontal: Globals.dimension.margin.mini,
  },
  joinButton: {
    width: 50,
    height: 20,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  join: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.grey,
  },
  memberCount: {
    height: 30,
    paddingHorizontal: 8,
    right: 25,
    backgroundColor: Globals.color.background.light,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: {
      height: 10,
      width: 0,
    },
    shadowRadius: 16,
    shadowOpacity: 0.08,
    overflow: 'visible',
  },
});
