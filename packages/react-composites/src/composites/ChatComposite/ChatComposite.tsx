// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CommunicationUiErrorInfo } from '../../types/CommunicationUiError';
import { ChatScreen } from './ChatScreen';
import { GroupChatAdapterProvider } from './adapter/GroupChatAdapterProvider';
import { GroupChatAdapter } from './adapter/GroupChatAdapter';

export type GroupChatProps = {
  adapter: GroupChatAdapter;
  onRenderAvatar?: (userId: string) => JSX.Element;
  onErrorCallback?: (error: CommunicationUiErrorInfo) => void;
  options?: GroupChatOptions;
};

type GroupChatOptions = {
  sendBoxMaxLength?: number; // Limit max send box length, when change viewport size
  // messagesPerPage?: number; // Number of messages per page - smaller for better perf
  // supportNewline: boolean; // Whether to support new line (shift+enter) in textArea, disable until ACS backend supports line switch
};

export default (props: GroupChatProps): JSX.Element => {
  const { adapter, options, onRenderAvatar } = props;

  return (
    <GroupChatAdapterProvider adapter={adapter}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <ChatScreen sendBoxMaxLength={options?.sendBoxMaxLength} onRenderAvatar={onRenderAvatar} />
    </GroupChatAdapterProvider>
  );
};