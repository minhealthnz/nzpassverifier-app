import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ScrollView } from "react-native";
import LottieView from "lottie-react-native";
import { useWindowScale, WindowScaleFunctions, Text, themeTokens, HorizontalRule } from "../../../common";
import { Instructions1Lottie, Instructions2Lottie } from "../assets";

/**
 * Component providing information that informs the user how to use this app
 */
export const InstructionPage: React.FC = () => {
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();

  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  return (
    <View style={styles.flexContainer}>
      <View>
        <ScrollView alwaysBounceVertical={false} contentContainerStyle={styles.scrollContentContainer}>
          <LottieView style={styles.image} autoPlay loop={true} source={Instructions1Lottie} />
          <Text variant={"h2"} style={styles.title}>
            {t("onboarding:instruction1:title")}
          </Text>
          <Text variant={"body"} style={styles.body}>
            {t("onboarding:instruction1:body")}
          </Text>
          <HorizontalRule style={styles.horizontalRule} />
          <LottieView style={styles.image} autoPlay loop={true} source={Instructions2Lottie} />
          <Text variant={"h2"} style={styles.title}>
            {t("onboarding:instruction2:title")}
          </Text>
          <Text variant={"body"} style={styles.body}>
            {t("onboarding:instruction2:body")}
          </Text>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleVertical, scaleHorizontal, scaleImage } = scalingFunctions;
  const { spacing, size } = themeTokens;
  return StyleSheet.create({
    flexContainer: {
      flex: 1,
      justifyContent: "center",
      marginVertical: scaleVertical(spacing.vertical.xl.value),
    },
    scrollContentContainer: {
      alignItems: "center",
      paddingHorizontal: scaleHorizontal(spacing.horizontal.xxl.value),
    },
    title: {
      textAlign: "center",
    },
    body: {
      textAlign: "center",
    },
    horizontalRule: {
      marginVertical: scaleVertical(spacing.vertical.xl.value),
      height: 1,
    },
    image: {
      // Lottie will respect aspect ratio and scale height accordingly
      width: scaleImage(size.img["instructions-1"].width.value),
    },
  });
};
