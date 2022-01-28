import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import {
  Button,
  ScreenContainer,
  ButtonBar,
  themeTokens,
  Text,
  useWindowScale,
  HorizontalRule,
  WindowScaleFunctions,
} from "../../../common";

import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { MobileWithUpdateLottie } from "../assets";

export type VersionUpdateScreenProps = {
  readonly isUpdateAvailable: boolean;
  readonly handlePressUpdate: () => void;
};

/**
 * Screen prompting the user to update the application
 *
 * @remarks
 * We should only show this screen when the user is not using the latest version
 *
 * @param props - {@link VersionUpdateScreenProps}
 */
export const VersionUpdateScreen: React.FC<VersionUpdateScreenProps> = (props) => {
  const { isUpdateAvailable, handlePressUpdate } = props;
  const scalingFunctions = useWindowScale();

  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);
  const { t } = useTranslation();

  return (
    <ScreenContainer>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContainer} alwaysBounceVertical={false}>
        <View style={styles.content}>
          <LottieView style={styles.image} autoPlay loop={true} source={MobileWithUpdateLottie} />
          <View style={styles.spacer} />
          <Text variant={"h2"}>{t("versionCheck:updateRequired:title")}</Text>
          <Text variant={"body"} style={styles.bodyText}>
            {t("versionCheck:updateRequired:description")}
          </Text>
        </View>
      </ScrollView>
      {isUpdateAvailable && (
        <>
          <HorizontalRule style={styles.horizontalRule} />
          <ButtonBar>
            <Button
              title={t("versionCheck:buttonUpdateNow")}
              accessibilityLabel={t("versionCheck:buttonUpdateNow")}
              onPress={handlePressUpdate}
            />
          </ButtonBar>
        </>
      )}
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
    },
    content: {
      alignItems: "center",
    },
    bodyText: {
      textAlign: "center",
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xxl.value),
    },
    spacer: {
      paddingBottom: scaleHorizontal(themeTokens.spacing.vertical.xl.value),
    },
    image: {
      // Lottie will respect aspect ratio and scale height accordingly
      width: scaleImage(themeTokens.size.img["update-1"].width.value),
    },
    horizontalRule: {
      marginTop: scaleVertical(themeTokens.spacing.vertical.large.value),
    },
  });
};
