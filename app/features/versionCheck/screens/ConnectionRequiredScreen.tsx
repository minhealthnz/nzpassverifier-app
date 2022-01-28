import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import { ScreenContainer, themeTokens, Text, useWindowScale, WindowScaleFunctions } from "../../../common";
import { ConnectionRequiredLottie } from "../assets";

/**
 * Screen prompting the user to establish internet connection
 */
export const ConnectionRequiredScreen: React.FC = () => {
  const scalingFunctions = useWindowScale();

  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} alwaysBounceVertical={false}>
        <LottieView style={styles.image} autoPlay loop={true} source={ConnectionRequiredLottie} />
        <View style={styles.spacer} />
        <Text variant={"h2"}>{t("versionCheck:connectionRequired:title")}</Text>
        <Text variant={"body"} style={styles.bodyText}>
          {t("versionCheck:connectionRequired:description")}
        </Text>
      </ScrollView>
    </ScreenContainer>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleVertical, scaleHorizontal, scaleImage } = scalingFunctions;
  return StyleSheet.create({
    scrollView: {
      flex: 1,
    },
    scrollContainer: {
      justifyContent: "center",
      flexGrow: 1,
      alignItems: "center",
    },
    bodyText: {
      textAlign: "center",
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xxl.value),
    },
    spacer: {
      paddingBottom: scaleVertical(themeTokens.spacing.vertical.large.value),
    },
    image: {
      // Lottie will respect aspect ratio and scale height accordingly
      width: scaleImage(themeTokens.size.img["update-1"].width.value),
    },
  });
};
