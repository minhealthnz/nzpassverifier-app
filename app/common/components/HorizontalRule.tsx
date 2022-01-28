import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { themeTokens } from "../theme";

export type HorizontalRuleProps = {
  readonly style?: ViewStyle;
};
/**
 * A simple horizontal rule spanning full width
 */
export const HorizontalRule: React.FC<HorizontalRuleProps> = (props) => {
  const { style = {} } = props;
  const styles = createStyles(style);
  return <View style={styles.topRule} />;
};

const createStyles = (styleOverrides: ViewStyle) =>
  StyleSheet.create({
    topRule: {
      width: "100%",
      height: themeTokens.borderWidth.footerDivider.value,
      backgroundColor: themeTokens.color.neutrals["grey-300"].value,
      ...styleOverrides,
    },
  });
