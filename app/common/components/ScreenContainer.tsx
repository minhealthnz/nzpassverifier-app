import React from "react";
import { StyleSheet, StatusBarProps, StatusBar, Platform } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { themeTokens } from "../theme";
import { SensitiveViewGate } from "./SensitiveViewGate";

type ScreenContainerProperties = {
  readonly safeAreaEdges?: readonly Edge[];
  readonly isSensitiveView?: boolean;
  readonly statusBarStyle?: StatusBarProps["barStyle"];
};

/**
 * A common container for a group of components to be contained within safe bounds
 *
 * @param props - {@link ScreenContainerProperties} with the children to render within the wrapping provided in this components
 */
export const ScreenContainer: React.FC<ScreenContainerProperties> = (props) => {
  const { safeAreaEdges, children, isSensitiveView = false, statusBarStyle = "dark-content" } = props;

  return (
    <SensitiveViewGate disabled={!isSensitiveView}>
      <SafeAreaView style={styles.wrapper} edges={safeAreaEdges}>
        {/* We don't render behind the status bar in android so no need to alter style */}
        {Platform.OS === "ios" && <StatusBar barStyle={statusBarStyle} />}
        {children}
      </SafeAreaView>
    </SensitiveViewGate>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: themeTokens.color.base.white.value,
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
});
