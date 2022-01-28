import { AnalyticsEvent, analyticsSetupService, recordAnalyticEventService } from "../services";
import { config, createAppAsyncThunk } from "../../../common";
import { VerificationResultWithProcessedTime, VerificationStatus } from "../../verification";

export const doRecordAnalyticsScanEvent = createAppAsyncThunk<void, VerificationResultWithProcessedTime>(
  "analytics/scan",
  (verificationResult, _thunkAPI) => {
    if (!config.ANALYTICS_ENABLED) {
      return;
    }

    const { processedInMs } = verificationResult;

    if (verificationResult.status === VerificationStatus.Valid) {
      return recordAnalyticEventService.recordEvent(AnalyticsEvent.SCAN_VALID, { metrics: { processedInMs } });
    } else {
      const reason =
        verificationResult.status === VerificationStatus.Invalid
          ? verificationResult.failureReason
          : verificationResult.status;
      return recordAnalyticEventService.recordEvent(AnalyticsEvent.SCAN_INVALID, {
        attributes: { reason },
        metrics: { processedInMs },
      });
    }
  }
);

export const doRecordAnalyticsFirstUse = createAppAsyncThunk("analytics/firstUse", (_options, thunkAPI) => {
  if (!config.ANALYTICS_ENABLED) {
    return;
  }

  const { appHasFirstLaunched } = thunkAPI.getState().analytics;
  if (!appHasFirstLaunched) {
    return recordAnalyticEventService.recordEvent(AnalyticsEvent.FIRST_USE);
  }
});

export const doSetupAnalytics = createAppAsyncThunk("analytics/init", (_options, _thunkAPI) => {
  if (!config.ANALYTICS_ENABLED) {
    return;
  }

  return analyticsSetupService.init();
});
