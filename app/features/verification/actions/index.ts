import {
  createAppAsyncThunk,
  createAppAction,
  navigation,
  Audios,
  audioService,
  vibrationService,
  VibrationType,
} from "../../../common";
import { buildIssuerCacheFromStore } from "../../issuerCaching";
import { VerificationResult, VerificationStatus } from "../state";
import { verificationService } from "../services";
import { doRecordAnalyticsScanEvent } from "../../analytics/actions";

/**
 * A reducer action to persist the verification result in the store state
 */
export const doSetVerifyResult = createAppAction<VerificationResult>("verification/setVerifyResult");

/**
 * A thunk action to verify the payload in the store state
 */
export const doVerifyPayload = createAppAsyncThunk<void, string>("verification/verify", async (payload, thunkAPI) => {
  const startAtMs = Date.now();
  const result = await verificationService.verify({
    payload,
    issuerCache: buildIssuerCacheFromStore(thunkAPI),
  });
  const endAtMs = Date.now();
  const processedInMs = Math.max(endAtMs - startAtMs, 0);

  // Abort the operation for outdated requests
  if (thunkAPI.signal.aborted) {
    return;
  }

  // Dispatch reducer action update the state before navigation
  thunkAPI.dispatch(doSetVerifyResult(result));

  // Record scan analytics event
  void thunkAPI.dispatch(doRecordAnalyticsScanEvent({ ...result, processedInMs }));

  const isAudioOn = thunkAPI.getState().settings.isAudioOn;
  const isVibrationOn = thunkAPI.getState().settings.isVibrationOn;

  // TODO(DEBT-011): handle results in the container which reacts to redux state changes
  switch (result.status) {
    case VerificationStatus.Valid: {
      navigation.replace("VerificationSuccess");
      isAudioOn && audioService.playSound(Audios.VALID);
      isVibrationOn && vibrationService.vibrate(VibrationType.VALID);
      return;
    }
    case VerificationStatus.Invalid: {
      navigation.replace("VerificationInvalid");
      isAudioOn && audioService.playSound(Audios.INVALID);
      isVibrationOn && vibrationService.vibrate(VibrationType.INVALID);
      return;
    }
    case VerificationStatus.CannotRead: {
      navigation.replace("VerificationCannotRead");
      isAudioOn && audioService.playSound(Audios.INVALID);
      isVibrationOn && vibrationService.vibrate(VibrationType.INVALID);
      return;
    }
    case VerificationStatus.CannotValidate: {
      navigation.replace("VerificationCannotValidate");
      isAudioOn && audioService.playSound(Audios.INVALID);
      isVibrationOn && vibrationService.vibrate(VibrationType.INVALID);
      return;
    }
  }
});

export const doCancelVerification = createAppAsyncThunk("verification/cancel", () => {
  return navigation.navigate("Scan");
});

type DoCloseVerificationResultOptions = { readonly navigateHome: boolean };
export const doCloseVerificationResult = createAppAsyncThunk<void, DoCloseVerificationResultOptions>(
  "verification/close",
  (options, _thunkAPI) => {
    const { navigateHome = false } = options;
    const nextRoute = navigateHome ? "Home" : "Scan";
    return navigation.navigate(nextRoute);
  }
);
