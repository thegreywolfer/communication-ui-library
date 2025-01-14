// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(unsupported-browser) */
import { Icon, Link, Stack, Text } from '@fluentui/react';
/* @conditional-compile-remove(unsupported-browser) */
import { _pxToRem } from '@internal/acs-ui-common';
import React from 'react';
/* @conditional-compile-remove(unsupported-browser) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(unsupported-browser) */
import {
  containerStyles,
  iconStyles,
  linkTextStyles,
  mainTextStyles,
  secondaryTextStyles
} from './styles/UnsupportedBrowser.styles';

/**
 * Strings for UnsupportedBrowser component
 *
 * @beta
 */
export interface UnsupportedBrowserStrings {
  /** String for the primary text */
  primaryText: string;
  /** String for the secondary text */
  secondaryText: string;
  /** String for the help link */
  moreHelpLink: string;
}

/**
 * props for UnsupportedBrowser UI
 *
 * @beta
 */
export interface UnsupportedBrowserProps {
  /** Handler to perform a action when the help link is actioned */
  onTroubleshootingClick?: () => void;
  /** String overrides for the component */
  strings: UnsupportedBrowserStrings;
}

/* @conditional-compile-remove(unsupported-browser) */
const UnsupportedBrowserContainer = (props: UnsupportedBrowserProps): JSX.Element => {
  const { onTroubleshootingClick, strings } = props;
  return (
    <Stack styles={containerStyles}>
      <Icon styles={iconStyles} iconName="UnsupportedBrowserWarning" data-ui-id="unsupportedBrowserIcon"></Icon>
      <Text styles={mainTextStyles}>{strings.primaryText}</Text>
      <Text styles={secondaryTextStyles}>{strings.secondaryText}</Text>
      {onTroubleshootingClick && (
        <Link
          styles={linkTextStyles}
          onClick={() => {
            onTroubleshootingClick();
          }}
          data-ui-id="unsupportedBrowserLink"
        >
          {strings.moreHelpLink}
        </Link>
      )}
    </Stack>
  );
};

/**
 * UI to display to the user that the browser they are using is not supported by calling application.
 *
 * @beta
 */
export const UnsupportedBrowser = (props: UnsupportedBrowserProps): JSX.Element => {
  /* @conditional-compile-remove(unsupported-browser) */
  const strings = useLocale().strings.UnsupportedBrowser;
  /* @conditional-compile-remove(unsupported-browser) */
  return <UnsupportedBrowserContainer {...props} strings={strings} />;
  return <></>;
};
