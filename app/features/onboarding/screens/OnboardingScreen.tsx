import React, { useState, useCallback, useRef, useMemo } from "react";
import { ButtonBar, Button, ScreenContainer, themeTokens } from "../../../common";
import { Dots } from "../components";
import { View, StyleSheet } from "react-native";
import PagerView, { PagerViewOnPageSelectedEvent } from "react-native-pager-view";
import { InstructionPage, PurposePage } from "../components";
import { useTranslation } from "react-i18next";

export type OnboardingScreenProps = {
  readonly handleComplete: () => void;
};

/**
 * Screen displaying onboarding information
 *
 * @remarks We should only show this screen when the user hasn't already viewed it
 *
 * @param props - {@link OnboardingScreenProps}
 */
export const OnboardingScreen: React.FC<OnboardingScreenProps> = (props) => {
  const { handleComplete } = props;
  const [activePage, setActivePage] = useState(0);
  const refPagerView = useRef<PagerView>(null);
  const { t } = useTranslation();

  const { pages, numPages, lastPageIndex } = useMemo(() => {
    const wrappedPages = [<PurposePage />, <InstructionPage />].map((page, index) => <View key={index}>{page}</View>);
    return {
      pages: wrappedPages,
      numPages: wrappedPages.length,
      lastPageIndex: wrappedPages.length - 1,
    };
  }, []);

  const onPageSelected = useCallback(
    (event: PagerViewOnPageSelectedEvent) => {
      setActivePage(event?.nativeEvent?.position);
    },
    [setActivePage]
  );

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <PagerView ref={refPagerView} style={styles.pager} initialPage={0} onPageSelected={onPageSelected}>
          {pages}
        </PagerView>
        <View>
          <View style={styles.pagerDots}>
            <Dots numberOfDots={numPages} activeDot={activePage} />
          </View>
          <ButtonBar>
            {activePage === lastPageIndex ? (
              <Button
                variant={"primary"}
                onPress={handleComplete}
                title={t("onboarding:getStarted")}
                accessibilityLabel={"get started"}
              />
            ) : (
              <Button
                variant={"secondary"}
                onPress={handleComplete}
                title={t("onboarding:skip")}
                accessibilityLabel={t("onboarding:skip")}
              />
            )}
          </ButtonBar>
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  pager: {
    flex: 1,
  },
  pagerDots: {
    paddingBottom: themeTokens.spacing.vertical.medium.value,
  },
});
