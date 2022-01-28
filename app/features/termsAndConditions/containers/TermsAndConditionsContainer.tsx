import React from "react";
import { useAppDispatch, useAppSelector } from "../../../common";
import { TermsAndConditionsScreen } from "../screens";
import { doAcceptTermsAndConditions } from "../actions";

/**
 * Container for the {@link TermsAndConditionsScreen}
 */
export const TermsAndConditionsContainer: React.FC = () => {
  const appDispatch = useAppDispatch();

  const dispatchAcceptTermsAndConditions = () => appDispatch(doAcceptTermsAndConditions());
  const isLoading = useAppSelector((state) => state.termsAndConditions.isLoading);

  return (
    <TermsAndConditionsScreen
      handleAcceptTermsAndConditions={dispatchAcceptTermsAndConditions}
      isSubmitDisabled={isLoading}
    />
  );
};
