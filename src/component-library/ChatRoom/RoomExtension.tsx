import React, { useMemo } from 'react';
import { View } from 'react-native';
import Globals from '../Globals';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';
import { ChatRoomInterface } from '../../services/api/ChatRoomManager';
import { getTimeDifference } from '../../screens/ChatRoom/ChatroomUtils';
import ClockIcon from '../graphics/Icons/ClockIcon';

interface Props {
  colors: Array<string>;
  currentRoom: ChatRoomInterface;
  onPress: () => void;
  style?: any;
}

export default function RoomExtension(props: Props) {
  const { style, currentRoom, colors } = props;

  const renderInviteIcon = useMemo(() => {
    const timeDifference = getTimeDifference(
      currentRoom?.created_at,
      'asHours',
    );

    return timeDifference <= 12 && !currentRoom?.is_extended ? (
      <HapticFeedBackWrapper
        onPress={() => props.onPress()}
        hitSlop={Globals.dimension.hitSlop.regular}>
        <View style={style}>
          <ClockIcon colors={colors} />
        </View>
      </HapticFeedBackWrapper>
    ) : null;
  }, [currentRoom?.is_extended, currentRoom?.created_at]);

  return renderInviteIcon;
}
