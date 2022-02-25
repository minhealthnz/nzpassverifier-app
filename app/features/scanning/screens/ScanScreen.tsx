import React, { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { StyleSheet, View, LayoutChangeEvent, Platform, Alert, Dimensions } from "react-native";
import {
  Button,
  ButtonBar,
  IconButton,
  IconName,
  ScreenContainer,
  themeTokens,
  Text,
  useAppState,
  createConditionalStyle,
  useOrientation,
  Orientation,
} from "../../../common";
import { RNCamera, BarCodeReadEvent } from "react-native-camera";
import BarcodeMask from "react-native-barcode-mask";
import { PartialModal } from "../components/PartialModal";
import { getBarcodeFinderSize } from "../utilities";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import { Edge } from "react-native-safe-area-context";

const MIN_INTERVAL_BETWEEN_SCANS = 2500;

// Camera icon metrics
const SMALL_CAMERA_ICON_SIZE = 38;
const BIG_CAMERA_ICON_SIZE = 56;
const SPACE_BETWEEN_ICON_ROWS = themeTokens.spacing.vertical.xl.value;
const SPACE_BETWEEN_ICONS = 2 * themeTokens.spacing.vertical.xl.value;
const ICONS_TOTAL_SHORT_LENGTH = SMALL_CAMERA_ICON_SIZE + BIG_CAMERA_ICON_SIZE + SPACE_BETWEEN_ICON_ROWS;

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
  readonly isVibrationOn: boolean;
  readonly handleToggleVibration: () => void;
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
    isVibrationOn,
    handleToggleCameraType,
    handleToggleAudio,
    handleToggleVibration,
    handleDontShowFrontCameraAlert,
    showFrontCameraAlert,
  } = props;
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [cameraMaskFinderSize, setCameraMaskFinderSize] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState<number | undefined>(undefined);
  const previousScannedRef = useRef<number>();
  const { t } = useTranslation();
  const isLandscape = useOrientation() === Orientation.Landscape;

  /**
   * Metrics for vertical spacers in Portrait
   */
  const spacerHeight = useMemo(() => {
    if (!containerHeight || !cameraMaskFinderSize) {
      return 0;
    }
    const remainingVerticalSpace = containerHeight - cameraMaskFinderSize - ICONS_TOTAL_SHORT_LENGTH;
    return remainingVerticalSpace / 3;
  }, [containerHeight, cameraMaskFinderSize]);

  /**
   * Metrics for camera icon positions in Landscape
   */
  const iconGroupRightMarginToScreen = useMemo(() => {
    if (!containerWidth || !cameraMaskFinderSize) {
      return 0;
    }
    const remainingHorizontalSpace = (containerWidth - cameraMaskFinderSize) / 2;
    return (remainingHorizontalSpace - ICONS_TOTAL_SHORT_LENGTH) / 2;
  }, [containerWidth, cameraMaskFinderSize]);

  const iconSubGroupRightMarginToScreen = useMemo(() => {
    if (!containerHeight || !iconGroupRightMarginToScreen) {
      return 0;
    }
    return iconGroupRightMarginToScreen + BIG_CAMERA_ICON_SIZE + SPACE_BETWEEN_ICON_ROWS;
  }, [containerHeight, iconGroupRightMarginToScreen]);

  const sideIconAbsolutePositionFromScreen = useMemo(() => {
    if (!containerHeight) {
      return 0;
    }
    const screenEdgeToCenter = containerHeight / 2;
    const iconEdgeToCenter = SMALL_CAMERA_ICON_SIZE / 2;
    const iconRowLength = SMALL_CAMERA_ICON_SIZE + SPACE_BETWEEN_ICONS;
    return screenEdgeToCenter - iconEdgeToCenter - iconRowLength;
  }, [containerHeight]);

  const styles = useMemo(
    () =>
      createStyles({
        spacerHeight,
        iconGroupRightMarginToScreen,
        iconSubGroupRightMarginToScreen,
        sideIconAbsolutePositionFromScreen,
      }),
    [spacerHeight, iconSubGroupRightMarginToScreen, iconGroupRightMarginToScreen, sideIconAbsolutePositionFromScreen]
  );

  useEffect(() => {
    handleOnMount();
  }, [handleOnMount]);

  const handleToggleTorch = useCallback(() => {
    setIsTorchOn(!isTorchOn);
  }, [isTorchOn]);

  const onContainerViewLayoutEvent = useCallback(
    (event: LayoutChangeEvent) => {
      const { layout } = event.nativeEvent;
      setContainerHeight(layout.height);
      setContainerWidth(layout.width);

      const totalScreenHeight = Dimensions.get("screen").height;
      const maxBarcodeSize = isLandscape ? totalScreenHeight * 0.7 : totalScreenHeight * 0.6;

      const barcodeSize = getBarcodeFinderSize(layout, themeTokens.spacing.vertical.xl.value);
      setCameraMaskFinderSize(Math.min(barcodeSize, maxBarcodeSize));
    },
    [setContainerHeight, setContainerWidth, setCameraMaskFinderSize, isLandscape]
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

  const cameraSettings = useMemo(() => {
    const cameraSettingsContainerStyle = createConditionalStyle(styles, {
      cameraSettingsContainerLandscape: isLandscape,
      cameraSettingsContainerPortrait: !isLandscape,
    });

    const cameraSettingsSubContainerStyle = createConditionalStyle(styles, {
      cameraSettingsSubContainerLandscape: isLandscape,
      cameraSettingsSubContainerPortrait: !isLandscape,
    });

    const torchContainerStyle = createConditionalStyle(styles, {
      torchIconContainerLandscape: isLandscape,
      torchIconContainerPortrait: !isLandscape,
    });

    const soundContainerStyle = createConditionalStyle(styles, {
      soundIconContainerLandscape: isLandscape,
      soundIconContainerPortrait: !isLandscape,
    });

    const hapticContainerStyle = createConditionalStyle(styles, {
      hapticIconContainerLandscape: isLandscape,
      hapticIconContainerPortrait: !isLandscape,
    });

    const cameraContainerStyle = createConditionalStyle(styles, {
      cameraIconContainerLandscape: isLandscape,
      cameraIconContainerPortrait: !isLandscape,
    });

    return (
      <View style={cameraSettingsContainerStyle}>
        <View style={cameraSettingsSubContainerStyle}>
          <View style={torchContainerStyle}>
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
          <View style={soundContainerStyle}>
            <IconButton
              {...styles.cameraSettingsIcons}
              iconName={isAudioOn ? IconName.audioOnSecondary : IconName.audioOffPrimary}
              onPress={handleToggleAudio}
              accessibilityLabel={t(isAudioOn ? "scanning:turnAudioOff" : "scanning:turnAudioOn")}
            />
          </View>
          <View style={hapticContainerStyle}>
            <IconButton
              {...styles.cameraSettingsIcons}
              iconName={isVibrationOn ? IconName.hapticsOnPrimary : IconName.hapticsOffSecondary}
              onPress={handleToggleVibration}
              accessibilityLabel={t(isVibrationOn ? "scanning:turnVibrationOff" : "scanning:turnVibrationOn")}
            />
          </View>
        </View>
        <View style={cameraContainerStyle}>
          <IconButton
            {...styles.cameraSettingsIconLarge}
            iconName={isFrontCamera ? IconName.cameraFlipPrimary : IconName.cameraFlipSecondary}
            onPress={handleToggleCameraType}
            accessibilityLabel={t(isFrontCamera ? "scanning:useBackCamera" : "scanning:useFrontCamera")}
          />
        </View>
      </View>
    );
  }, [
    handleToggleAudio,
    isAudioOn,
    handleToggleTorch,
    isTorchOn,
    handleToggleVibration,
    isVibrationOn,
    screenStatus,
    t,
    isFrontCamera,
    handleToggleCameraType,
    styles,
    isLandscape,
  ]);

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

  const safeAreaEdges: readonly Edge[] | undefined = Platform.OS === "ios" ? ["bottom"] : undefined;

  const contentOverlayStyle = createConditionalStyle(styles, {
    contentOverlayLandscape: isLandscape,
    contentOverlayPortrait: !isLandscape,
  });

  const barcodeMaskWrapperStyle = createConditionalStyle(styles, {
    barcodeMaskWrapperLandscape: isLandscape,
    barcodeMaskWrapperPortrait: !isLandscape,
  });

  return (
    <ScreenContainer safeAreaEdges={safeAreaEdges} statusBarStyle={"light-content"}>
      <View style={styles.content}>
        {renderCamera && (
          <RNCamera
            style={styles.camera}
            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
            onBarCodeRead={onCameraScanQrCode}
            captureAudio={false}
            flashMode={isTorchOn ? "torch" : "off"}
            type={isFrontCamera ? "front" : "back"}
            zoom={isFrontCamera ? Platform.select({ ios: 0.02, android: 0.5 }) : undefined}
          />
        )}
        <View style={contentOverlayStyle} onLayout={onContainerViewLayoutEvent}>
          <View style={barcodeMaskWrapperStyle}>{barcodeMask}</View>
          <View style={styles.greyBackground}>{cameraSettings}</View>
          <View style={styles.spacer} />
          {screenStatus === "goToSettings" && settingsModal}
        </View>
      </View>
      <ButtonBar>
        <Button title={t("scanning:cancel")} onPress={() => handleCancel()} accessibilityLabel={t("scanning:cancel")} />
      </ButtonBar>
    </ScreenContainer>
  );
};

