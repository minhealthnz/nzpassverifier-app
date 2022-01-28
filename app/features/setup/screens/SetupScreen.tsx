import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { ScreenContainer } from "../../../common";

export type SetupScreenProps = {
  readonly handleSetup: () => void;
};

/**
 * A screen shown behind the splash screen as the app is setting up
 *
 * @remarks
 * Setup is called as a one off on app open. The thunk action will hide the overlaying splash screen and navigate away from this screen on completion
 *
 * @param props - {@link SetupScreenProps}
 */
export const SetupScreen: React.FC<SetupScreenProps> = (props) => {
  const { handleSetup } = props;

  useEffect(() => {
    void handleSetup();
  }, [handleSetup]);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <ActivityIndicator />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
  },
});
