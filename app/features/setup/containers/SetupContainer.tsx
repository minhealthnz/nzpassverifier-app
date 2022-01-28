import React, { useCallback } from "react";
import { doSetupApp } from "../actions";
import { useAppDispatch } from "../../../common";
import { SetupScreen, SetupScreenProps } from "../screens";

/**
 * Container for the {@link SetupScreen}
 */
export const SetupContainer: React.FC = () => {
  const appDispatch = useAppDispatch();

  const screenProps: SetupScreenProps = {
    handleSetup: useCallback(() => appDispatch(doSetupApp()), [appDispatch]),
  };

  return <SetupScreen handleSetup={screenProps.handleSetup} />;
};
