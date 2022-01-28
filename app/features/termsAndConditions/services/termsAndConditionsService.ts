import { config } from "../../../common";

const isLatestTermsAndConditionsVersion = (version: number): boolean => {
  return version === config.TERMS_AND_CONDITIONS_VERSION;
};

const acceptTermsAndConditions = (): number => {
  // Latest version should come from configuration so we can bump as needed
  return config.TERMS_AND_CONDITIONS_VERSION;
};

export const termsAndConditionsService = {
  isLatestTermsAndConditionsVersion,
  acceptTermsAndConditions,
};
