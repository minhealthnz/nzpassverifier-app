import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, LayoutChangeEvent, Platform, Alert } from "react-native";
import {
  Button,
  ButtonBar,
  IconButton,
  IconName,
  ScreenContainer,
  themeTokens,
  Text,
  useAppState,
  useWindowScale,
  WindowScaleFunctions,
  config,
} from "../../../common";
import { RNCamera, BarCodeReadEvent } from "react-native-camera";
import BarcodeMask from "react-native-barcode-mask";
import { PartialModal } from "../components/PartialModal";
import { getBarcodeFinderSize } from "../utilities";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";

const MIN_INTERVAL_BETWEEN_SCANS = 2500;

export type ScanScreenStatus = "loading" | "scanning" | "goToSettings";
export type ScanScreenProps = {
  readonly handleCancel: () => void;
  readonly handleOnMount: () => void;
  readonly handleScanQrCode: (payload: string) => void;
  readonly handleGoToPermissionSettings: () => void;
  readonly screenStatus: ScanScreenStatus;
  readonly isFrontCamera: boolean;
  readonly handleToggleCameraType: () => void;
  readonly isAudioOn: boolean;
  readonly handleToggleAudio: () => void;
  readonly handleDontShowFrontCameraAlert: () => void;
  readonly showFrontCameraAlert: boolean;
};

/**
 * Screen allowing the user to scan barcodes with the devices camera
 *
 * @param props - {@link ScanScreenProps}
 */
