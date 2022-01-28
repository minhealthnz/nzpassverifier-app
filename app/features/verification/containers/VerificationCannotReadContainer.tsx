import React from "react";
import { VerificationCannotReadScreenProps } from "../screens";
import { useAppDispatch } from "../../../common";
import { doCloseVerificationResult } from "../actions";
import { VerificationCannotReadScreen } from "../screens";

/**
 * Container for the {@link VerificationCannotReadScreen}
 */
export const VerificationCannotReadContainer: React.FC = () => {
  const appDispatch = useAppDispatch();

  const screenProps: VerificationCannotReadScreenProps = {
    handlePressHome: () => appDispatch(doCloseVerificationResult({ navigateHome: true })),
    handlePressScanAgain: () => appDispatch(doCloseVerificationResult({ navigateHome: false })),
  };

  return (
    <VerificationCannotReadScreen
      handlePressScanAgain={screenProps.handlePressScanAgain}
      handlePressHome={screenProps.handlePressHome}
    />
  );
};
