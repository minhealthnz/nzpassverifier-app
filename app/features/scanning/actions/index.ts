import { unwrapResult } from "@reduxjs/toolkit";

import { PermissionStatus, createAppAsyncThunk, createAppAction, navigation, permissionService } from "../../../common";
import { doRecheckVersion } from "../../versionCheck";

/**
 * Action that puts the scanned payload into the store.
 */
export const doSetPayload = createAppAction<string>("scan/setPayload");

/**
 * Action that sets the users preference to not see front camera alert anymore
 */
export const doDisableFrontCameraAlerts = createAppAction("scan/doDisableFrontCameraAlerts");

/**
 * Action on init scanning
 * Request services to figure out if this device requires permissions
 */
export const doRequestPermissions = createAppAsyncThunk<boolean>("scan/requestPermissions", async () => {
  const result = await permissionService.requestCameraPermission();
  return result === PermissionStatus.granted;
});

/**
 * Action go to OS camera settings
 * Navigate user to the OS level app permission settings
 */
export const doOpenOsSettings = createAppAsyncThunk("scan/openOsSettings", async () => {
  await permissionService.openOsSettings();
  return;
});

/**
 * Action on scan of a barcode
 * Currently, this will only be triggering a verify
 */
export const doScan = createAppAsyncThunk<void, string>("scan/capture", async (payload: string, thunkAPI) => {
  const versionInfo = unwrapResult(await thunkAPI.dispatch(doRecheckVersion()));

  if (!versionInfo.isUpdateNeeded) {
    thunkAPI.dispatch(doSetPayload(payload));
    return navigation.navigate("Verify");
  }
  return;
});

/**
 * Action when the scan is cancelled
 * If there is an async action in progress, we should cancel it here
 */
export const doCancelScan = createAppAsyncThunk("scan/cancel", (_options, _thunkAPI) => {
  return navigation.back();
});
