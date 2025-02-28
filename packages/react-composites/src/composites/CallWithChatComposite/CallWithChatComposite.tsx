// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import { LayerHost, mergeStyles, PartialTheme, Stack, Theme } from '@fluentui/react';
import { CallComposite, CallCompositePage, CallControlDisplayType } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallWithChatControlBar } from './CallWithChatControlBar';
import { CallState } from '@azure/communication-calling';
import {
  callCompositeContainerStyles,
  compositeOuterContainerStyles,
  controlBarContainerStyles,
  drawerContainerStyles
} from './styles/CallWithChatCompositeStyles';
import { CallWithChatAdapter } from './adapter/CallWithChatAdapter';
import { CallWithChatBackedCallAdapter } from './adapter/CallWithChatBackedCallAdapter';
import { CallWithChatBackedChatAdapter } from './adapter/CallWithChatBackedChatAdapter';
import { CallAdapter } from '../CallComposite';
import { ChatCompositeProps } from '../ChatComposite';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { CallWithChatCompositeIcons } from '../common/icons';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { ChatAdapterProvider } from '../ChatComposite/adapter/ChatAdapterProvider';
import { CallWithChatAdapterState } from './state/CallWithChatAdapterState';
import { PreparedMoreDrawer } from './PreparedMoreDrawer';
import { ParticipantMenuItemsCallback, _useContainerHeight, _useContainerWidth } from '@internal/react-components';
import { useId } from '@fluentui/react-hooks';
import { CallWithChatPane, CallWithChatPaneOption } from './CallWithChatPane';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from '../ChatComposite';
import { containerDivStyles } from '../common/ContainerRectProps';
/* @conditional-compile-remove(control-bar-button-injection) */
import { CustomCallWithChatControlButtonCallback } from './CustomButton';
import { modalLayerHostStyle } from '../common/styles/ModalLocalAndRemotePIP.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { SendDtmfDialpad } from '../common/SendDtmfDialpad';
/* @conditional-compile-remove(PSTN-calls) */
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
/* @conditional-compile-remove(call-readiness) */
import { DevicePermissionRestrictions } from '../CallComposite/CallComposite';

/**
 * Props required for the {@link CallWithChatComposite}
 *
 * @public
 */
export interface CallWithChatCompositeProps extends BaseCompositeProps<CallWithChatCompositeIcons> {
  adapter: CallWithChatAdapter;
  /**
   * Fluent theme for the composite.
   *
   * Defaults to a light theme if undefined.
   */
  fluentTheme?: PartialTheme | Theme;
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   */
  formFactor?: 'desktop' | 'mobile';
  /**
   * URL that can be used to copy a call-with-chat invite to the Users clipboard.
   */
  joinInvitationURL?: string;
  /**
   * Flags to enable/disable or customize UI elements of the {@link CallWithChatComposite}
   */
  options?: CallWithChatCompositeOptions;
}

/**
 * Optional features of the {@link CallWithChatComposite}.
 *
 * @public
 */
