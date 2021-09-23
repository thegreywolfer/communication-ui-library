// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IContextualMenuItem, PersonaPresence, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { useIdentifiers } from '../identifiers';
import { useLocale } from '../localization';
import { CallParticipant, CommunicationParticipant, OnRenderAvatarCallback } from '../types';
import { ParticipantItem } from './ParticipantItem';
import { iconStyles, participantListItemStyle, participantListStyle } from './styles/ParticipantList.styles';

/**
 * A callback for providing custom menu items for each participant in the participant list.
 */
export type ParticipantMenuItemsCallback = (
  participantUserId: string,
  userId?: string,
  defaultMenuItems?: IContextualMenuItem[]
) => IContextualMenuItem[];

/**
 * Props for component `ParticipantList`
 */
export type ParticipantListProps = {
  /** Participants in user call or chat */
  participants: CommunicationParticipant[];
  /** User ID of user */
  myUserId?: string;
  /**
   * If set to `true`, excludes the local participant from the participant list with use of `myUserId` props (required in this case).
   *
   * @defaultValue `false`
   */
  excludeMe?: boolean;
  /** Optional callback to render each participant. If no callback is provided, each participant will be rendered with `ParticipantItem`  */
  onRenderParticipant?: (participant: CommunicationParticipant) => JSX.Element | null;
  /** Optional callback to render the avatar for each participant. This property will have no effect if `onRenderParticipant` is assigned.  */
  onRenderAvatar?: OnRenderAvatarCallback;
  /** Optional callback to render the context menu for each participant  */
  onParticipantRemove?: (userId: string) => void;
  /** Optional callback to render custom menu items for each participant. */
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
};

const onRenderParticipantDefault = (
  participant: CommunicationParticipant,
  myUserId?: string,
  onParticipantRemove?: (userId: string) => void,
  onRenderAvatar?: OnRenderAvatarCallback,
  createParticipantMenuItems?: (participant: CommunicationParticipant) => IContextualMenuItem[]
): JSX.Element | null => {
  // Try to consider CommunicationParticipant as CallParticipant
  const callingParticipant = participant as CallParticipant;

  let presence: PersonaPresence | undefined = undefined;
  if (callingParticipant) {
    if (callingParticipant.state === 'Connected') {
      presence = PersonaPresence.online;
    } else if (callingParticipant.state === 'Idle') {
      presence = PersonaPresence.away;
    }
  }

  const menuItems = createParticipantMenuItems && createParticipantMenuItems(participant);

  const onRenderIcon =
    callingParticipant?.isScreenSharing || callingParticipant?.isMuted
      ? () => (
          <Stack horizontal={true} tokens={{ childrenGap: '0.5rem' }}>
            {callingParticipant.isScreenSharing && (
              <Icon iconName="ParticipantItemScreenShareStart" className={iconStyles} ariaLabel={'Sharing'} />
            )}
            {callingParticipant.isMuted && (
              <Icon iconName="ParticipantItemMicOff" className={iconStyles} ariaLabel={'Muted'} />
            )}
          </Stack>
        )
      : () => null;

  if (participant.displayName) {
    return (
      <ParticipantItem
        styles={participantListItemStyle}
        key={participant.userId}
        userId={participant.userId}
        displayName={participant.displayName}
        me={myUserId ? participant.userId === myUserId : false}
        menuItems={menuItems}
        presence={presence}
        onRenderIcon={onRenderIcon}
        onRenderAvatar={onRenderAvatar}
      />
    );
  }
  return null;
};

const getParticipantsForDefaultRender = (
  participants: CommunicationParticipant[],
  excludeMe: boolean,
  myUserId: string | undefined
): CommunicationParticipant[] => {
  if (!excludeMe || !myUserId) {
    return [...participants];
  }

  const userIndex = participants.map((p) => p.userId).indexOf(myUserId);

  if (userIndex === -1) {
    return [...participants];
  }

  const remoteParticipants = [...participants];
  remoteParticipants.splice(userIndex, 1);

  return remoteParticipants;
};

/**
 * `ParticipantList` renders a list of participants in Calling or Chat. If property `onRenderParticipant` is not
 * assigned then each participant is rendered with `ParticipantItem`.
 */
export const ParticipantList = (props: ParticipantListProps): JSX.Element => {
  const {
    excludeMe = false,
    myUserId,
    participants,
    onParticipantRemove,
    onRenderAvatar,
    onRenderParticipant,
    onFetchParticipantMenuItems
  } = props;

  const ids = useIdentifiers();
  const strings = useLocale().strings.participantItem;

  const displayedParticipants: CommunicationParticipant[] = useMemo(() => {
    return onRenderParticipant ? participants : getParticipantsForDefaultRender(participants, excludeMe, myUserId);
  }, [participants, excludeMe, myUserId, onRenderParticipant]);

  const createParticipantMenuItems = (participant): IContextualMenuItem[] => {
    let menuItems: IContextualMenuItem[] = [];
    if (participant.userId !== myUserId && onParticipantRemove) {
      menuItems.push({
        key: 'remove',
        text: strings.removeButtonLabel,
        onClick: () => onParticipantRemove(participant.userId)
      });
    }

    if (onFetchParticipantMenuItems) {
      menuItems = onFetchParticipantMenuItems(participant.userId, myUserId, menuItems);
    }

    return menuItems;
  };

  return (
    <Stack data-ui-id={ids.participantList} className={participantListStyle}>
      {displayedParticipants.map((participant: CommunicationParticipant) =>
        onRenderParticipant
          ? onRenderParticipant(participant)
          : onRenderParticipantDefault(
              participant,
              myUserId,
              onParticipantRemove,
              onRenderAvatar,
              createParticipantMenuItems
            )
      )}
    </Stack>
  );
};
