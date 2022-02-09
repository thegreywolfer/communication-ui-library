// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Calling state passed as as a query argument to set up MockCallingAdapter in playwright test
 */
export type TestCallingState = {
  remoteParticipants?: TestRemoteParticipant[];
  isScreenSharing?: boolean;
  page?: TestPageState;
  diagnostics?: TestDiagnostics;
};

/**
 * Remote participant state used in {@link TestCallingState}
 */
export type TestRemoteParticipant = {
  displayName: string;
  isMuted?: boolean;
  isSpeaking?: boolean;
  isVideoStreamAvailable?: boolean;
  isScreenSharing?: boolean;
};

/**
 * Page state used in {@link TestCallingState}
 */
export type TestPageState =
  | 'accessDeniedTeamsMeeting'
  | 'call'
  | 'configuration'
  | 'joinCallFailedDueToNoNetwork'
  | 'leftCall'
  | 'lobby'
  | 'removedFromCall';

/**
 * Diagnostics state used in {@link TestCallingState}
 */
export type TestDiagnostics = {
  /**
   * Stores diagnostics related to network conditions.
   */
  network?: { networkReconnect?: DiagnosticValue };
  /**
   * Stores diagnostics related to media quality.
   */
  media?: { speakingWhileMicrophoneIsMuted?: DiagnosticValue; cameraFreeze?: DiagnosticValue };
};

/**
 * Diagnostic value used for a child property in {@link TestDiagnostics}
 */
export type DiagnosticValue = {
  value: DiagnosticQuality | boolean;
  valueType: DiagnosticValueType;
};

/**
 * Enum for value in {@link DiagnosticValue}
 */
export enum DiagnosticQuality {
  Good = 1,
  Poor = 2,
  Bad = 3
}

/**
 * Value types for {@link DiagnosticValue}
 */
export type DiagnosticValueType = 'DiagnosticQuality' | 'DiagnosticFlag';