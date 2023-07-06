import React, { useMemo } from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import Globals from './Globals';
import AvatarList from './AvatarList';
import HapticFeedBackWrapper from './HapticFeedBackWrapper';
import BackArrowIcon from './graphics/Icons/BackArrowIcon';

interface Props {
  onPress?: () => void;
  onDismiss?: () => void;
  isTransparent?: boolean;
  text?: string;
  icon?: any;
  customIcon?: any;
  iconStyle?: any;
  userProfileInitialized?: boolean;
  fixedPosition?: boolean;
  backgroundColor?: string;
  backArrowColor?: string;
  members?: any;
  toogleMember?: () => void;
  skip?: boolean;
  leftIcon?: any;
  additionalLeftIcon?: any;
}

export default function CustomHeaderBar(props: Props) {
  const {
    userProfileInitialized,
    text,
    icon,
    members,
    iconStyle,
    toogleMember,
    onDismiss,
    onPress,
    skip,
    customIcon,
    leftIcon,
    additionalLeftIcon,
  } = props;

  function compileBackgroundStyle() {
    const { isTransparent, fixedPosition, backgroundColor } = props;
    let backgroundStyle = styles.container;
    //Check if header background should be transparent
    if (isTransparent) {
      backgroundStyle = {
        ...backgroundStyle,
        ...{
          backgroundColor: null,
          borderBottomColor: null,
          borderBottomWidth: null,
        },
      };
    }
    //Check if header should have a fixed position
    if (fixedPosition) {
      backgroundStyle = {
        ...backgroundStyle,
        ...{
          position: 'absolute',
        },
      };
    }
    //Decide what custom background color the header should have
    if (backgroundColor) {
      backgroundStyle = {
        ...backgroundStyle,
        ...{
          backgroundColor: backgroundColor,
          borderBottomColor: null,
          borderBottomWidth: null,
        },
      };
    }

    return backgroundStyle;
  }

  const renderLeftIcons = useMemo(() => {
    return (
      <View style={{ flexDirection: 'row', flex: 0.5 }}>
        <TouchableWithoutFeedback
          onPress={() => onDismiss()}
          hitSlop={Globals.dimension.hitSlop.regular}
          disabled={
            userProfileInitialized !== undefined &&
            userProfileInitialized === false
          }>
          <View style={{ flex: 0.5, justifyContent: 'center' }}>
            {/* if we are coming here for the first time, don't show the back button  */}
            {userProfileInitialized !== undefined &&
            userProfileInitialized === false ? (
              <></>
            ) : leftIcon ? (
              leftIcon
            ) : (
              <BackArrowIcon />
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }, [userProfileInitialized, leftIcon, onDismiss]);

  const renderleftAdditionalIcon = useMemo(() => {
    return additionalLeftIcon ? (
      <View style={{ flex: 3 }}>{additionalLeftIcon}</View>
    ) : null;
  }, [additionalLeftIcon]);

  const renderCenterIcons = useMemo(() => {
    return (
      <TouchableOpacity
        style={{ flex: 1.2, alignItems: 'center' }}
        onPress={() => (members ? toogleMember() : null)}
        hitSlop={Globals.dimension.hitSlop.regular}>
        {!members ? (
          <Text style={styles.textInput} numberOfLines={1}>
            {text}
          </Text>
        ) : (
          <View style={{ top: -2 }}>
            <HapticFeedBackWrapper onPress={() => toogleMember()}>
              <AvatarList data={members} iconLarge={true} />
            </HapticFeedBackWrapper>
          </View>
        )}
      </TouchableOpacity>
    );
  }, [members, text]);

  const renderRightIcons = useMemo(() => {
    return (
      <TouchableWithoutFeedback
        onPress={() => onPress && onPress()}
        hitSlop={Globals.dimension.hitSlop.regular}>
        <View style={{ flex: 0.5, alignItems: 'flex-end' }}>
          {!skip && !customIcon ? (
            <Image source={icon} style={iconStyle} />
          ) : customIcon ? (
            customIcon
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
              <Text style={styles.skip}>Skip</Text>
              <View style={{ transform: [{ rotateY: '180deg' }] }}>
                <BackArrowIcon />
              </View>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  }, [skip, customIcon]);

  return (
    <View style={compileBackgroundStyle()}>
      <View style={styles.actionBar}>
        {renderLeftIcons}
        {renderleftAdditionalIcon}
        {renderCenterIcons}
        {renderRightIcons}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Globals.color.background.light,
    width: '100%',
    height: 45,
    borderBottomColor: Globals.color.border.lightgrey,
    borderBottomWidth: 1,
    justifyContent: 'center',
    zIndex: 10,
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: Globals.dimension.margin.small,
    alignItems: 'center',
  },
  textInput: {
    color: Globals.color.text.default,
    fontFamily: Globals.font.family.bold,
    fontSize: Globals.font.size.large,
    textAlign: 'center',
  },
  skip: {
    fontFamily: Globals.font.family.semibold,
    fontSize: Globals.font.size.small,
    color: Globals.color.text.grey,
    marginRight: Globals.dimension.margin.tiny,
  },
});
