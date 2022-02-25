import React from "react";
import { VerificationInvalidScreen, VerificationInvalidScreenProps } from "../screens";
import { useAppDispatch, useAppSelector } from "../../../common";
import { doCloseVerificationResult } from "../actions";
import { VerificationStatus } from "../state";

/**
 * Container for the {@link VerificationInvalidScreen}
 */
export const VerificationInvalidContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const verifyResult = useAppSelector((state) => state.verification.result);

  // By the time we navigated to this screen, the results may not be ready in redux store yet
  if (verifyResult?.status !== VerificationStatus.Invalid) {
    return null;
  }

  const screenProps: VerificationInvalidScreenProps = {
    handlePressHome: () => appDispatch(doCloseVerificationResult({ navigateHome: true })),
    handlePressScanAgain: () => appDispatch(doCloseVerificationResult({ navigateHome: false })),
    failureReason: verifyResult.failureReason,
    expiryDate: verifyResult.expiry,
    expiredDuration: verifyResult.expiredDuration,
  };

  return (
    <VerificationInvalidScreen
      handlePressScanAgain={screenProps.handlePressScanAgain}
      handlePressHome={screenProps.handlePressHome}
      failureReason={screenProps.failureReason}
      expiryDate={screenProps.expiryDate}
      expiredDuration={screenProps.expiredDuration}
    />
  );
};
