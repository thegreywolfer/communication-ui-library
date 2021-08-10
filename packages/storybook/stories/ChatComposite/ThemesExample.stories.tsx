// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatComposite } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd, getControlledTheme } from '../controlsUtils';
import { getDocs } from './ChatCompositeDocs';
import { ContosoChatContainer, ContainerProps } from './snippets/Container.snippet';
import { createUserAndThread } from './snippets/Server.snippet';
import { ConfigHintBanner, addParrotBotToThread } from './snippets/Utils';

const messageArray = [
  'Welcome to the theming example!',
  'The ChatComposite can be themed with a Fluent UI theme, just like the base components.',
  'Here, you can play around with some themes from the @fluentui/theme-samples package.',
  'To build your own theme, we recommend using https://aka.ms/themedesigner',
  'Have fun!'
];

const ThemeStory = (args): JSX.Element => {
  const [containerProps, setContainerProps] = useState<ContainerProps>();

  useEffect(() => {
    const fetchToken = async (): Promise<void> => {
      if (args.connectionString && args.displayName) {
        const newProps = await createUserAndThread(args.connectionString, args.displayName);
        await addParrotBotToThread(args.connectionString, newProps.token, newProps.threadId, messageArray);
        setContainerProps(newProps);
      } else {
        setContainerProps(undefined);
      }
    };
    fetchToken();
  }, [args.connectionString, args.displayName]);

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {containerProps ? (
        <ContosoChatContainer
          {...containerProps}
          fluentTheme={getControlledTheme(args.theme)}
          showParticipants={true}
        />
      ) : (
        <ConfigHintBanner />
      )}
    </Stack>
  );
};

export const ThemeExample = ThemeStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-themeexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Theme Example`,
  component: ChatComposite,
  argTypes: {
    connectionString: controlsToAdd.connectionString,
    displayName: controlsToAdd.displayName,
    theme: controlsToAdd.theme,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
