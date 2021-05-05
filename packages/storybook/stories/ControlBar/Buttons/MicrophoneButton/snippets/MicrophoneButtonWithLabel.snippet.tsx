import React from 'react';
import { MicrophoneButton } from 'react-components';
import { Stack } from '@fluentui/react';

export const MicrophoneButtonWithLabelExample: () => JSX.Element = () => {
  return (
    <Stack horizontal horizontalAlign={'center'}>
      <MicrophoneButton showLabel={true} checked={true} />
    </Stack>
  );
};