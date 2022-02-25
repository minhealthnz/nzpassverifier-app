import React, { useCallback, useMemo } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  Button,
  ButtonBar,
  HorizontalRule,
  IconButton,
  IconName,
  ScreenContainer,
  Text,
  TextProps,
  themeTokens,
  WindowScaleFunctions,
  useWindowScale,
  useAccessibilityFocus,
} from "../../../common";
import { DateStrings, InvalidReason } from "../state";
import { useTranslation } from "react-i18next";
import {
  ResultHeader,
  ProgressBar,
  PullDownTab,
  AutoDisabledScrollView,
  DateWithSlashes,
  ForwardSlashProps,
} from "../components";
import lottieInvalidImage from "../assets/invalid.json";
import { Edge } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export type VerificationInvalidScreenProps = {
  readonly handlePressHome: () => void;
  readonly handlePressScanAgain: () => void;
  readonly failureReason: InvalidReason;
  readonly expiryDate?: DateStrings;
  readonly expiredDuration?: number;
};

/**
 * Screen displaying a invalid verification result
 *
 * @param props - {@link VerificationInvalidScreenProps}
 */
export const VerificationInvalidScreen: React.FC<VerificationInvalidScreenProps> = (props) => {
  const { handlePressHome, handlePressScanAgain, failureReason, expiryDate, expiredDuration } = props;
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  const isAndroid = Platform.OS === "android";
  // Don't include top safeArea on iOS as sheet modal is not completely fullscreen
  const safeAreaEdges: readonly Edge[] | undefined = useMemo(() => (isAndroid ? undefined : ["bottom"]), [isAndroid]);
  const [focusRef, setFocus] = useAccessibilityFocus();

  const setFocusOnAndroid = useCallback(() => (isAndroid ? setFocus() : undefined), [isAndroid, setFocus]);
  useFocusEffect(setFocusOnAndroid);

  const renderDaysSinceExpiry = (expiredDays: number) => {
    const roundedDays = Math.floor(expiredDays).toLocaleString();

    const textToShow =
      expiredDays > 1
        ? `${roundedDays} ${t("verification:presentorDetail:daysAgo")}`
        : t("verification:presentorDetail:expiredToday");

    return (
      <Text variant={"detail"} accessibilityLabel={t("verification:accessibility:expiredDays")}>
        {textToShow}
      </Text>
    );
  };

  const failureReasonText = useMemo(() => {
    switch (failureReason) {
      case InvalidReason.CredentialExpired:
        return "verification:invalid:credExpired";
      case InvalidReason.CredentialNotActive:
        return "verification:invalid:credNotActive";
      case InvalidReason.IssuerNotTrusted:
      case InvalidReason.IssuerPublicKeyInvalid:
        return "verification:invalid:issuerNotTrusted";
      case InvalidReason.SignatureInvalid:
        return "verification:invalid:signatureInvalid";
    }
  }, [failureReason]);

  return (
    <ScreenContainer safeAreaEdges={safeAreaEdges} isSensitiveView statusBarStyle={"light-content"}>
      <View style={styles.container}>
        <View style={styles.pullDownBarContainer}>
          <PullDownTab color={styles.pullDownTab.color} />
        </View>
        <View style={styles.topSpacer} />
        <View accessible={isAndroid} ref={focusRef} style={styles.resultHeaderContainer}>
          <ResultHeader
            title={t("verification:invalid:title")}
            lottieImage={lottieInvalidImage}
            titleColor={styles.headerText.color}
          />
        </View>
        <View style={styles.bottomSpacer} />
        <ProgressBar {...styles.progressBar} isPaused />
        <AutoDisabledScrollView contentContainerStyle={styles.scrollContentContainer}>
          <Text variant={"broadcast"} style={styles.description}>
            {t(failureReasonText)}
          </Text>
          {expiryDate && (
            <View>
              <HorizontalRule style={styles.insideHorizontalRule} />
              <View style={styles.itemSpacer} />
              <Text variant={"label"}>{t("verification:presentorDetail:certificateExpiryDate")}</Text>
              <DateWithSlashes dateStrings={expiryDate} textProps={expiryTextProps} slashProps={expirySlashProps} />
              {expiredDuration && renderDaysSinceExpiry(expiredDuration)}
              <View style={styles.itemSpacer} />
            </View>
          )}
        </AutoDisabledScrollView>
        <HorizontalRule style={styles.horizontalRule} />
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

const expiryTextProps: TextProps = {
  variant: "h1",
  style: {
    paddingTop: themeTokens.spacing.vertical.small.value,
    paddingBottom: themeTokens.spacing.vertical.small.value,
  },
};

const expirySlashProps: ForwardSlashProps = {
  width: 9,
  height: 26,
  paddingHorizontal: themeTokens.spacing.vertical.small.value + themeTokens.spacing.vertical.tiny.value,
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
        paddingHorizontal: scaleHorizontal(spacing.horizontal.xl.value),
      },
      topSpacer: {
        height: scaleVertical(spacing.vertical.xxl.value + spacing.vertical.large.value),
        backgroundColor: color.alert.invalid["050"].value,
      },
      bottomSpacer: {
        height: scaleVertical(spacing.vertical.xl.value + spacing.vertical.large.value),
        backgroundColor: color.alert.invalid["050"].value,
      },
      pullDownBarContainer: {
        paddingTop: spacing.vertical.large.value,
        backgroundColor: color.alert.invalid["050"].value,
      },
      headerText: {
        color: color.alert.invalid.text.value,
      },
      resultHeaderContainer: {
        backgroundColor: color.alert.invalid["050"].value,
        paddingHorizontal: scaleHorizontal(spacing.horizontal.xl.value),
      },
      description: {
        paddingVertical: scaleVertical(spacing.vertical.xl.value),
        paddingBottom: scaleVertical(spacing.vertical.large.value),
      },
      horizontalRule: {
        marginTop: scaleVertical(spacing.vertical.large.value),
      },
      insideHorizontalRule: {
        height: 1,
      },
      itemSpacer: {
        height: themeTokens.spacing.vertical.large.value,
      },
    }),
    pullDownTab: {
      color: color.alert.invalid[500].value,
    },
    progressBar: {
      filledColor: color.alert.invalid[500].value,
    },
  };
};
