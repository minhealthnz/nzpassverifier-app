import React from "react";
import { StyleSheet, View } from "react-native";
import { themeTokens } from "../../../common";

/**
 * A component that renders an alert box in a modal style but it's not a true modal as
 * instead of overlaying the whole screen, it just renders within it's own view
 *
 * @param props - pass children to render within the alert box
 */
export const PartialModal: React.FC = (props) => {
  return (
    <>
      <View style={styles.backdrop} />
      <View style={styles.container}>
        <View style={styles.alertContainer}>{props.children}</View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: themeTokens.spacing.popup.container.LR.value,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: themeTokens.color.base.dark.value,
    opacity: themeTokens.opacity.background[75].value,
  },
  alertContainer: {
    backgroundColor: themeTokens.color.base.white.value,
    borderRadius: themeTokens.borderRadius.medium.value,
  },
});
