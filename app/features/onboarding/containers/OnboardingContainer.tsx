import React from "react";
import { doCompleteOnboarding } from "../actions";
import { useAppDispatch } from "../../../common";
import { OnboardingScreen } from "../screens";

/**
 * Container for the {@link OnboardingScreen}
 */
export const OnboardingContainer: React.FC = () => {
  const appDispatch = useAppDispatch();

  const handleComplete = () => appDispatch(doCompleteOnboarding());

  return <OnboardingScreen handleComplete={handleComplete} />;
};
