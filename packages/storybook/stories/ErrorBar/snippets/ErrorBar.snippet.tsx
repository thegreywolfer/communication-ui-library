import React from 'react';
import { ErrorBar } from 'react-components';

export const ErrorBarExample: () => JSX.Element = () => {
  const message = 'Something went wrong';
  const onClearError = (): void => alert('closed error bar');
  return <ErrorBar message={message} onClose={onClearError} />;
};