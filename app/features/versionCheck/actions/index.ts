import { unwrapResult } from "@reduxjs/toolkit";

import { createAppAction, createAppAsyncThunk, navigation, browserService } from "../../../common";
import { versionCheckService } from "../services";
import { VersionCheckResult, VersionCheckStatus } from "../state";

export const doSetVersionCheckResult = createAppAction<VersionCheckResult>("versionCheck/setVersionCheckResult");

export const doForceVersionUpdate = createAppAsyncThunk("versionCheck/update", (_options, thunkAPI) => {
  const { versionUpdateUrl } = thunkAPI.getState().versionCheck;

  if (versionUpdateUrl) {
    void browserService.open(versionUpdateUrl);
    return;
  }
});

export type VersionCheckOptions = {
  readonly isRecheck?: boolean;
};
export const doVersionCheck = createAppAsyncThunk<VersionCheckResult, VersionCheckOptions | undefined>(
  "versionCheck/check",
  async (options, thunkAPI) => {
    const { isRecheck = false } = options || {};

    // skip version check unless enabled
    if (!versionCheckService.isVersionCheckEnabled()) {
      return {
        status: VersionCheckStatus.Disabled,
        isUpdateNeeded: false,
      };
    }

    const { lastSuccessCheckAt, lastVersionCheckAt } = thunkAPI.getState().versionCheck;

    // skip regular check if the stored version is not outdated
    if (isRecheck && !versionCheckService.isLastCheckOutdated({ lastVersionCheckAt })) {
      return {
        status: VersionCheckStatus.Skipped,
        isUpdateNeeded: false,
      };
    }

    const isLastSuccessfulCheckOutdated = versionCheckService.isLastSuccessfulCheckOutdated({ lastSuccessCheckAt });

    const result = await versionCheckService.check({
      isRecheck,
      isForceUpdateRequired: isLastSuccessfulCheckOutdated,
    });

    if (result.isErr()) {
      if (isLastSuccessfulCheckOutdated) {
        // Ensure there is sufficient data to render the VersionUpdateScreen
        const defaultInfo = await versionCheckService.getDefaultVersionInfo();
        const versionInfo: VersionCheckResult = {
          status: VersionCheckStatus.Failure,
          isUpdateNeeded: true,
          currentVersion: defaultInfo.currentVersion,
          versionUpdateUrl: defaultInfo.versionUpdateUrl,
          lastVersionCheckAt: Date.now(),
        };
        thunkAPI.dispatch(doSetVersionCheckResult(versionInfo));
        navigation.reset("ConnectionRequired");
        return versionInfo;
      }
      return {
        status: VersionCheckStatus.Failure,
        isUpdateNeeded: false,
        lastVersionCheckAt: Date.now(),
      };
    }

    if (result.value.isUpdateNeeded) {
      const versionInfo: VersionCheckResult = {
        status: VersionCheckStatus.Failure,
        lastVersionCheckAt: Date.now(),
        ...result.value,
      };
      thunkAPI.dispatch(doSetVersionCheckResult(versionInfo));
      navigation.reset("VersionUpdate");
      return versionInfo;
    }

    const successVersionCheckResult: VersionCheckResult = {
      status: VersionCheckStatus.Success,
      lastVersionCheckAt: Date.now(),
      lastSuccessCheckAt: Date.now(),
      ...result.value,
    };
    thunkAPI.dispatch(doSetVersionCheckResult(successVersionCheckResult));
    return successVersionCheckResult;
  }
);

export const doRecheckVersion = createAppAsyncThunk<VersionCheckResult, void>(
  "versionCheck/recheck",
  async (_options, thunkAPI) => {
    const result = await thunkAPI.dispatch(doVersionCheck({ isRecheck: true }));
    return unwrapResult(result);
  }
);
