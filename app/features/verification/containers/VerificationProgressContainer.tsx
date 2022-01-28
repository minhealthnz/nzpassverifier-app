import React, { useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../../common";
import { VerificationProgressScreen } from "../screens";
import { doVerifyPayload } from "../actions";

/**
 * Container for the {@link VerificationProgressScreen}
 */
export const VerificationProgressContainer: React.FC = () => {
  const appDispatch = useAppDispatch();
  const previousVerifyRef = useRef<{ readonly abort: () => void }>();

  const payload = useAppSelector((state) => state.scanning.payload);

  const handleVerifyPayload = useCallback(() => {
    if (payload === undefined) {
      return;
    }
    previousVerifyRef.current = appDispatch(doVerifyPayload(payload));
  }, [appDispatch, previousVerifyRef, payload]);

  const handleAbortVerify = useCallback(() => {
    void previousVerifyRef.current?.abort();
  }, [previousVerifyRef]);

  return <VerificationProgressScreen handleOnUnmount={handleAbortVerify} handleOnMount={handleVerifyPayload} />;
};
