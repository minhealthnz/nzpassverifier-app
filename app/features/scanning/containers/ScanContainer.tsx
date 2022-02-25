import React, { useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../common";
import { ScanScreen } from "../screens";
import { doCancelScan, doRequestPermissions, doScan, doOpenOsSettings, doDisableFrontCameraAlerts } from "../actions";
import { InteractionManager } from "react-native";
import { unwrapResult } from "@reduxjs/toolkit";
import { ScanScreenStatus } from "../screens/ScanScreen";
import { doToggleAudio, doToggleCameraType, doToggleVibration } from "../../settings/actions";

/**
 * Container for the {@link ScanScreen}
 */
export const ScanContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const [screenCameraState, setScreenCameraState] = useState<ScanScreenStatus>("loading");
  const isFrontCamera = useAppSelector((state) => state.settings.isFrontCamera);
  const isAudioOn = useAppSelector((state) => state.settings.isAudioOn);
  const isVibrationOn = useAppSelector((state) => state.settings.isVibrationOn);
  const isFrontCameraAlertDisabled = useAppSelector((state) => state.scanning.isFrontCameraAlertDisabled);

  const handleScanQrCode = (payload: string) => appDispatch(doScan(payload));
  const handleGoToPermissionSettings = () => appDispatch(doOpenOsSettings());
  const handleCancel = () => appDispatch(doCancelScan());
  const handleToggleCameraType = () => appDispatch(doToggleCameraType());
  const handleToggleAudio = () => appDispatch(doToggleAudio());
  const handleToggleVibration = () => appDispatch(doToggleVibration());
  const handleDontShowFrontCameraAlert = useCallback(() => appDispatch(doDisableFrontCameraAlerts()), [appDispatch]);

  /**
   * Permission state can change at any time based on device so don't represent in redux
   * Rather this screen uses the action result and keeps as local state to the container
   * Until this is required in the state keep contained in this container
   * @see {@link https://redux.js.org/faq/organizing-state#do-i-have-to-put-all-my-state-into-redux-should-i-ever-use-reacts-setstate}
   */
  const requestCameraPermission = useCallback(() => {
    // Navigation animation could still be running, so run this after animations and interactions
    void InteractionManager.runAfterInteractions(async () => {
      const doRequestPermissionsDispatch = await appDispatch(doRequestPermissions());
      const permissionGranted = unwrapResult(doRequestPermissionsDispatch);
      setScreenCameraState(permissionGranted ? "scanning" : "goToSettings");
    });
  }, [appDispatch]);

  return (
    <ScanScreen
      handleCancel={handleCancel}
      handleOnMount={requestCameraPermission}
      screenStatus={screenCameraState}
      handleGoToPermissionSettings={handleGoToPermissionSettings}
      handleScanQrCode={handleScanQrCode}
      isFrontCamera={isFrontCamera}
      handleToggleCameraType={handleToggleCameraType}
      isAudioOn={isAudioOn}
      handleToggleAudio={handleToggleAudio}
      isVibrationOn={isVibrationOn}
      handleToggleVibration={handleToggleVibration}
      handleDontShowFrontCameraAlert={handleDontShowFrontCameraAlert}
      showFrontCameraAlert={isFrontCamera && !isFrontCameraAlertDisabled}
    />
  );
};
