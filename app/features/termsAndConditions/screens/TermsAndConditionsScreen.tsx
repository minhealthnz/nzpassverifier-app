import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import LottieView from "lottie-react-native";
import {
  Modal,
  Button,
  ScreenContainer,
  ButtonBar,
  themeTokens,
  Text,
  useWindowScale,
  WindowScaleFunctions,
} from "../../../common";

import { ContractWithPenLottie } from "../assets";
import { ScrollView } from "react-native-gesture-handler";
import { Trans, useTranslation } from "react-i18next";
import WebView from "react-native-webview";
import { getWebViewAsset } from "../utilities";

const termsOfUseHtmlSource = getWebViewAsset("TermsOfUse.html");

export type TermsAndConditionsScreenProps = {
  readonly isSubmitDisabled: boolean;
  readonly handleAcceptTermsAndConditions: () => void;
};

/**
 * Screen allowing the user to review the terms and conditions of the app
 *
 * @remarks We should only show this screen when the user hasn't already accepted them
 *
 * @param props - {@link TermsAndConditionsScreenProps}
 */
export const TermsAndConditionsScreen: React.FC<TermsAndConditionsScreenProps> = (props) => {
  const { isSubmitDisabled, handleAcceptTermsAndConditions } = props;

  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  /**
   * Local state to keep track of modal visibility
   * Can supply from the store if required to configure externally
   */
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleShowModal = () => setIsModalVisible(true);

  /**
   * Creates a list of bullet points based on an array of translations
   */
  const bulletPoints = useMemo(() => {
    const bulletPointTranslations = Array.from<string>(
      t("termsAndConditions:bodyBulletPoints", { returnObjects: true })
    );
    const bulletPointRows = bulletPointTranslations.map((translatedBulletPoint, index) => (
      <View style={[styles.bodyText, styles.bulletPointRow]} key={`bulletPoint-${index}`}>
        <Text>{"\u2022"}</Text>
        <Text style={styles.bulletPointText}>{`${translatedBulletPoint}`}</Text>
      </View>
    ));
    return bulletPointRows && <View style={styles.bulletPointWrapper}>{bulletPointRows}</View>;
  }, [styles, t]);

  // TODO(DEBT-001) make terms of use modal a navigable modal route
  return (
    <>
      <Modal
        title={t("termsAndConditions:modal:title")}
        visible={isModalVisible}
        onPressClose={() => setIsModalVisible(false)}
      >
        <WebView
          style={styles.webViewWrapper}
          source={termsOfUseHtmlSource}
          originWhitelist={["file://"]}
          startInLoadingState
        />
      </Modal>
      <ScreenContainer>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          alwaysBounceVertical={false}
        >
          <View style={styles.content}>
            <LottieView style={styles.image} autoPlay loop={false} source={ContractWithPenLottie} />
            <Text variant={"h2"}>{t("termsAndConditions:title")}</Text>
            <Text style={styles.bodyText}>
              {/* TODO(DEBT-006): link to terms and conditions not recognised by screen reader as a link */}
              <Trans
                i18nKey="termsAndConditions:body"
                components={{
                  modalLink: <Text style={styles.linkText} accessibilityRole={"link"} onPress={handleShowModal} />,
                }}
              />
            </Text>
            {bulletPoints}
          </View>
        </ScrollView>
        <ButtonBar>
          <Button
            title={t("termsAndConditions:buttonConfirm")}
            onPress={handleAcceptTermsAndConditions}
            disabled={isSubmitDisabled}
            accessibilityLabel={t("termsAndConditions:buttonConfirm")}
          />
        </ButtonBar>
      </ScreenContainer>
    </>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleVertical, scaleHorizontal, scaleImage } = scalingFunctions;
  return StyleSheet.create({
    webViewWrapper: {
      marginHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.large.value),
    },
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
      textAlign: "left",
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xxl.value),
    },
    linkText: {
      textDecorationLine: "underline",
      color: themeTokens.color.text.link.value,
    },
    imageWrapper: {
      aspectRatio: 1,
      width: "50%",
    },
    bulletPointWrapper: {
      paddingTop: scaleVertical(themeTokens.spacing.vertical.xl.value),
    },
    bulletPointRow: {
      maxWidth: "100%",
      flexDirection: "row",
      paddingTop: scaleVertical(themeTokens.spacing.horizontal.small.value),
    },
    bulletPointText: {
      paddingLeft: scaleHorizontal(themeTokens.spacing.horizontal.large.value),
    },
    image: {
      // Lottie will respect aspect ratio and scale height accordingly
      width: scaleImage(themeTokens.size.img["terms-1"].width.value),
    },
  });
};
