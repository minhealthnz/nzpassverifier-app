import React from "react";
import { VerificationCannotValidateScreenProps, VerificationCannotValidateScreen } from "../screens";
import { useAppDispatch } from "../../../common";
import { doCloseVerificationResult } from "../actions";

/**
 * Container for the {@link VerificationCannotValidateScreen}
 */
export const VerificationCannotValidateContainer: React.FC = () => {
  const appDispatch = useAppDispatch();

  const screenProps: VerificationCannotValidateScreenProps = {
    handlePressHome: () => appDispatch(doCloseVerificationResult({ navigateHome: true })),
    handlePressScanAgain: () => appDispatch(doCloseVerificationResult({ navigateHome: false })),
  };

  return (
    <VerificationCannotValidateScreen
      handlePressScanAgain={screenProps.handlePressScanAgain}
      handlePressHome={screenProps.handlePressHome}
    />
  );
};
