import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { useWindowScale, themeTokens, WindowScaleFunctions, Text } from "../../../common";
import { PurposeLottie } from "../assets";

/**
 * Component providing information that informs the user how to use this app
 */
export const PurposePage: React.FC = () => {
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  return (
    <View style={styles.flexContainer}>
      <View style={styles.noFlexContainer}>
        <ScrollView
          alwaysBounceVertical={false}
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
        >
          <Text variant={"h1"} style={styles.title}>
            {t("onboarding:purpose:title")}
          </Text>
          <View style={styles.imageContainer}>
            <LottieView style={styles.purposeImage} autoPlay loop={true} source={PurposeLottie} />
          </View>
          <Text variant={"body"} style={styles.body}>
            {t("onboarding:purpose:body")}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleImage, scaleHorizontal, scaleVertical } = scalingFunctions;
  return StyleSheet.create({
    flexContainer: {
      flex: 1,
      justifyContent: "center",
      marginVertical: scaleVertical(themeTokens.spacing.vertical.xl.value),
    },
    noFlexContainer: {
      flex: 0,
    },
    scrollContainer: {
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xxl.value),
    },
    scrollContent: {
      alignItems: "center",
    },
    title: {
      textAlign: "center",
    },
    body: {
      textAlign: "center",
    },
    imageContainer: {
      paddingBottom: scaleVertical(themeTokens.spacing.vertical.xl.value),
    },
    purposeImage: {
      // Lottie will respect aspect ratio and scale height accordingly
      width: scaleImage(themeTokens.size.img["purpose-1"].width.value),
    },
  });
};
