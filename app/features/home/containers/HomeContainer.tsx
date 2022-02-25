import React, { useEffect, useState } from "react";
import { HomeScreen, HomeScreenProps } from "../screens";
import { useAppDispatch, useAppSelector } from "../../../common";
import { doShowHelp, doViewScan, doShowPrivacyPolicy } from "../actions";
import { selectMaximumCachedIssuersUpdatedTimestamp } from "../../issuerCaching/state/slice";
import { getCurrentCacheStatus } from "../utilities";

/**
 * Container for the {@link HomeScreen}
 */
export const HomeContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const lastCacheUpdate = useAppSelector(selectMaximumCachedIssuersUpdatedTimestamp);
  const [cacheStatusDetails, setCacheStatusDetails] = useState(() => getCurrentCacheStatus(lastCacheUpdate));

  useEffect(() => {
    setCacheStatusDetails(getCurrentCacheStatus(lastCacheUpdate));
    const timeout = setInterval(() => {
      setCacheStatusDetails(getCurrentCacheStatus(lastCacheUpdate));
    }, 60000);
    return () => {
      clearTimeout(timeout);
    };
  }, [lastCacheUpdate]);

  const screenProps: HomeScreenProps = {
    handlePressScan: () => appDispatch(doViewScan()),
    handlePressHelp: () => appDispatch(doShowHelp()),
    handlePressPrivacyPolicy: () => appDispatch(doShowPrivacyPolicy()),
    cacheStatusDetails: cacheStatusDetails,
  };

  return (
    <HomeScreen
      handlePressHelp={screenProps.handlePressHelp}
      handlePressScan={screenProps.handlePressScan}
      handlePressPrivacyPolicy={screenProps.handlePressPrivacyPolicy}
      cacheStatusDetails={screenProps.cacheStatusDetails}
    />
  );
};
