import React, { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import { StyleSheet, View, Text } from 'react-native';
import Globals from '../../Globals';
import { connect } from 'react-redux';

interface Props {
  focused?: boolean;
  fade?: boolean;
  style?: any;
  color: string;
}

const mapStateToProps = ({ notifications }) => ({
  notifications,
});

function NotificationButton(props) {
  const { notifications, color, style } = props;
  const { unseen_count } = notifications.notifications;

  function buildXml() {
    return `
    <svg width="22" height="25" viewBox="0 0 22 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="unmuteNotificationsIcon">
<path id="Path" d="M19.9814 17.4836C18.5004 16.238 17.6512 14.4175 17.6512 12.4887V9.77149C17.6512 6.34184 15.0908 3.5028 11.7743 3.02719V1.97461C11.7743 1.43565 11.3355 1 10.7948 1C10.2542 1 9.81535 1.43565 9.81535 1.97461V3.02719C6.49784 3.5028 3.93845 6.34184 3.93845 9.77149V12.4887C3.93845 14.4175 3.08924 16.238 1.59944 17.4914C1.21842 17.8159 1 18.2876 1 18.7866C1 19.7271 1.76889 20.4922 2.7141 20.4922H18.8756C19.8208 20.4922 20.5897 19.7271 20.5897 18.7866C20.5897 18.2876 20.3712 17.8159 19.9814 17.4836Z" stroke=${
      color ? color : Globals.color.text.grey
    } stroke-width="2.5"/>
<path id="Path_2" d="M10.7948 23.9113C12.5687 23.9113 14.0526 22.6531 14.3935 20.9875H7.19623C7.53709 22.6531 9.021 23.9113 10.7948 23.9113Z" stroke=${
      color ? color : Globals.color.text.grey
    }  stroke-width="2.5"/>
</g>
</svg>`;
  }

  const renderNotificationIcon = useMemo(() => {
    return (
      <View style={[style, styles.container]}>
        <View hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
          <SvgXml xml={buildXml()} height={24} width={24} />
        </View>
        {unseen_count > 0 ? (
          <View style={styles.unreadNotificationsIndicator}>
            <Text style={styles.unreadNotificationNumber}>{unseen_count}</Text>
          </View>
        ) : null}
      </View>
    );
  }, [unseen_count, buildXml]);

  return renderNotificationIcon;
}

export default connect(mapStateToProps)(NotificationButton);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    zIndex: 1,
  },
  unreadNotificationsIndicator: {
    height: 20,
    minWidth: 20,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Globals.color.background.light,
    backgroundColor: Globals.color.brand.primary,
    paddingHorizontal: Globals.dimension.padding.tiny * 0.5,
    top: -5,
    right: -10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  unreadNotificationNumber: {
    fontFamily: Globals.font.family.bold,
    color: Globals.color.text.light,
    fontSize: Globals.font.size.xTiny,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
