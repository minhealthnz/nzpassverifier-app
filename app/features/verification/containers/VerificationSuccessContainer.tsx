import React, { useState, useRef, useCallback } from "react";
import { VerificationSuccessScreen, VerificationSuccessScreenProps } from "../screens";
import { useAppDispatch, useAppSelector } from "../../../common";
import { doCloseVerificationResult } from "../actions";
import { VerificationStatus } from "../state";

const USER_DETAILS_TIMEOUT_MS = 5000;

/**
 * Container for the {@link VerificationSuccessScreen}
 */
export const VerificationSuccessContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const verifyResult = useAppSelector((state) => state.verification.result);
  const timeoutDurationRef = useRef(USER_DETAILS_TIMEOUT_MS);
  const [timerStartDate, setTimerStartDate] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const cancelTimeout = useCallback(() => {
    timeoutRef.current && clearTimeout(timeoutRef.current);
  }, []);

  const pauseTimer = useCallback(() => {
    setIsTimerPaused(true);
    cancelTimeout();
    const elapsedTime = Date.now() - timerStartDate;
    timeoutDurationRef.current = timeoutDurationRef.current - elapsedTime;
  }, [timerStartDate, cancelTimeout]);

  const resumeTimer = useCallback(() => {
    setIsTimerPaused(false);
    setTimerStartDate(Date.now());
    timeoutRef.current = setTimeout(() => {
      void appDispatch(doCloseVerificationResult({ navigateHome: false }));
    }, timeoutDurationRef.current);
  }, [appDispatch]);

  // By the time we navigated to this screen, the results may not be ready in redux store yet
  if (verifyResult?.status !== VerificationStatus.Valid) {
    return null;
  }

  const screenProps: VerificationSuccessScreenProps = {
    handlePressHome: () => appDispatch(doCloseVerificationResult({ navigateHome: true })),
    handlePressScanAgain: () => appDispatch(doCloseVerificationResult({ navigateHome: false })),
    onHoldStart: pauseTimer,
    onHoldEnd: resumeTimer,
    initialAnimationDuration: USER_DETAILS_TIMEOUT_MS,
    isTimerPaused: isTimerPaused,
    onMount: resumeTimer,
    onUnmount: cancelTimeout,
    resultDetails: verifyResult.details,
  };

  return (
    <VerificationSuccessScreen
      handlePressScanAgain={screenProps.handlePressScanAgain}
      handlePressHome={screenProps.handlePressHome}
      resultDetails={screenProps.resultDetails}
      onHoldStart={screenProps.onHoldStart}
      onHoldEnd={screenProps.onHoldEnd}
      initialAnimationDuration={screenProps.initialAnimationDuration}
      isTimerPaused={screenProps.isTimerPaused}
      onMount={screenProps.onMount}
      onUnmount={screenProps.onUnmount}
    />
  );
};
