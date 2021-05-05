// © Microsoft Corporation. All rights reserved.

import { GUID_FOR_INITIAL_TOPIC_NAME } from 'react-composites';
export const existsTopicName = (topicName?: string): boolean =>
  !!topicName && topicName !== GUID_FOR_INITIAL_TOPIC_NAME;