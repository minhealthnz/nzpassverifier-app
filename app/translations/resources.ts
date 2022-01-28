import { strings as common } from "../common/strings";
import { strings as analytics } from "../features/analytics/strings";
import { strings as home } from "../features/home/strings";
import { strings as issuerCaching } from "../features/issuerCaching/strings";
import { strings as onboarding } from "../features/onboarding/strings";
import { strings as scanning } from "../features/scanning/strings";
import { strings as settings } from "../features/settings/strings";
import { strings as setup } from "../features/setup/strings";
import { strings as termsAndConditions } from "../features/termsAndConditions/strings";
import { strings as verification } from "../features/verification/strings";
import { strings as versionCheck } from "../features/versionCheck/strings";

export const resources = {
  en: {
    ...common.en,
    ...analytics.en,
    ...home.en,
    ...issuerCaching.en,
    ...onboarding.en,
    ...scanning.en,
    ...settings.en,
    ...setup.en,
    ...termsAndConditions.en,
    ...verification.en,
    ...versionCheck.en,
  },
};
