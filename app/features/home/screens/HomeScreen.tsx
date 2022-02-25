import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import {
  Button,
  ButtonBar,
  HorizontalRule,
  IconName,
  ScreenContainer,
  themeTokens,
  useWindowScale,
  WindowScaleFunctions,
} from "../../../common";
import { ExternalLink, ScanButton } from "../components";
import { ScrollView } from "react-native-gesture-handler";
import { OfflineRecordsStatus } from "../components/OfflineRecordsStatus";
import { Edge } from "react-native-safe-area-context";
import { CacheStatusDetails } from "../utilities";

export type HomeScreenProps = {
  readonly handlePressScan: () => void;
  readonly handlePressHelp: () => void;
  readonly handlePressPrivacyPolicy: () => void;
  readonly cacheStatusDetails: CacheStatusDetails;
};

/**
 * The landing screen of the app
 *
 * @param props - {@link HomeScreenProps}
 */
export const HomeScreen: React.FC<HomeScreenProps> = (props) => {
  const { handlePressScan, handlePressHelp, handlePressPrivacyPolicy, cacheStatusDetails } = props;
  const { t } = useTranslation();
  const scaleFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scaleFunctions), [scaleFunctions]);
  const safeAreaEdges: readonly Edge[] | undefined = Platform.OS === "ios" ? ["top", "bottom"] : undefined;

  return (
    <ScreenContainer safeAreaEdges={safeAreaEdges}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContainer}
          alwaysBounceVertical={false}
        >
          <View style={styles.privacyLinkWrapper}>
            <ExternalLink onPress={handlePressPrivacyPolicy}>{t("home:privacyPolicyLink")}</ExternalLink>
          </View>
          <View style={styles.scanButtonWrapper}>
            <ScanButton onPress={handlePressScan} title={t("home:scan")} accessibilityLabel={t("home:scan")} />
          </View>
          <View style={styles.offlineRecordsContainer}>
            <OfflineRecordsStatus cacheStatusDetails={cacheStatusDetails} />
          </View>
        </ScrollView>
        <HorizontalRule style={styles.horizontalRule} />
        <ButtonBar>
          <Button
            variant={"secondary"}
            onPress={handlePressHelp}
            title={t("home:info")}
            iconName={IconName.external}
            accessibilityLabel={t("home:info")}
          />
        </ButtonBar>
      </View>
    </ScreenContainer>
  );
};
const createStyles = ({ scaleVertical, scaleHorizontal }: WindowScaleFunctions) =>
  StyleSheet.create({
    container: {
      flex: 1,
      width: "100%",
    },
    scrollView: {
      flex: 1,
      width: "100%",
    },
    scrollContainer: {
      flexGrow: 1,
      alignItems: "center",
      justifyContent: "space-between",
    },
    scanButtonWrapper: {
      flex: 1,
      paddingTop: scaleVertical(themeTokens.spacing.vertical.xxxl.value),
      justifyContent: "center",
      paddingBottom: scaleVertical(themeTokens.spacing.vertical.large.value),
    },
    privacyLinkWrapper: {
      alignItems: "flex-end",
      width: "100%",
      paddingTop: scaleHorizontal(themeTokens.spacing.vertical.xl.value),
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
    },
    offlineRecordsContainer: {
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
    },
    horizontalRule: {
      marginTop: scaleVertical(themeTokens.spacing.vertical.large.value),
    },
  });
