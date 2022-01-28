import {
  check,
  PERMISSIONS,
  request,
  PermissionStatus as RNPermissionLibStatus,
  openSettings,
} from "react-native-permissions";

import { PermissionService, PermissionStatus } from "./types";
import { Platform } from "react-native";

/**
 * The difference between android and iOS is that on iOS if user rejects permission, then the permission is not requestable again and status of the permission is blocked.
 * Whereas on android, the user can reject the permission but if they don't press "Never ask again", we can prompt again and the status of the permission is denied.
 */

/**
 * @see {@link https://github.com/zoontek/react-native-permissions#ios-flow}
 */
const requestIosCameraPermission = async (): Promise<PermissionStatus> => {
  const iosCameraPermission = PERMISSIONS.IOS.CAMERA;
  const mapStatusToResponse = (status: RNPermissionLibStatus): PermissionStatus => {
    switch (status) {
      case "granted":
        return PermissionStatus.granted;
      case "blocked":
        return PermissionStatus.blocked;
      default:
        return PermissionStatus.unavailable;
    }
  };
  const statusCheckResult = await check(iosCameraPermission);

  if (statusCheckResult === "denied") {
    // If status is denied, it means it's requestable
    return mapStatusToResponse(await request(iosCameraPermission));
  }
  return mapStatusToResponse(statusCheckResult);
};

/**
 * @see {@link https://github.com/zoontek/react-native-permissions#android-flow}
 */
const requestAndroidCameraPermission = async (): Promise<PermissionStatus> => {
  const androidCameraPermission = PERMISSIONS.ANDROID.CAMERA;
  const mapStatusToResponse = (status: RNPermissionLibStatus): PermissionStatus => {
    switch (status) {
      case "granted":
        return PermissionStatus.granted;
      case "blocked":
      case "denied":
        return PermissionStatus.blocked;
      default:
        return PermissionStatus.unavailable;
    }
  };
  const statusCheckResult = await check(androidCameraPermission);
  if (statusCheckResult === "denied") {
    // If status is denied, it means it's requestable
    return mapStatusToResponse(await request(androidCameraPermission));
  }
  return mapStatusToResponse(statusCheckResult);
};

/**
 * A service for resolving a devices permissions that this app requires
 */
export const permissionService: PermissionService = {
  requestCameraPermission: Platform.OS === "ios" ? requestIosCameraPermission : requestAndroidCameraPermission,
  openOsSettings: openSettings,
};
