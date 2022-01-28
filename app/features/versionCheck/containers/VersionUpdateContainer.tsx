import React from "react";
import { useAppDispatch, useAppSelector } from "../../../common";
import { VersionUpdateScreen, VersionUpdateScreenProps } from "../screens";
import { doForceVersionUpdate } from "../actions";

/**
 * Container for the {@link VersionUpdateScreen}
 */
export const VersionUpdateContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const versionUpdateUrl = useAppSelector((state) => state.versionCheck.versionUpdateUrl);

  const screenProps: VersionUpdateScreenProps = {
    handlePressUpdate: () => appDispatch(doForceVersionUpdate()),
    isUpdateAvailable: versionUpdateUrl !== undefined,
  };

  return (
    <VersionUpdateScreen
      isUpdateAvailable={screenProps.isUpdateAvailable}
      handlePressUpdate={screenProps.handlePressUpdate}
    />
  );
};