const setOpacityToHex = (hex: string, alpha: number) =>
  `${hex}${Math.floor(alpha * 255)
    .toString(16)
    .padStart(2)}`;

type CreateStylesProps = {
  readonly spacerHeight: number;
  readonly iconGroupRightMarginToScreen: number;
  readonly iconSubGroupRightMarginToScreen: number;
  readonly sideIconAbsolutePositionFromScreen: number;
};

const createStyles = (props: CreateStylesProps) => {
  const {
    spacerHeight,
    iconGroupRightMarginToScreen,
    iconSubGroupRightMarginToScreen,
    sideIconAbsolutePositionFromScreen,
  } = props;
  return {
    ...StyleSheet.create({
      content: {
        position: "relative",
        backgroundColor: "black",
        flex: 1,
        width: "100%",
      },
      contentOverlayPortrait: {
        position: "absolute",
        height: "100%",
        width: "100%",
        flexDirection: "column",
      },
      contentOverlayLandscape: {
        position: "absolute",
        flexDirection: "row",
        height: "100%",
        width: "100%",
      },
      spacer: {
        height: spacerHeight,
        backgroundColor: setOpacityToHex(themeTokens.color.base.dark.value, themeTokens.opacity.background[75].value),
      },
      barcodeMaskWrapperPortrait: {
        flex: 1,
        width: "100%",
      },
      barcodeMaskWrapperLandscape: {
        height: "100%",
        width: "100%",
      },
      greyBackground: {
        backgroundColor: setOpacityToHex(themeTokens.color.base.dark.value, themeTokens.opacity.background[75].value),
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
      cameraSettingsContainerPortrait: {
        flexDirection: "column",
      },
      cameraSettingsContainerLandscape: {
        flexDirection: "column",
        justifyContent: "center",
        alignSelf: "center",
      },
      cameraSettingsSubContainerPortrait: {
        flexDirection: "row",
        paddingBottom: SPACE_BETWEEN_ICON_ROWS,
      },
      cameraSettingsSubContainerLandscape: {
        flexDirection: "column",
        justifyContent: "center",
      },
      torchIconContainerPortrait: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
      },
      soundIconContainerPortrait: {
        paddingHorizontal: SPACE_BETWEEN_ICONS,
      },
      hapticIconContainerPortrait: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-start",
      },
      cameraIconContainerPortrait: {
        alignSelf: "center",
      },
      torchIconContainerLandscape: {
        position: "absolute",
        right: iconSubGroupRightMarginToScreen,
        bottom: sideIconAbsolutePositionFromScreen,
      },
      soundIconContainerLandscape: {
        position: "absolute",
        right: iconSubGroupRightMarginToScreen,
      },
      hapticIconContainerLandscape: {
        position: "absolute",
        right: iconSubGroupRightMarginToScreen,
        top: sideIconAbsolutePositionFromScreen,
      },
      cameraIconContainerLandscape: {
        position: "absolute",
        right: iconGroupRightMarginToScreen,
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
      size: SMALL_CAMERA_ICON_SIZE,
    },
    cameraSettingsIconLarge: {
      color: themeTokens.color.button.primary.white.value,
      size: BIG_CAMERA_ICON_SIZE,
    },
  };
};
