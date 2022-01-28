export const enum VersionCheckPolicy {
  MAJOR = "MAJOR",
  MINOR = "MINOR",
  PATCH = "PATCH",
}

export const enum VersionCheckErrorType {
  INVALID_VERSION = "INVALID_VERSION",
  VERSION_CHECK_FAILURE = "VERSION_CHECK_FAILURE",
  VERSION_CHECK_TIMEOUT = "VERSION_CHECK_TIMEOUT",
}

export type VersionCheckError = {
  readonly type: VersionCheckErrorType;
  readonly message?: string;
};

/**
 * Return `true` if the given error is a `VersionCheckError`.
 */
export const isVersionCheckError = (error: unknown): error is VersionCheckError => {
  if (error && typeof error === "object" && "type" in error) {
    const { type } = error as { readonly type: string };
    return (
      type === VersionCheckErrorType.INVALID_VERSION ||
      type === VersionCheckErrorType.VERSION_CHECK_FAILURE ||
      type === VersionCheckErrorType.VERSION_CHECK_TIMEOUT
    );
  }
  return false;
};

export type VersionCheckResult = {
  readonly isUpdateNeeded: boolean;
  readonly currentVersion: string;
  readonly latestVersion: string;
  readonly versionUpdateUrl: string;
};

export type DefaultVersionInfo = {
  readonly currentVersion: string;
  readonly versionUpdateUrl?: string;
};
