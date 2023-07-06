import React, { useMemo } from 'react';
import Globals from './../Globals';
import HapticFeedBackWrapper from '../HapticFeedBackWrapper';
import AddFriendsIcon from '../graphics/Icons/AddFriendsIcon';

interface Props {
  colors: Array<string>;
  onPress: () => void;
}

export default function InviteIcon(props: Props) {
  const { colors } = props;
  const renderInviteIcon = useMemo(
    () => (
      <HapticFeedBackWrapper
        onPress={() => props.onPress()}
        hitSlop={Globals.dimension.hitSlop.regular}>
        <AddFriendsIcon colors={colors} />
      </HapticFeedBackWrapper>
    ),
    [colors],
  );

  return renderInviteIcon;
}


