import React, { useMemo } from "react";
import { useAppState } from "../hooks";
import { Modal } from "react-native";

type SensitiveViewGateProps = {
  /**
   * Allow overriding if the overlay should be down on app state changes or not
   *
   * @remarks
   * This is handy for screens we don't consider sensitive and don't want to overlay when going into the background on ios
   * Otherwise a white view will be shown behind when prompting system permissions for example
   */
  readonly disabled?: boolean;
};

/**
 * A simple component that will render a blank modal over otp of the application
 * This is used to prevent preserving potentially sensitive information in a screen capture by the os
 *
 * @remarks
 * This is triggered too late in android to achieve the goal properly. Android uses the native FLAG_SECURE
 *
 * @see https://jonaskuiler.medium.com/creating-a-security-screen-on-ios-and-android-in-react-native-97703092e2de
 */
export const SensitiveViewGate: React.FC<SensitiveViewGateProps> = (props) => {
  const { disabled = false, children } = props;

  const appState = useAppState();
  const isHidden = useMemo(
    () => !disabled && (appState === "background" || appState === "inactive"),
    [appState, disabled]
  );

  return (
    <>
      {isHidden && <Modal />}
      {children}
    </>
  );
};
