// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { _IdentifierProvider } from '@internal/react-components';
import {
  CallAdapter,
  CallComposite,
  COMPOSITE_LOCALE_FR_FR,
  COMPOSITE_LOCALE_EN_US,
  CustomCallControlButtonCallback,
  CustomCallControlButtonProps,
  CustomCallControlButtonCallbackArgs
} from '../../../src';
import { IDS } from '../../browser/common/constants';
import { isMobile } from '../lib/utils';
// eslint-disable-next-line no-restricted-imports
import { IContextualMenuItem, mergeStyles } from '@fluentui/react';
import { QueryArgs } from './QueryArgs';
import { MoreHorizontal20Regular } from '@fluentui/react-icons';

/** @internal */
export function BaseApp(props: { queryArgs: QueryArgs; callAdapter?: CallAdapter }): JSX.Element {
  const { queryArgs, callAdapter } = props;

  console.log(`Loaded test app with args ${JSON.stringify(queryArgs)}`);

  const locale = queryArgs.useFrLocale ? COMPOSITE_LOCALE_FR_FR : COMPOSITE_LOCALE_EN_US;
  if (queryArgs.showCallDescription) {
    locale.strings.call.configurationPageCallDetails =
      'Some details about the call that span more than one line - many, many lines in fact. Who would want fewer lines than many, many lines? Could you even imagine?! 😲';
  }

  const ParticipantItemOptions = queryArgs.showParticipantItemIcon ? <MoreHorizontal20Regular /> : <></>;

  const onEnvironmentInfoTroubleshootingClick = queryArgs.useTroubleShootingActions // useTroubleShootingActions is for all CallReadiness Callbacks
    ? () => alert('you are using a unsupported browser')
    : undefined;

  let customCallCompositeOptions;

  if (onEnvironmentInfoTroubleshootingClick) {
    customCallCompositeOptions = {
      ...queryArgs.customCallCompositeOptions,
      onEnvironmentInfoTroubleshootingClick: onEnvironmentInfoTroubleshootingClick
    };
  } else {
    customCallCompositeOptions = queryArgs.customCallCompositeOptions;
  }

  return (
    <>
      {!callAdapter && 'Initializing call adapter...'}
      {callAdapter && (
        <div style={{ position: 'fixed', width: '100%', height: '100%' }}>
          <_IdentifierProvider identifiers={IDS}>
            <CallComposite
              icons={{ ParticipantItemOptions: ParticipantItemOptions }}
              adapter={callAdapter}
              locale={locale}
              role={queryArgs.role}
              formFactor={isMobile() ? 'mobile' : 'desktop'}
              onFetchParticipantMenuItems={
                queryArgs.injectParticipantMenuItems ? onFetchParticipantMenuItems : undefined
              }
              options={
                customCallCompositeOptions !== undefined
                  ? customCallCompositeOptions
                  : queryArgs.injectCustomButtons
                  ? {
                      callControls: {
                        onFetchCustomButtonProps,
                        // Hide some buttons to keep the mobile-view control bar narrow
                        devicesButton: false,
                        endCallButton: false
                      }
                    }
                  : undefined
              }
              callInvitationUrl={queryArgs.callInvitationUrl}
            />
          </_IdentifierProvider>
        </div>
      )}
    </>
  );
}

function onFetchParticipantMenuItems(): IContextualMenuItem[] {
  return [
    {
      'data-ui-id': 'test-app-participant-menu-item',
      key: 'theOneWithRedBackground',
      className: mergeStyles({ background: 'red' }),
      href: 'https://bing.com',
      text: 'I feel so blue'
    },
    {
      key: 'shareSplit',
      split: true,
      subMenuProps: {
        items: [
          { key: 'sharetotwittersplit', text: 'Share to Twitter' },
          { key: 'sharetofacebooksplit', text: 'Share to Facebook' }
        ]
      },
      text: 'Share w/ Split'
    }
  ];
}

const onFetchCustomButtonProps: CustomCallControlButtonCallback[] = [
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      showLabel: args.displayType !== 'compact',
      // Some non-default icon that is already registered by the composites.
      iconName: 'ParticipantItemOptionsHovered',
      text: 'custom #1',
      placement: 'primary'
    };
  },
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      showLabel: args.displayType !== 'compact',
      // Some non-default icon that is already registered by the composites.
      iconName: 'NetworkReconnectIcon',
      text: 'custom #2',
      placement: 'primary'
    };
  },
  (args: CustomCallControlButtonCallbackArgs): CustomCallControlButtonProps => {
    return {
      showLabel: args.displayType !== 'compact',
      // Some non-default icon that is already registered by the composites.
      iconName: 'HorizontalGalleryRightButton',
      text: 'custom #3',
      placement: 'primary'
    };
  }
];
