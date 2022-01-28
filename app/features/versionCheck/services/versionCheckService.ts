import VersionCheck from "react-native-version-check";
import { Result, err, ok, fromPromise } from "neverthrow";

import { config } from "../../../common";
import {
  VersionCheckPolicy,
  VersionCheckErrorType,
  VersionCheckResult,
  VersionCheckError,
  DefaultVersionInfo,
  isVersionCheckError,
} from "./types";

/**
 * Helper function that creates an app version provider for the `react-native-version-check` library
 * when the `VERSION_CHECK_PROVIDER_URL_OVERRIDE` is specified.
 */
const buildVersionProvider = (): (() => Promise<string>) | undefined => {
  const { VERSION_CHECK_PROVIDER_URL_OVERRIDE } = config;
  if (!VERSION_CHECK_PROVIDER_URL_OVERRIDE) {
    return undefined;
  }
  return async (): Promise<string> => {
    const resp = await fetch(VERSION_CHECK_PROVIDER_URL_OVERRIDE, {
      headers: {
        "Cache-Control": "no-cache",
      },
    });
    const payload = (await resp.json()) as { readonly version: string };

    if (!("version" in payload) || typeof payload.version !== "string") {
      return Promise.reject({
        type: VersionCheckErrorType.INVALID_VERSION,
        message: `Invalid app version: ${payload?.version}`,
      });
    }
    return payload.version;
  };
};

/**
 * Helper function that converts the configured version check policy to the matched
 * `react-native-version-check` settings.
 */
const parseVersionDepth = (): number => {
  switch (config.VERSION_CHECK_POLICY) {
    case VersionCheckPolicy.MAJOR:
      return 1; // check major version only
    case VersionCheckPolicy.MINOR:
      return 2; // check major and minor version only
    case VersionCheckPolicy.PATCH:
      return 3; // check all version
    default:
      return 3; // check all version
  }
};

/**
 * Function that returns `true` when the app version checking feature is enabled.
 */
const isVersionCheckEnabled = (): boolean => {
  return config.VERSION_CHECK_ENABLED === true;
};

/**
 * Function that returns `true` if the last version check result is outdated. A past result can be
 * used while still valid, used to reduce the version check frequency.
 */
const isLastCheckOutdated = (state: { readonly lastVersionCheckAt: number }): boolean => {
  const { lastVersionCheckAt } = state;
  return Date.now() > lastVersionCheckAt + config.VERSION_CHECK_LASTCHECK_MIN_AGE_MS;
};

/**
 * Function that returns `true` if no successful version check happens within the maximum tolerance
 * period. User must check for update immediately.
 */

const isLastSuccessfulCheckOutdated = (state: { readonly lastSuccessCheckAt: number | undefined }): boolean => {
  const { lastSuccessCheckAt } = state;

  // Skip when user had never successfully checked the version from remote server
  if (!lastSuccessCheckAt) {
    return false;
  }
  return Date.now() > lastSuccessCheckAt + config.VERSION_CHECK_LASTCHECK_MAX_AGE_MS;
};

/**
 * Function that returns the default version info for the app:
 *
 * - the URL or deeplink for users to update the app
 * - the current app version
 */
const getDefaultVersionInfo = async (): Promise<DefaultVersionInfo> => {
  const currentVersion = VersionCheck.getCurrentVersion();

  if (config.VERSION_CHECK_UPDATE_URL_OVERRIDE) {
    const versionUpdateUrl = config.VERSION_CHECK_UPDATE_URL_OVERRIDE;
    return { currentVersion, versionUpdateUrl };
  }

  const result = await fromPromise(VersionCheck.getStoreUrl(), () => undefined);
  if (result.isOk()) {
    return { currentVersion, versionUpdateUrl: result.value };
  }
  return { currentVersion };
};

/**
 * Function that compares the currently installed version retrieved from DeviceInfo with the latest
 * available app version fetched on the remote server, and returns whether an update is required.
 */
const check = async (options: {
  readonly isRecheck?: boolean;
  readonly isForceUpdateRequired?: boolean;
}): Promise<Result<VersionCheckResult, VersionCheckError>> => {
  // compare the current app version with the latest version from remote
  const versionProvider = buildVersionProvider();
  const versionCheck = VersionCheck.needUpdate({
    depth: parseVersionDepth(),

    // Report version check failure, by default it only logs a warning message
    ignoreErrors: false,

    // TODO Fix the library's type definition, the provider should support `() => Promise<string>`,
    // but mistakenly declared as `() => string | string | undefined`.
    ...(versionProvider ? { provider: versionProvider as unknown as undefined } : {}),
  });

  // terminate the operation after a short period
  const checkTimeout = new Promise<never>((_resolve, reject) => {
    // If force update is not required, but the initial version check was failed, the app should
    // not prompt for an update in this case.
    const isAccurateResultRequired = options.isRecheck || options.isForceUpdateRequired;

    const timeoutMs = isAccurateResultRequired
      ? config.VERSION_CHECK_REQUEST_TIMEOUT_MS
      : config.VERSION_CHECK_INITIAL_REQUEST_TIMEOUT_MS;

    const error = {
      type: VersionCheckErrorType.VERSION_CHECK_TIMEOUT,
    };
    setTimeout(() => reject(error), timeoutMs);
  });

  const checkResult = await fromPromise(Promise.race([versionCheck, checkTimeout]), (error) => {
    if (isVersionCheckError(error)) {
      return error;
    }
    return {
      type: VersionCheckErrorType.VERSION_CHECK_FAILURE,
      message: `Error while checking app version`,
    };
  });

  if (checkResult.isErr()) {
    return err(checkResult.error);
  }

  // The `VersionCheck.needUpdate` returns `undefined` when failed to fetch app info
  // along with a warning message. Likely the app hasn't been published yet.
  if (!checkResult.value) {
    return err({
      type: VersionCheckErrorType.VERSION_CHECK_FAILURE,
      message: "No version info about the app",
    });
  }

  const { value: result } = checkResult;

  return ok({
    isUpdateNeeded: result.isNeeded,
    currentVersion: result.currentVersion,
    latestVersion: result.latestVersion,
    versionUpdateUrl: config.VERSION_CHECK_UPDATE_URL_OVERRIDE || result.storeUrl,
  });
};

export const versionCheckService = {
  check,
  getDefaultVersionInfo,
  isVersionCheckEnabled,
  isLastCheckOutdated,
  isLastSuccessfulCheckOutdated,
};