export const ScanScreen: React.FC<ScanScreenProps> = (props) => {
  const {
    handleScanQrCode,
    handleGoToPermissionSettings,
    handleCancel,
    handleOnMount,
    screenStatus,
    isFrontCamera,
    isAudioOn,
    handleToggleCameraType,
    handleToggleAudio,
    handleDontShowFrontCameraAlert,
    showFrontCameraAlert,
  } = props;
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraMaskFinderSize, setCameraMaskFinderSize] = useState<number | null>(null);
  const previousScannedRef = useRef<number>();
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  useEffect(() => {
    handleOnMount();
  }, [handleOnMount]);

  const handleToggleTorch = useCallback(() => {
    setIsTorchOn(!isTorchOn);
  }, [isTorchOn]);

  const onContentViewLayoutEvent = useCallback(
    (event: LayoutChangeEvent) => {
      const { layout } = event.nativeEvent;
      setCameraMaskFinderSize(getBarcodeFinderSize(layout, themeTokens.spacing.horizontal.xl.value));
    },
    [setCameraMaskFinderSize]
  );

  useEffect(() => {
    showFrontCameraAlert &&
      Alert.alert(t("scanning:frontCameraAlertTitle"), t("scanning:frontCameraAlertSubTitle"), [
        {
          text: t("scanning:doNotShowAgain"),
          onPress: handleDontShowFrontCameraAlert,
        },
        { text: t("scanning:dismiss") },
      ]);
  }, [showFrontCameraAlert, handleDontShowFrontCameraAlert, t]);

  const appState = useAppState();
  /**
   * Function called when the camera registers a QR code
   *
   * @remarks
   * Includes applying a buffer and checking the active status
   * If trying to execute this in background the app may crash
   */
  const onCameraScanQrCode = useCallback(
    (barcode: BarCodeReadEvent) => {
      if (!barcode || appState !== "active") {
        return;
      }

      // Reduce the frequency of invoking the callback function
      const { current: previousScannedAt = 0 } = previousScannedRef;
      if (Date.now() < previousScannedAt + MIN_INTERVAL_BETWEEN_SCANS) {
        return;
      }
      previousScannedRef.current = Date.now();

      handleScanQrCode(barcode.data);
    },
    [handleScanQrCode, appState]
  );

  const barcodeMask = useMemo(
    () =>
      cameraMaskFinderSize && (
        <BarcodeMask
          showAnimatedLine={false}
          width={cameraMaskFinderSize}
          height={cameraMaskFinderSize}
          {...styles.barcodeMask}
        />
      ),
    [cameraMaskFinderSize, styles]
  );

  const settingsModal = useMemo(
    () => (
      <PartialModal>
        <View style={styles.goToSettingsAlertBox}>
          <Text style={styles.goToSettingsDescription}>{t("scanning:goToSettingsDescription")}</Text>
          <Text onPress={handleGoToPermissionSettings} style={styles.goToSettingsActionText} accessibilityRole={"link"}>
            {t("scanning:goToSettings")}
          </Text>
        </View>
      </PartialModal>
    ),
    [handleGoToPermissionSettings, t, styles]
  );

  const cameraSettings = useMemo(
    () => (
      <View style={styles.cameraSettingsContainer}>
        <View style={styles.torchIconContainer}>
          {!isFrontCamera && (
            <IconButton
              disabled={screenStatus !== "scanning"}
              {...styles.cameraSettingsIcons}
              iconName={isTorchOn ? IconName.torchPrimary : IconName.torchSecondary}
              onPress={handleToggleTorch}
              accessibilityLabel={t(isTorchOn ? "scanning:turnTorchOff" : "scanning:turnTorchOn")}
            />
          )}
        </View>
        {config.FEATURE_FRONT_CAMERA_ENABLED && (
          <View style={styles.cameraIconContainer}>
            <IconButton
              {...styles.cameraSettingsIcons}
              iconName={isFrontCamera ? IconName.cameraFlipPrimary : IconName.cameraFlipSecondary}
              onPress={handleToggleCameraType}
              accessibilityLabel={t(isFrontCamera ? "scanning:useBackCamera" : "scanning:useFrontCamera")}
            />
          </View>
        )}
        <View style={styles.soundIconContainer}>
          <IconButton
            {...styles.cameraSettingsIcons}
            iconName={isAudioOn ? IconName.audioOnSecondary : IconName.audioOffPrimary}
            onPress={handleToggleAudio}
            accessibilityLabel={t(isAudioOn ? "scanning:turnAudioOff" : "scanning:turnAudioOn")}
          />
        </View>
      </View>
    ),
    [
      handleToggleAudio,
      isAudioOn,
      handleToggleTorch,
      isTorchOn,
      screenStatus,
      t,
      isFrontCamera,
      handleToggleCameraType,
      styles,
    ]
  );

  const isFocused = useIsFocused();
  /**
   * Boolean representing if we should include {@link RNCamera} in the render tree
   *
   * @remarks
   * Differs slightly depending on OS
   * iOS doesn't turn the camera off when out of focus so we need to check explicitly here
   * Android on the other hand does so we can just use our screenStatus. Unmounting and remounting on focus creates a slow modal animation on android.
   */
  const renderCamera = useMemo<boolean>(() => {
    if (Platform.OS === "ios") {
      return screenStatus === "scanning" && isFocused;
    }
    return screenStatus === "scanning";
  }, [isFocused, screenStatus]);

  return (
    <ScreenContainer safeAreaEdges={["bottom", "left", "right"]} statusBarStyle={"light-content"}>
      <View style={styles.content} onLayout={onContentViewLayoutEvent}>
        {renderCamera && (
          <RNCamera
            style={styles.camera}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            onBarCodeRead={onCameraScanQrCode}
            captureAudio={false}
            flashMode={isTorchOn ? "torch" : "off"}
            type={isFrontCamera ? "front" : "back"}
            zoom={isFrontCamera && Platform.OS === "ios" ? 0.02 : 0}
          />
        )}
        <View style={styles.contentOverlay}>
          {barcodeMask}
          {cameraSettings}
          {screenStatus === "goToSettings" && settingsModal}
        </View>
      </View>
      <ButtonBar>
        <Button title={t("scanning:cancel")} onPress={() => handleCancel()} accessibilityLabel={t("scanning:cancel")} />
      </ButtonBar>
    </ScreenContainer>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleHorizontal, scaleVertical } = scalingFunctions;
  return {
    ...StyleSheet.create({
      content: {
        position: "relative",
        backgroundColor: "black",
        flex: 1,
        width: "100%",
      },
      contentOverlay: {
        position: "absolute",
        height: "100%",
        width: "100%",
        flexDirection: "column-reverse",
      },
      goToSettingsAlertBox: {
        padding: themeTokens.spacing["modal-padding"].medium.value,
        alignItems: "center",
      },
      goToSettingsDescription: {
        paddingBottom: themeTokens.spacing["modal-padding"].medium.value,
        textAlign: "center",
      },
      goToSettingsActionText: {
        textDecorationLine: "underline",
        color: themeTokens.color.text.link.value,
      },
      camera: {
        flex: 1,
        justifyContent: "flex-end",
      },
      cameraSettingsContainer: {
        flexDirection: "row",
        paddingBottom: scaleVertical(themeTokens.spacing.vertical.xl.value),
      },
      torchIconContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
      },
      cameraIconContainer: {
        paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
      },
      soundIconContainer: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingLeft: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
      },
    }),
    barcodeMask: {
      backgroundColor: themeTokens.color.base.dark.value,
      outerMaskOpacity: themeTokens.opacity.background[75].value,
      edgeBorderWidth: 8,
      edgeWidth: 44,
      edgeHeight: 44,
      edgeColor: themeTokens.color.base.white.value,
    },
    cameraSettingsIcons: {
      color: themeTokens.color.button.primary.white.value,
      size: 38,
    },
  };
};
