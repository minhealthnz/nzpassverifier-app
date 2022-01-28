import Amplify from "@aws-amplify/core";
import Auth from "@aws-amplify/auth";
import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import VersionCheck from "react-native-version-check";

import { config } from "../../../common";
import Analytics from "@aws-amplify/analytics";

const init = async (): Promise<void> => {
  const currentVersion = VersionCheck.getCurrentVersion();

  // Configure AWS pinpoint
  Amplify.configure({
    Auth: {
      identityPoolId: config.AWS_COGNITO_IDENTITY_POOL_ID,
      region: config.AWS_COGNITO_IDENTITY_POOL_REGION,
    },
    Analytics: {
      disabled: false,
      autoSessionRecord: false,
      AWSPinpoint: {
        appId: config.AWS_PINPOINT_APPLICATION_ID,
        region: config.AWS_PINPOINT_REGION,
        mandatorySignIn: false,
        endpoint: {
          address: DeviceInfo.getUniqueId(),
          channelType: Platform.OS === "ios" ? "APNS" : "GCM",
          demographic: {
            appVersion: currentVersion,
            make: DeviceInfo.getBrand(),
            model: DeviceInfo.getModel(),
            platform: DeviceInfo.getSystemName(),
            platformVersion: DeviceInfo.getSystemVersion(),
          },
        },
      },
    },
  });

  // Need to call this line. See https://github.com/aws-amplify/amplify-js/issues/4448
  return Auth.currentCredentials()
    .then(() => {
      void Analytics.updateEndpoint({}).catch();
    })
    .catch();
};

export const analyticsSetupService = {
  init,
};
