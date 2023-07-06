import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import Globals from './Globals';
import CheckMarkIcon from './graphics/Icons/CheckMarkIcon';
import PlusIcon from './graphics/Icons/PlusIcon';
import SendRequestIcon from './graphics/Icons/SendRequestIcon';

interface Props {
  friendship: any;
  onPress: () => void;
  shapeStyle?: 'profileButton' | 'listItemButton' | 'tinyItemButton';
  mounting?: boolean;
  requesting?: boolean;
  loading?: boolean;
}

export const ADD = 'Add';
export const PENDING = 'Sent';
export const FRIENDS = 'Friends';

export default function ToggleFriendButton(props: Props) {
  const { friendship, shapeStyle, mounting, onPress, requesting } = props;
  const [friendshipStatus, setFriendshipStatus] = useState(null);

  useEffect(() => {
    determineFriendshipStatus();
  }, [friendship]);

  function determineFriendshipStatus() {
    if (friendship === null) {
      setFriendshipStatus(ADD);
      //Check if user is has a pending friendship status
    } else if (friendship?.approved_at === null) {
      setFriendshipStatus(PENDING);
    } else {
      //User is a friend
      setFriendshipStatus(FRIENDS);
    }
  }

  function getButtonTitle() {
    switch (friendshipStatus) {
      case ADD:
        return ADD;
      case PENDING:
        return PENDING;
      case FRIENDS:
        return FRIENDS;
    }
  }

  function getButtonTitleStyle() {
    let titleStyle = styles.buttonTitle;
    switch (friendshipStatus) {
      case ADD:
        titleStyle = {
          ...titleStyle,
          color: Globals.color.text.light,
        };
        break;
      case PENDING:
        titleStyle = {
          ...titleStyle,
          color: Globals.color.text.grey,
        };
        break;
      default:
        titleStyle;
    }
    return titleStyle;
  }

  function getButtonSize() {
    switch (shapeStyle) {
      case 'listItemButton':
        return {
          paddingHorizontal: 0,
          width: 50,
        };
      case 'tinyItemButton':
        return {
          width: 20,
          height: 20,
          paddingHorizontal: 0,
        };
      default:
        return null;
    }
  }

  function getButtonBackgroundStyle() {
    let backgroundStyle = styles.container;
    const smallButtonStyle = getButtonSize();

    switch (friendshipStatus) {
      case ADD:
        backgroundStyle = {
          ...backgroundStyle,
          ...{
            backgroundColor: Globals.color.brand.primary,
            ...smallButtonStyle,
          },
        };
        break;
      case PENDING:
        backgroundStyle = {
          ...backgroundStyle,
          ...{
            backgroundColor: Globals.color.background.mediumgrey,
            ...smallButtonStyle,
          },
        };
        break;
      case FRIENDS:
        backgroundStyle = {
          ...backgroundStyle,
          ...{
            backgroundColor: Globals.color.background.light,
            borderWidth: !mounting ? 0.5 : null,
            borderColor: Globals.color.text.grey,
            ...smallButtonStyle,
          },
        };
        break;
    }
    return backgroundStyle;
  }

  function getActionicon() {
    switch (friendshipStatus) {
      case ADD:
        return <PlusIcon size={shapeStyle === 'tinyItemButton' ? 11 : null} />;
      case PENDING:
        return (
          <SendRequestIcon size={shapeStyle === 'tinyItemButton' ? 11 : null} />
        );
      case FRIENDS:
        return (
          <CheckMarkIcon
            color={Globals.color.text.default}
            size={shapeStyle === 'tinyItemButton' ? 11 : null}
          />
        );
    }
  }

  function renderActionIcon() {
    return <View>{getActionicon()}</View>;
  }

  function showTitle() {
    switch (shapeStyle) {
      case 'listItemButton':
      case 'tinyItemButton':
        return false;
      default:
        return true;
    }
  }

  const renderToogleFriendsButton = useMemo(() => {
    return (
      <TouchableOpacity
        style={getButtonBackgroundStyle()}
        onPress={() => onPress()}
        disabled={friendshipStatus === PENDING}>
        {!mounting ? (
          <View style={styles.wrapper}>
            {!requesting ? renderActionIcon() : null}
            {!requesting ? (
              showTitle() ? (
                <Text style={getButtonTitleStyle()}>{getButtonTitle()}</Text>
              ) : null
            ) : (
              <ActivityIndicator
                color={
                  friendshipStatus === ADD
                    ? Globals.color.background.light
                    : null
                }
              />
            )}
          </View>
        ) : (
          <View style={styles.loadingButtonContainer} />
        )}
      </TouchableOpacity>
    );
  }, [friendshipStatus, mounting, requesting, friendship]);

  return renderToogleFriendsButton;
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.large,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Globals.dimension.padding.large,
  },
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTitle: {
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.default,
    marginLeft: Globals.dimension.margin.tiny,
  },
  arrowIcon: {
    height: 13,
    width: 17,
  },
  plusIcon: {
    width: 13,
    height: 13,
  },
  checkmarkIcon: {
    width: 14,
    height: 11,
  },
  loadingButtonContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: Globals.color.background.mediumgrey,
    borderRadius: Globals.dimension.borderRadius.large,
  },
});
