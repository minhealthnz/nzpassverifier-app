import React, { useCallback, useMemo } from "react";
import { StyleSheet, View, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Button,
  ButtonBar,
  HorizontalRule,
  IconButton,
  ScreenContainer,
  themeTokens,
  IconName,
  Text,
  WindowScaleFunctions,
  useWindowScale,
  useAccessibilityFocus,
} from "../../../common";
import { ResultHeader, ProgressBar, PullDownTab, AutoDisabledScrollView } from "../components";
import lottieCannotValidateImage from "../assets/cannotValidate.json";
import { Edge } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";

export type VerificationCannotValidateScreenProps = {
  readonly handlePressHome: () => void;
  readonly handlePressScanAgain: () => void;
};

/**
 * Screen displaying a verification result stating that the app is unable to validate this QR code
 *
 * @param props - {@link VerificationCannotValidateScreenProps}
 */
export const VerificationCannotValidateScreen: React.FC<VerificationCannotValidateScreenProps> = (props) => {
  const { handlePressHome, handlePressScanAgain } = props;
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  const isAndroid = Platform.OS === "android";
  // Don't include top safeArea on iOS as sheet modal is not completely fullscreen
  const safeAreaEdges: readonly Edge[] | undefined = useMemo(() => (isAndroid ? undefined : ["bottom"]), [isAndroid]);
  const [focusRef, setFocus] = useAccessibilityFocus();

  const setFocusOnAndroid = useCallback(() => (isAndroid ? setFocus() : undefined), [isAndroid, setFocus]);
  useFocusEffect(setFocusOnAndroid);

  return (
    <ScreenContainer safeAreaEdges={safeAreaEdges} isSensitiveView statusBarStyle={"light-content"}>
      <View style={styles.container}>
        <View style={styles.pullDownBarContainer}>
          <PullDownTab color={styles.pullDownTab.color} />
        </View>
        <View style={styles.topSpacer} />
        <View accessible={isAndroid} ref={focusRef} style={styles.resultHeaderContainer}>
          <ResultHeader
            title={t("verification:cannotValidate:title")}
            lottieImage={lottieCannotValidateImage}
            titleColor={styles.headerText.color}
          />
        </View>
        <View style={styles.bottomSpacer} />
        <ProgressBar {...styles.progressBar} isPaused />
        <AutoDisabledScrollView contentContainerStyle={styles.scrollContentContainer}>
          <Text variant={"broadcast"} style={styles.description}>
            {t("verification:cannotValidate:description")}
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
        backgroundColor: color.alert.warning["050"].value,
      },
      bottomSpacer: {
        height: scaleVertical(spacing.vertical.xl.value + spacing.vertical.large.value),
        backgroundColor: color.alert.warning["050"].value,
      },
      pullDownBarContainer: {
        paddingTop: spacing.vertical.large.value,
        backgroundColor: color.alert.warning["050"].value,
      },
      headerText: {
        color: color.alert.warning.text.value,
      },
      resultHeaderContainer: {
        backgroundColor: color.alert.warning["050"].value,
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
      color: color.alert.warning[500].value,
    },
    progressBar: {
      filledColor: color.alert.warning[500].value,
    },
  };
};
