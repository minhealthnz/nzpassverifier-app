import React from "react";
import { StyleSheet, View } from "react-native";
import { themeTokens } from "../../../common";

export type PullDownTabProps = {
  readonly color: string;
};

/**
 * Component renders pull down tab for use on modal
 *
 * @param props - {@link PullDownTabProps}
 */
export const PullDownTab: React.FC<PullDownTabProps> = (props) => {
  const styles = createStyles(props.color);
  return (
    <View style={styles.container}>
      <View style={styles.pullDownTab} />
    </View>
  );
};

const createStyles = (color: string) =>
  StyleSheet.create({
    container: {
      width: "100%",
      alignItems: "center",
    },
    pullDownTab: {
      backgroundColor: color,
      width: 116,
      height: 3,
      borderRadius: themeTokens.borderRadius.small.value,
    },
  });
