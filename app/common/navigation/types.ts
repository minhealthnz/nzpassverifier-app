export type RoutesAndParams = {
  readonly Setup: undefined;
  readonly Onboarding: undefined;
  readonly VersionUpdate: undefined;
  readonly TermsAndConditions: undefined;
  readonly Home: undefined;
  readonly Scan: undefined;
  readonly Verify: undefined;
  readonly VerificationProgress: undefined;
  readonly VerificationSuccess: undefined;
  readonly VerificationCannotRead: undefined;
  readonly VerificationCannotValidate: undefined;
  readonly VerificationInvalid: undefined;
  readonly ConnectionRequired: undefined;
};

/**
 * A type safe navigation function that allows 2 arguments
 *
 * @param name - a key of {@link RoutesAndParams}
 * @param args - either 1 extra argument which is the value of a RoutesAndParams key or no extra arguments (never)
 */
export type TypedNavigationFunction<ReturnType = void> = <RouteName extends keyof RoutesAndParams>(
  name: RouteName,
  ...args: RoutesAndParams[RouteName] extends Record<string, unknown> ? readonly [RoutesAndParams[RouteName]] : never
) => ReturnType;
