import { OptionsButton } from '@azure/communication-react';
import { IButtonProps, Icon, IContextualMenuProps, Label, Stack } from '@fluentui/react';
import React from 'react';

const exampleOptionsMenuProps: IContextualMenuProps = {
  items: [
    {
      key: '1',
      name: 'Choose Camera',
      iconProps: { iconName: 'Camera' },
      onClick: () => alert('Choose Camera Menu Item Clicked!')
    }
  ]
};

export const OptionsButtonCustomExample: () => JSX.Element = () => {
  const customOnRenderIcon = (): JSX.Element => {
    return (
      <Icon key={'optionsCustomIconKey'} iconName={'CircleAddition'} style={{ color: 'orange', fontSize: '20px' }} />
    );
  };

  const customOnRenderText = (props?: IButtonProps): JSX.Element => {
    return (
      <Label key={'optionsCustomLabelKey'} style={{ color: 'darkviolet', fontStyle: 'italic' }}>
        More
      </Label>
    );
  };

  return (
    <Stack horizontal horizontalAlign={'center'}>
      <OptionsButton
        key={'optionsCustomBtnKey'}
        showLabel={true}
        menuProps={exampleOptionsMenuProps}
        onRenderIcon={customOnRenderIcon}
        onRenderText={customOnRenderText}
      />
    </Stack>
  );
};