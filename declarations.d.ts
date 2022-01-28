/**
 * Provide typings for svg components imported
 *
 * @remarks
 * Using react-native-svg-transformer we can import svg images directly
 */
declare module "*.svg" {
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

/**
 * Provide typings for the loaded .env values
 *
 * @remarks
 * These imports are transformed by the react-native-dotenv babel plugin
 */
declare module "@env" {
  export const HELP_URL: string;
  export const PRIVACY_POLICY_URL: string;
  export const CACHE_HELP_URL: string;
  export const TERMS_AND_CONDITIONS_VERSION: string;
  export const TRUSTED_ISSUER_LIST: string;

  export const VERSION_CHECK_ENABLED: string;
  export const VERSION_CHECK_LASTCHECK_MAX_AGE_MS: string;
  export const VERSION_CHECK_LASTCHECK_MIN_AGE_MS: string;
  export const VERSION_CHECK_POLICY: string;
  export const VERSION_CHECK_PROVIDER_URL_OVERRIDE: string;
  export const VERSION_CHECK_REQUEST_TIMEOUT_MS: string;
  export const VERSION_CHECK_INITIAL_REQUEST_TIMEOUT_MS: string;
  export const VERSION_CHECK_UPDATE_URL_OVERRIDE: string;

  export const ISSUER_CACHE_MAX_AGE_MS: string;
  export const ISSUER_CACHE_REFRESH_MIN_AGE_MS: string;
  export const ISSUER_RESOLUTION_REQUEST_TIMEOUT_MS: string;

  export const ANALYTICS_ENABLED: string;
  export const AWS_COGNITO_IDENTITY_POOL_ID: string;
  export const AWS_COGNITO_IDENTITY_POOL_REGION: string;
  export const AWS_PINPOINT_APPLICATION_ID: string;
  export const AWS_PINPOINT_REGION: string;
}