export type CallWithChatCompositeOptions = {
  /**
   * Call control options to change what buttons show on the call-with-chat composite control bar.
   * If using the boolean values, true will cause default behavior across the whole control bar. False hides the whole control bar.
   */
  callControls?: boolean | CallWithChatControlOptions;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Properties for configuring the File Sharing feature.
   * If undefined, file sharing feature will be disabled.
   * @beta
   */
  fileSharing?: FileSharingOptions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Device permission restrictions for your call.
   * Require device permissions to be set or have them as optional or not required to start a call
   */
  devicePermissions?: DevicePermissionRestrictions;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Callback you may provide to supply users with further steps to troubleshoot why they have been
   * unable to grant your site the required permissions for the call.
   *
   * @example
   * ```ts
   * onPermissionsTroubleshootingClick: () =>
   *  window.open('https://contoso.com/permissions-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'further troubleshooting' link.
   */
  onPermissionsTroubleshootingClick?: (permissionsState: {
    camera: PermissionState;
    microphone: PermissionState;
  }) => void;
  /* @conditional-compile-remove(call-readiness) */
  /**
   * Optional callback to supply users with further troubleshooting steps for network issues
   * experienced when connecting to a call.
   *
   * @example
   * ```ts
   * onNetworkingTroubleShootingClick?: () =>
   *  window.open('https://contoso.com/network-troubleshooting', '_blank');
   * ```
   *
   * @remarks
   * if this is not supplied, the composite will not show a 'network troubleshooting' link.
   */
  onNetworkingTroubleShootingClick?: () => void;
};

/**
 * {@link CallWithChatComposite} Call controls to show or hide buttons on the calling control bar.
 *
 * @public
 */
export interface CallWithChatControlOptions {
  /**
   * {@link CallControlDisplayType} to change how the call controls are displayed.
   * `'compact'` display type will decreases the size of buttons and hide the labels.
   *
   * @remarks
   * If the composite `formFactor` is set to `'mobile'`, the control bar will always use compact view.
   *
   * @defaultValue 'default'
   */
  displayType?: CallControlDisplayType;
  /**
   * Show or Hide Microphone button during a call.
   * @defaultValue true
   */
  microphoneButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
  /**
   * Show or Hide Camera Button during a call
   * @defaultValue true
   */
  cameraButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
  /**
   * Show, Hide or Disable the screen share button during a call.
   * @defaultValue true
   */
  screenShareButton?: boolean | { disabled: boolean };
  /**
   * Show or Hide EndCall button during a call.
   * @defaultValue true
   */
  endCallButton?: boolean;
  /**
   * Show or hide the chat button in the call-with-chat composite control bar.
   * @defaultValue true
   */
  chatButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
  /**
   * Show or hide the people button in the call-with-chat composite control bar.
   * @defaultValue true
   */
  peopleButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
  /* @conditional-compile-remove(control-bar-button-injection) */
  /**
   * Inject custom buttons in the call controls.
   *
   * @beta
   */
  onFetchCustomButtonProps?: CustomCallWithChatControlButtonCallback[];
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Show or hide the more button in the call-with-chat control bar.
   */
  moreButton?: boolean;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Show or hide the hold button in the bottom sheet drawer
   */
  holdButton?: boolean | { disabled: boolean };
}

type CallWithChatScreenProps = {
  callWithChatAdapter: CallWithChatAdapter;
  fluentTheme?: PartialTheme | Theme;
  formFactor?: 'desktop' | 'mobile';
  joinInvitationURL?: string;
  callControls?: boolean | CallWithChatControlOptions;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  /* @conditional-compile-remove(file-sharing) */
  fileSharing?: FileSharingOptions;
  rtl?: boolean;
  /* @conditional-compile-remove(call-readiness) */
  devicePermissions?: DevicePermissionRestrictions;
};

const CallWithChatScreen = (props: CallWithChatScreenProps): JSX.Element => {
  const { callWithChatAdapter, fluentTheme, formFactor = 'desktop' } = props;
  const mobileView = formFactor === 'mobile';

  if (!callWithChatAdapter) {
    throw new Error('CallWithChatAdapter is undefined');
  }

  const callAdapter: CallAdapter = useMemo(
    () => new CallWithChatBackedCallAdapter(callWithChatAdapter),
    [callWithChatAdapter]
  );

  const [currentCallState, setCurrentCallState] = useState<CallState>();
  const [currentPage, setCurrentPage] = useState<CallCompositePage>();
  const [activePane, setActivePane] = useState<CallWithChatPaneOption>('none');

  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = _useContainerWidth(containerRef);
  const containerHeight = _useContainerHeight(containerRef);

  useEffect(() => {
    const updateCallWithChatPage = (newState: CallWithChatAdapterState): void => {
      setCurrentPage(newState.page);
      setCurrentCallState(newState.call?.state);
    };
    updateCallWithChatPage(callWithChatAdapter.getState());
    callWithChatAdapter.onStateChange(updateCallWithChatPage);
    return () => {
      callWithChatAdapter.offStateChange(updateCallWithChatPage);
    };
  }, [callWithChatAdapter]);

  const closePane = useCallback(() => {
    setActivePane('none');
  }, [setActivePane]);

  const chatProps: ChatCompositeProps = useMemo(() => {
    return {
      adapter: new CallWithChatBackedChatAdapter(callWithChatAdapter)
    };
  }, [callWithChatAdapter]);

  const modalLayerHostId = useId('modalLayerhost');

  const isInLobbyOrConnecting = currentPage === 'lobby';
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  const isInLocalHold = currentPage === 'hold';
  const hasJoinedCall = !!(currentPage && hasJoinedCallFn(currentPage, currentCallState ?? 'None'));
  const showControlBar = isInLobbyOrConnecting || hasJoinedCall;
  const isMobileWithActivePane = mobileView && hasJoinedCall && activePane !== 'none';

  /** Constant setting of id for the parent stack of the composite */
  const compositeParentDivId = useId('callWithChatCompositeParentDiv-internal');

  const toggleChat = useCallback(() => {
    if (activePane === 'chat' || !hasJoinedCall) {
      setActivePane('none');
    } else {
      setActivePane('chat');
      // timeout is required to give the window time to render the sendbox so we have something to send focus to.
      // TODO: Selecting elements in the DOM via attributes is not stable. We should expose an API from ChatComposite to be able to focus on the sendbox.
      const chatFocusTimeout = setInterval(() => {
        const callWithChatCompositeRootDiv = document.querySelector(`[id="${compositeParentDivId}"]`);
        const sendbox = callWithChatCompositeRootDiv?.querySelector(`[id="sendbox"]`) as HTMLTextAreaElement;
        if (sendbox !== null) {
          sendbox.focus();
          clearInterval(chatFocusTimeout);
        }
      }, 3);
      setTimeout(() => {
        clearInterval(chatFocusTimeout);
      }, 300);
    }
  }, [activePane, setActivePane, compositeParentDivId, hasJoinedCall]);

  const togglePeople = useCallback(() => {
    if (activePane === 'people' || !hasJoinedCall) {
      setActivePane('none');
    } else {
      setActivePane('people');
    }
  }, [activePane, setActivePane, hasJoinedCall]);

  const selectChat = useCallback(() => {
    if (hasJoinedCall) {
      setActivePane('chat');
    }
  }, [setActivePane, hasJoinedCall]);

  const selectPeople = useCallback(() => {
    if (hasJoinedCall) {
      setActivePane('people');
    }
  }, [setActivePane, hasJoinedCall]);

  const [showDrawer, setShowDrawer] = useState(false);
  const onMoreButtonClicked = useCallback(() => {
    closePane();
    setShowDrawer(true);
  }, [closePane]);
  const closeDrawer = useCallback(() => {
    setShowDrawer(false);
  }, []);
  const onMoreDrawerPeopleClicked = useCallback(() => {
    setShowDrawer(false);
    togglePeople();
  }, [togglePeople]);

  // On mobile, when there is an active call and some side pane is active,
  // we hide the call composite via CSS to show only the pane.
  // We only set `display` to `none` instead of unmounting the call composite component tree
  // to avoid the performance cost of rerendering video streams when we later show the composite again.
  const callCompositeContainerCSS = useMemo(() => {
    return { display: isMobileWithActivePane ? 'none' : 'flex' };
  }, [isMobileWithActivePane]);

  /* @conditional-compile-remove(PSTN-calls) */
  const [showDtmfDialpad, setShowDtmfDialpad] = useState(false);

  /* @conditional-compile-remove(PSTN-calls) */
  const onDismissDtmfDialpad = (): void => {
    setShowDtmfDialpad(false);
  };

  /* @conditional-compile-remove(PSTN-calls) */
  const onClickShowDialpad = (): void => {
    setShowDtmfDialpad(true);
  };

  /* @conditional-compile-remove(PSTN-calls) */
  const callWithChatStrings = useCallWithChatCompositeStrings();

  /* @conditional-compile-remove(PSTN-calls) */
  const dialpadStrings = useMemo(
    () => ({
      dialpadModalAriaLabel: callWithChatStrings.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: callWithChatStrings.dialpadCloseModalButtonAriaLabel,
      placeholderText: callWithChatStrings.dtmfDialpadPlaceHolderText
    }),
    [callWithChatStrings]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  const alternateCallerId = callAdapter.getState().alternateCallerId;

  return (
    <div ref={containerRef} className={mergeStyles(containerDivStyles)}>
      <Stack verticalFill grow styles={compositeOuterContainerStyles} id={compositeParentDivId}>
        <Stack horizontal grow>
          <Stack.Item
            grow
            styles={callCompositeContainerStyles}
            // Perf: Instead of removing the video gallery from DOM, we hide it to prevent re-renders.
            style={callCompositeContainerCSS}
          >
            <CallComposite
              {...props}
              formFactor={formFactor}
              options={{
                callControls: false,
                /* @conditional-compile-remove(call-readiness) */
                devicePermissions: props.devicePermissions
              }}
              adapter={callAdapter}
              fluentTheme={fluentTheme}
            />
          </Stack.Item>

          {chatProps.adapter && callAdapter && hasJoinedCall && (
            <CallWithChatPane
              chatCompositeProps={chatProps}
              inviteLink={props.joinInvitationURL}
              onClose={closePane}
              chatAdapter={chatProps.adapter}
              callAdapter={callAdapter}
              onFetchAvatarPersonaData={props.onFetchAvatarPersonaData}
              onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
              onChatButtonClicked={showShowChatTabHeaderButton(props.callControls) ? selectChat : undefined}
              onPeopleButtonClicked={showShowPeopleTabHeaderButton(props.callControls) ? selectPeople : undefined}
              modalLayerHostId={modalLayerHostId}
              mobileView={mobileView}
              activePane={activePane}
              /* @conditional-compile-remove(file-sharing) */
              fileSharing={props.fileSharing}
              rtl={props.rtl}
              callControls={typeof props.callControls !== 'boolean' ? props.callControls : undefined}
            />
          )}
        </Stack>
        {showControlBar && !isMobileWithActivePane && (
          <ChatAdapterProvider adapter={chatProps.adapter}>
            <Stack.Item styles={controlBarContainerStyles}>
              <CallWithChatControlBar
                callAdapter={callAdapter}
                chatAdapter={chatProps.adapter}
                chatButtonChecked={activePane === 'chat'}
                onChatButtonClicked={toggleChat}
                peopleButtonChecked={activePane === 'people'}
                onPeopleButtonClicked={togglePeople}
                onMoreButtonClicked={onMoreButtonClicked}
                mobileView={mobileView}
                disableButtonsForLobbyPage={isInLobbyOrConnecting}
                /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                disableButtonsForHoldScreen={isInLocalHold}
                callControls={props.callControls}
                containerHeight={containerHeight}
                containerWidth={containerWidth}
                /* @conditional-compile-remove(PSTN-calls) */
                onClickShowDialpad={alternateCallerId ? onClickShowDialpad : undefined}
              />
            </Stack.Item>
          </ChatAdapterProvider>
        )}
        {showControlBar && showDrawer && (
          <ChatAdapterProvider adapter={chatProps.adapter}>
            <CallAdapterProvider adapter={callAdapter}>
              <Stack styles={drawerContainerStyles}>
                <PreparedMoreDrawer
                  callControls={props.callControls}
                  onLightDismiss={closeDrawer}
                  onPeopleButtonClicked={onMoreDrawerPeopleClicked}
                  /* @conditional-compile-remove(PSTN-calls) */
                  onClickShowDialpad={alternateCallerId ? onClickShowDialpad : undefined}
                  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
                  disableButtonsForHoldScreen={isInLocalHold}
                />
              </Stack>
            </CallAdapterProvider>
          </ChatAdapterProvider>
        )}

        {
          /* @conditional-compile-remove(PSTN-calls) */
          showControlBar && showDtmfDialpad && (
            <ChatAdapterProvider adapter={chatProps.adapter}>
              <CallAdapterProvider adapter={callAdapter}>
                <Stack styles={drawerContainerStyles}>
                  <SendDtmfDialpad
                    isMobile={mobileView}
                    strings={dialpadStrings}
                    showDialpad={showDtmfDialpad}
                    onDismissDialpad={onDismissDtmfDialpad}
                  />
                </Stack>
              </CallAdapterProvider>
            </ChatAdapterProvider>
          )
        }
        {
          // This layer host is for ModalLocalAndRemotePIP in CallWithChatPane. This LayerHost cannot be inside the CallWithChatPane
          // because when the CallWithChatPane is hidden, ie. style property display is 'none', it takes up no space. This causes problems when dragging
          // the Modal because the draggable bounds thinks it has no space and will always return to its initial position after dragging.
          mobileView && <LayerHost id={modalLayerHostId} className={mergeStyles(modalLayerHostStyle)} />
        }
      </Stack>
    </div>
  );
};

/**
 * CallWithChatComposite brings together key components to provide a full call with chat experience out of the box.
 *
 * @public
 */
export const CallWithChatComposite = (props: CallWithChatCompositeProps): JSX.Element => {
  const { adapter, fluentTheme, rtl, formFactor, joinInvitationURL, options } = props;
  return (
    <BaseProvider fluentTheme={fluentTheme} rtl={rtl} locale={props.locale} icons={props.icons}>
      <CallWithChatScreen
        {...props}
        /* @conditional-compile-remove(call-readiness) */
        devicePermissions={options?.devicePermissions}
        callWithChatAdapter={adapter}
        formFactor={formFactor}
        callControls={options?.callControls}
        joinInvitationURL={joinInvitationURL}
        fluentTheme={fluentTheme}
        /* @conditional-compile-remove(file-sharing) */
        fileSharing={options?.fileSharing}
      />
    </BaseProvider>
  );
};

const hasJoinedCallFn = (page: CallCompositePage, callStatus: CallState): boolean => {
  /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(one-to-n-calling) */
  return (
    (page === 'call' &&
      (callStatus === 'Connected' || callStatus === 'RemoteHold' || callStatus === 'Disconnecting')) ||
    (page === 'hold' && (callStatus === 'LocalHold' || callStatus === 'Disconnecting'))
  );
  return page === 'call' && (callStatus === 'Connected' || callStatus === 'Disconnecting');
};

const showShowChatTabHeaderButton = (callControls?: boolean | CallWithChatControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.chatButton !== false;
};

const showShowPeopleTabHeaderButton = (callControls?: boolean | CallWithChatControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.peopleButton !== false;
};
