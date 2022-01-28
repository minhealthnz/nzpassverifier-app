import React, { useMemo } from "react";
import { StyleSheet, View, Platform } from "react-native";
import {
  Button,
  ButtonBar,
  HorizontalRule,
  IconButton,
  IconName,
  ScreenContainer,
  Text,
  themeTokens,
  WindowScaleFunctions,
  useWindowScale,
} from "../../../common";
import { InvalidReason } from "../state";
import { useTranslation } from "react-i18next";
import { ResultHeader, ProgressBar, PullDownTab, AutoDisabledScrollView } from "../components";
import lottieInvalidImage from "../assets/invalid.json";
import { Edge } from "react-native-safe-area-context";

export type VerificationInvalidScreenProps = {
  readonly handlePressHome: () => void;
  readonly handlePressScanAgain: () => void;
  readonly failureReason: InvalidReason;
};

/**
 * Screen displaying a invalid verification result
 *
 * @param props - {@link VerificationInvalidScreenProps}
 */
export const VerificationInvalidScreen: React.FC<VerificationInvalidScreenProps> = (props) => {
  const { handlePressHome, handlePressScanAgain, failureReason } = props;
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  // Don't include top safeArea on iOS as sheet modal is not completely fullscreen
  const safeAreaEdges: readonly Edge[] | undefined = useMemo(
    () => (Platform.OS === "ios" ? ["left", "right", "bottom"] : undefined),
    []
  );

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
        <View style={styles.resultHeaderContainer}>
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
        paddingHorizontal: scaleHorizontal(spacing.horizontal.xl.value),
      },
      horizontalRule: {
        marginTop: scaleVertical(spacing.vertical.large.value),
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
