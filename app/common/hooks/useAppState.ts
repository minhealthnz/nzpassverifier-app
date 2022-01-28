import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";

/**
 * A hook that gives the consumer the current state of the application
 */
export const useAppState = (): AppStateStatus => {
  const currentState = AppState.currentState;
  const [appState, setAppState] = useState(currentState);

  useEffect(() => {
    const onChange = (newState: AppStateStatus) => {
      setAppState(newState);
    };
    const subscription = AppState.addEventListener("change", onChange);

    return () => subscription.remove();
  }, []);

  return appState;
};
