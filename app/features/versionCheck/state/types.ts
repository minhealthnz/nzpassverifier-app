export const enum VersionCheckStatus {
  Success = "Success",
  Failure = "Failure",
  Skipped = "Skipped",
  Disabled = "Disabled",
}

export type VersionCheckState = {
  readonly lastVersionCheckAt: number;
  readonly lastSuccessCheckAt?: number;

  readonly isUpdateNeeded?: boolean;
  readonly currentVersion?: string;
  readonly latestVersion?: string;
  readonly versionUpdateUrl?: string;
};

export type VersionCheckResult = SuccessVersionCheckRsult | FailureVersionCheckRsult | SkippedVersionCheckRsult;

type BaseVersionCheckResult = {
  readonly status: VersionCheckStatus;
  readonly isUpdateNeeded: boolean;
  readonly currentVersion?: string;
  readonly versionUpdateUrl?: string;
};

type SuccessVersionCheckRsult = BaseVersionCheckResult & {
  readonly status: VersionCheckStatus.Success;
  readonly lastVersionCheckAt: number;
  readonly lastSuccessCheckAt: number;
};

type FailureVersionCheckRsult = BaseVersionCheckResult & {
  readonly status: VersionCheckStatus.Failure;
  readonly lastVersionCheckAt: number;
};

type SkippedVersionCheckRsult = BaseVersionCheckResult & {
  readonly status: VersionCheckStatus.Disabled | VersionCheckStatus.Skipped;
};
