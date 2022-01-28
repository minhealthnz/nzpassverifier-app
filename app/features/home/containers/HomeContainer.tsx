import React from "react";
import { HomeScreen, HomeScreenProps } from "../screens";
import { useAppDispatch, useAppSelector } from "../../../common";
import { doShowCacheHelp, doShowHelp, doViewScan, doShowPrivacyPolicy } from "../actions";
import { selectMaximumCachedIssuersUpdatedTimestamp } from "../../issuerCaching/state/slice";

/**
 * Container for the {@link HomeScreen}
 */
export const HomeContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const lastCacheUpdate = useAppSelector(selectMaximumCachedIssuersUpdatedTimestamp);

  const screenProps: HomeScreenProps = {
    handlePressScan: () => appDispatch(doViewScan()),
    handlePressHelp: () => appDispatch(doShowHelp()),
    handlePressCacheHelp: () => appDispatch(doShowCacheHelp()),
    handlePressPrivacyPolicy: () => appDispatch(doShowPrivacyPolicy()),
    lastCacheUpdate: lastCacheUpdate,
  };

  return (
    <HomeScreen
      handlePressHelp={screenProps.handlePressHelp}
      handlePressScan={screenProps.handlePressScan}
      handlePressCacheHelp={screenProps.handlePressCacheHelp}
      handlePressPrivacyPolicy={screenProps.handlePressPrivacyPolicy}
      lastCacheUpdate={screenProps.lastCacheUpdate}
    />
  );
};
