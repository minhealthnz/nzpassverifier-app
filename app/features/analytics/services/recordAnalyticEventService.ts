import { Analytics } from "@aws-amplify/analytics";

import { AnalyticsEvent, AnalyticsEventPayload } from "./events";

type ValueOf<T> = T[keyof T];

export async function recordEvent(
  eventName: Exclude<ValueOf<typeof AnalyticsEvent>, keyof AnalyticsEventPayload>
): Promise<void>;

export async function recordEvent<T extends keyof AnalyticsEventPayload>(
  eventName: T,
  payload: AnalyticsEventPayload[T]
): Promise<void>;

/**
 * Record analytics event with AWS Pinpoint
 */
export async function recordEvent(
  eventName: ValueOf<typeof AnalyticsEvent>,
  payload?: {
    readonly attributes?: Record<string, string>;
    readonly metrics?: Record<string, number>;
  }
): Promise<void> {
  await Analytics.record({ name: eventName, ...payload }).catch();
}

export const recordAnalyticEventService = {
  recordEvent,
};
