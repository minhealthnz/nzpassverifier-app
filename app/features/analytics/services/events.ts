import { InvalidReason, VerificationStatus } from "../../verification";

export const enum AnalyticsEvent {
  SCAN_VALID = "scanValid",
  SCAN_INVALID = "scanInvalid",
  FIRST_USE = "firstUse",
}

export type AnalyticsEventPayload = {
  readonly [AnalyticsEvent.SCAN_INVALID]: {
    readonly attributes: {
      readonly reason: VerificationStatus.CannotRead | VerificationStatus.CannotValidate | InvalidReason;
    };
    readonly metrics: {
      readonly processedInMs: number;
    };
  };
  readonly [AnalyticsEvent.SCAN_VALID]: {
    readonly metrics: {
      readonly processedInMs: number;
    };
  };
};
