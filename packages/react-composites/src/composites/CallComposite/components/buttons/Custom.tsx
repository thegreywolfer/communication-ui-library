// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

// eslint-disable-next-line no-restricted-imports
import { Icon } from '@fluentui/react';
import { ControlBarButton, ControlBarButtonStrings } from '@internal/react-components';
import React from 'react';
import {
  CallControlDisplayType,
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement
} from '../../types/CallControlOptions';
/* @conditional-compile-remove(control-bar-button-injection) */
import { CallControlOptions } from '../../types/CallControlOptions';

/** @private */
export type CustomButtons = { [key in CustomCallControlButtonPlacement]: JSX.Element | undefined };

/** @private */
export const generateCustomControlBarButtonStrings = (text: string | undefined): ControlBarButtonStrings => {
  return { label: text };
};

/** @private */
export const generateCustomControlBarButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    primary: undefined
  };

  if (!onFetchCustomButtonProps) {
    return response;
  }

  const allButtonProps = onFetchCustomButtonProps.map((f) => f({ displayType }));

  for (const key in response) {
    response[key] = (
      <>
        {allButtonProps
          .filter((buttonProps) => buttonProps.placement === key)
          .map((buttonProps, i) => (
            <ControlBarButton
              ariaDescription={buttonProps.ariaDescription}
              ariaLabel={buttonProps.ariaLabel}
              disabled={buttonProps.disabled}
              id={buttonProps.id}
              key={buttonProps.key ?? `${buttonProps.placement}_${i}`}
              onClick={buttonProps.onItemClick}
              onRenderIcon={() => <Icon iconName={buttonProps.iconName ?? 'ControlButtonOptions'} />}
              showLabel={buttonProps.showLabel}
              strings={generateCustomControlBarButtonStrings(buttonProps.text)}
              styles={buttonProps.styles}
            />
          ))}
      </>
    );
  }
  return response;
};

/** @private */
export const generateCustomDrawerButtons = (
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[],
  displayType?: CallControlDisplayType
): CustomButtons => {
  const response = {
    primary: undefined
  };

  if (!onFetchCustomButtonProps) {
    return response;
  }

  const allButtonProps = onFetchCustomButtonProps.map((f) => f({ displayType }));
  for (const key in response) {
    response[key] = (
      <>
        {allButtonProps
          .filter((buttonProps) => buttonProps.placement === key)
          .map((buttonProps, i) => ({
            disabled: buttonProps.disabled,
            iconProps: { iconName: buttonProps.iconName },
            id: buttonProps.id,
            itemKey: buttonProps.key ?? `${buttonProps.placement}_${i}`,
            onItemClick: buttonProps.onItemClick,
            text: buttonProps.text
          }))}
      </>
    );
  }
  return response;
};

/* @conditional-compile-remove(control-bar-button-injection) */
/** @private */
export const onFetchCustomButtonPropsTrampoline = (
  options?: CallControlOptions
): CustomCallControlButtonCallback[] | undefined => {
  let response: CustomCallControlButtonCallback[] | undefined = undefined;
  response = options?.onFetchCustomButtonProps;
  return response;
};
