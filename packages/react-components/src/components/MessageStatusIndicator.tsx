// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { mergeStyles, TooltipHost } from '@fluentui/react';
import { MessageStatus } from 'acs-ui-common';
import {
  MessageStatusIndicatorErrorIconStyle,
  MessageStatusIndicatorIconStyle
} from './styles/MessageStatusIndicator.styles';
import {
  Circle20Regular,
  CheckmarkCircle20Regular,
  ErrorCircle20Regular,
  EyeShow20Filled
} from '@fluentui/react-icons';
import { BaseCustomStylesProps } from '../types';

/**
 * Props for MessageStatusIndicator component
 */
export interface MessageStatusIndicatorProps {
  /** Message status that determines the icon to display. */
  status?: MessageStatus;
  /** Text to display in the delivered message icon tooltip. */
  deliveredTooltipText?: string;
  /** Text to display in the seen message icon tooltip. */
  seenTooltipText?: string;
  /** Text to display in the sending message icon tooltip. */
  sendingTooltipText?: string;
  /** Text to display in the failed message icon tooltip. */
  failedToSendTooltipText?: string;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <MessageStatus styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
}

/**
 * MessageStatusIndicator component.
 */
export const MessageStatusIndicator = (props: MessageStatusIndicatorProps): JSX.Element => {
  const {
    status,
    deliveredTooltipText = 'Sent',
    seenTooltipText = 'Seen',
    sendingTooltipText = 'Sending',
    failedToSendTooltipText = 'Failed to send',
    styles
  } = props;

  switch (status) {
    case 'failed':
      return (
        <TooltipHost content={failedToSendTooltipText}>
          <ErrorCircle20Regular
            primaryFill="currentColor"
            className={mergeStyles(MessageStatusIndicatorErrorIconStyle, styles?.root)}
          />
        </TooltipHost>
      );
    case 'sending':
      return (
        <TooltipHost content={sendingTooltipText}>
          <Circle20Regular
            primaryFill="currentColor"
            className={mergeStyles(MessageStatusIndicatorIconStyle, styles?.root)}
          />
        </TooltipHost>
      );
    case 'seen':
      return (
        <TooltipHost content={seenTooltipText}>
          <EyeShow20Filled primaryFill="currentColor" className={mergeStyles(styles?.root)} />
        </TooltipHost>
      );
    case 'delivered':
      return (
        <TooltipHost content={deliveredTooltipText}>
          <CheckmarkCircle20Regular
            primaryFill="currentColor"
            className={mergeStyles(MessageStatusIndicatorIconStyle, styles?.root)}
          />
        </TooltipHost>
      );
    default:
      return <></>;
  }
};
