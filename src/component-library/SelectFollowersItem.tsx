import React, { useMemo, useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import Globals from './Globals';
import UserAvatar from './UserAvatar';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';
import { checkMarkIcon } from './graphics/Images';
import CheckMarkIcon from './graphics/Icons/CheckMarkIcon';

interface Props {
  item: Object;
  colors: any;
  active: boolean;
  onSelectUser: () => void;
  navigation: any;
}

export default function SelectFollowersItem(props: Props) {
  var emojiFlags = require('emoji-flags');
  const { item, colors, onSelectUser, navigation, active } = props;
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    setSelected(active);
  }, [active]);

  /**
   * Choose which follower you are selecting or deselecting
   * @method selectFollower
   */
  function selectFollower() {
    onSelectUser();
    setSelected(!selected);
  }

  /**
   * Navigate to the otherUserProfile
   * @method goToUserProfile
   */
  function goToUserProfile() {
    navigation.navigate('UsersProfileScreen', {
      relatedUser: item,
      paperPlane: null,
    });
  }

  /**
   * Navigate to the otherUserProfile
   * @method goToUserProfile
   */
  function compileItemPositionStyle() {
    let positionStyle = styles.userInfoContainer;
    if (item?.location?.country_code) {
      positionStyle = {
        ...positionStyle,
        marginTop: -6,
      };
    }
    return positionStyle;
  }

  function checkmarkIcon() {
    function compileBackgroundColor() {
      let backgroundStyle = styles.checkmarkContainer;
      if (!selected) {
        backgroundStyle = {
          ...backgroundStyle,
          ...{
            backgroundColor: Globals.color.background.mediumgrey,
            borderColor: Globals.color.background.mediumgrey,
            borderWidth: 1,
          },
        };
      } else {
        backgroundStyle = {
          ...backgroundStyle,
          ...{
            backgroundColor: colors[1],
            borderColor: null,
            borderWidth: null,
          },
        };
      }
      return backgroundStyle;
    }
    return (
      <HapticFeedBackWrapper
        onPress={selectFollower}
        hitSlop={Globals.dimension.hitSlop.regular}>
        <View style={compileBackgroundColor()}>
          <CheckMarkIcon
            color={
              selected
                ? Globals.color.background.light
                : Globals.color.text.lightgrey
            }
            size={14}
          />
        </View>
      </HapticFeedBackWrapper>
    );
  }

  const renderSelectFollowersItem = useMemo(
    () => (
      <View style={styles.membersContainer}>
        <View style={styles.membersWrapper}>
          <UserAvatar
            size={44}
            uri={item.profilePicture}
            onclick={goToUserProfile}
          />
          <View style={compileItemPositionStyle()}>
            <Text style={styles.name}>
              {item?.name}{' '}
              {item?.location?.country_code
                ? emojiFlags.countryCode(item?.location?.country_code).emoji
                : null}
            </Text>
            <Text style={styles.location}>
              {item?.location?.city}
              {item?.location?.city ? ', ' : ''}
              {item?.location?.country}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          {checkmarkIcon()}
        </View>
      </View>
    ),
    [colors, item, checkmarkIcon, selected],
  );

  return renderSelectFollowersItem;
}

const styles = StyleSheet.create({
  membersContainer: {
    flexDirection: 'row',
    marginTop: Globals.dimension.margin.tiny,
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.small,
  },
  membersWrapper: {
    flex: 5,
    flexDirection: 'row',
    alignItems: 'center',
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
    flex: 1,
    width: '100%',
    marginLeft: Globals.dimension.margin.mini,
  },
  checkmarkContainer: {
    width: 25,
    height: 25,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkWrapper: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkIcon: {
    width: 13,
    height: 11,
  },
});
