export const enum PermissionStatus {
  granted = "granted",
  blocked = "blocked",
  unavailable = "unavailable",
}

export type PermissionService = {
  readonly requestCameraPermission: () => Promise<PermissionStatus>;
  readonly openOsSettings: () => Promise<void>;
};

export type BrowserService = {
  readonly open: (url: string) => Promise<void>;
};
