import React, { useMemo, useEffect, useCallback } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  Button,
  ButtonBar,
  HorizontalRule,
  IconButton,
  IconName,
  ScreenContainer,
  themeTokens,
  useWindowScale,
  WindowScaleFunctions,
  Text,
  useAccessibilityFocus,
} from "../../../common";
import { useTranslation } from "react-i18next";
import { ResultHeader, ProgressBar, PresentorDetails, PullDownTab, AutoDisabledScrollView } from "../components";
import lottieValidImage from "../assets/valid.json";
import { Edge } from "react-native-safe-area-context";
import { DateStrings } from "../state";
import { useFocusEffect } from "@react-navigation/native";

export type ResultDetails = {
  readonly givenName: string;
  readonly familyName?: string;
  readonly dob: DateStrings;
  readonly expiry: DateStrings;
};

export type VerificationSuccessScreenProps = {
  readonly handlePressHome: () => void;
  readonly handlePressScanAgain: () => void;
  readonly resultDetails: ResultDetails;
  readonly onHoldStart: () => void;
  readonly onHoldEnd: () => void;
  readonly onMount: () => void;
  readonly onUnmount: () => void;
  readonly initialAnimationDuration: number;
  readonly isTimerPaused: boolean;
};

/**
 * Screen displaying a successful verification result
 *
 * @param props - {@link VerificationSuccessScreenProps}
 */
export const VerificationSuccessScreen: React.FC<VerificationSuccessScreenProps> = (props) => {
  const {
    handlePressHome,
    handlePressScanAgain,
    resultDetails,
    initialAnimationDuration,
    isTimerPaused,
    onHoldStart,
    onHoldEnd,
    onMount,
    onUnmount,
  } = props;
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  const isAndroid = Platform.OS === "android";

  // Don't include top safeArea on iOS as sheet modal is not completely fullscreen
  const safeAreaEdges: readonly Edge[] | undefined = useMemo(() => (isAndroid ? undefined : ["bottom"]), [isAndroid]);

  const [focusRef, setFocus] = useAccessibilityFocus();

  const setFocusOnAndroid = useCallback(() => (isAndroid ? setFocus() : undefined), [isAndroid, setFocus]);
  useFocusEffect(setFocusOnAndroid);

  useEffect(() => {
    onMount();
    return onUnmount;
  }, [onMount, onUnmount]);

  return (
    <ScreenContainer safeAreaEdges={safeAreaEdges} isSensitiveView statusBarStyle={"light-content"}>
      <View style={styles.container}>
        <View style={styles.container} onTouchStart={onHoldStart} onTouchEnd={onHoldEnd} onTouchCancel={onHoldEnd}>
          <View style={styles.pullDownBarContainer}>
            <PullDownTab color={styles.pullDownTab.color} />
          </View>
          <View style={styles.topSpacer} />
          <View accessible={isAndroid} ref={focusRef} style={styles.resultHeaderContainer}>
            <ResultHeader
              title={t("verification:valid:title")}
              lottieImage={lottieValidImage}
              titleColor={styles.headerText.color}
            />
          </View>
          <View style={styles.bottomSpacer} />
          <View style={styles.holdToPause}>
            <Text variant={"body"}>{t("verification:valid:holdToPause")}</Text>
          </View>
          <ProgressBar
            {...styles.progressBar}
            isPaused={isTimerPaused}
            initialAnimationDuration={initialAnimationDuration}
          />
          <View style={styles.resultDetails}>
            <AutoDisabledScrollView contentContainerStyle={styles.scrollContentContainer}>
              <PresentorDetails {...resultDetails} />
            </AutoDisabledScrollView>
          </View>
        </View>
        <HorizontalRule />
        <ButtonBar direction={"row"}>
          <IconButton
            iconName={IconName.homeSecondary}
            onPress={handlePressHome}
            accessibilityLabel={t("verification:home")}
          />
          <Button
            onPress={handlePressScanAgain}
            title={t("verification:buttonScanAgain")}
            accessibilityLabel={t("verification:buttonScanAgain")}
          />
        </ButtonBar>
      </View>
    </ScreenContainer>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { spacing, color } = themeTokens;
  const { scaleVertical, scaleHorizontal } = scalingFunctions;
  return {
    ...StyleSheet.create({
      container: {
        flex: 1,
        width: "100%",
      },
      scrollContentContainer: {
        flexGrow: 1,
      },
      topSpacer: {
        height: scaleVertical(spacing.vertical.xxl.value + spacing.vertical.large.value),
        backgroundColor: themeTokens.color.alert.valid["050"].value,
      },
      bottomSpacer: {
        height: scaleVertical(spacing.vertical.xl.value + spacing.vertical.large.value),
        backgroundColor: themeTokens.color.alert.valid["050"].value,
      },
      pullDownBarContainer: {
        paddingTop: spacing.vertical.large.value,
        backgroundColor: themeTokens.color.alert.valid["050"].value,
      },
      headerText: {
        color: color.alert.valid.text.value,
      },
      resultHeaderContainer: {
        backgroundColor: themeTokens.color.alert.valid["050"].value,
        paddingHorizontal: scaleHorizontal(spacing.horizontal.xl.value),
      },
      holdToPause: {
        paddingBottom: scaleVertical(spacing.vertical.large.value),
        paddingHorizontal: scaleHorizontal(spacing.vertical.xl.value),
        backgroundColor: themeTokens.color.alert.valid["050"].value,
      },
      resultDetails: {
        flex: 1,
      },
    }),
    pullDownTab: {
      color: color.alert.valid[500].value,
    },
    progressBar: {
      filledColor: color.alert.valid[500].value,
      unfilledColor: color.alert.valid[200].value,
    },
  };
};
