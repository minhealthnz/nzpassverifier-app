import SplashScreen from "react-native-splash-screen";
import { unwrapResult } from "@reduxjs/toolkit";

import { termsAndConditionsService } from "../../termsAndConditions";
import { audioService, config, createAppAsyncThunk, navigation } from "../../../common";
import { doVersionCheck } from "../../versionCheck";
import { doSetupCacheRefresh } from "../../issuerCaching";
import { doRecordAnalyticsFirstUse, doSetupAnalytics } from "../../analytics";

/**
 * Set up the application before revealing it to the user
 *
 * @remarks
 * - Begins cache polling
 * - Check latest app version, prompt for update if needed
 * - Resolves and navigates the user to the initial route
 * - Hides the splash screen
 */
export const doSetupApp = createAppAsyncThunk("setup/check", async (_options, thunkAPI) => {
  await thunkAPI.dispatch(doSetupCacheRefresh());

  audioService.initialise();

  const navigateToInitialRoute = () => {
    const isOnBoardingComplete = thunkAPI.getState().onboarding.isComplete;
    if (!isOnBoardingComplete) {
      return navigation.replace("Onboarding");
    }
    const { acceptedVersion } = thunkAPI.getState().termsAndConditions;
    const isTermsAndConditionsAccepted = termsAndConditionsService.isLatestTermsAndConditionsVersion(acceptedVersion);
    if (!isTermsAndConditionsAccepted) {
      return navigation.replace("TermsAndConditions");
    }
    return navigation.replace("Home");
  };

  const versionInfo = unwrapResult(await thunkAPI.dispatch(doVersionCheck()));

  // {@link doVersionCheck} navigates the user within the action if they were out of date
  // Therefore no need to navigate if an update was required. Just hide the splash screen.
  if (versionInfo.isUpdateNeeded) {
    return SplashScreen.hide();
  }

  // eslint-disable-next-line functional/no-conditional-statement
  if (config.ANALYTICS_ENABLED) {
    // Setup analytics and record first use
    void thunkAPI.dispatch(doSetupAnalytics()).then(() => {
      void thunkAPI.dispatch(doRecordAnalyticsFirstUse());
    });
  }

  navigateToInitialRoute();
  return SplashScreen.hide();
});
