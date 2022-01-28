import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { createConditionalStyle } from "../utilities";
import { themeTokens } from "../theme";
import { useWindowScale, WindowScaleFunctions } from "../hooks";

type ButtonBarProps = {
  /**
   * Direction to align all the buttons in this bar together
   */
  readonly direction?: "column" | "row";

  /**
   * Will the buttons inside the bar span the full remaining width of the flex
   */
  readonly fullWidth?: boolean;
};

/**
 * A simple container for achieving common button alignments within
 *
 * @param props - {@link ButtonBarProps}
 *
 * @remarks
 * Currently, this component only needs to be capable of very few layouts
 */
export const ButtonBar: React.FC<ButtonBarProps> = (props) => {
  const { direction = "column", fullWidth = false, children } = props;
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  const wrapperStyle = createConditionalStyle(styles, {
    wrapper: true,
    column: direction === "column",
    row: direction === "row",
    fullWidthRow: fullWidth && direction === "row",
    fullWidthColumn: fullWidth && direction === "column",
  });

  const childStyle = createConditionalStyle(styles, {
    fullWidthChildRow: fullWidth && direction === "row",
  });

  const buttons = React.Children.map(children, (child) => {
    if (child) {
      return <View style={[childStyle]}>{child}</View>;
    }
    return;
  });

  return <View style={wrapperStyle}>{buttons}</View>;
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleVertical, scaleHorizontal } = scalingFunctions;
  return StyleSheet.create({
    wrapper: {
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      alignContent: "center",
      flexWrap: "wrap",
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
      paddingVertical: scaleVertical(themeTokens.spacing.vertical.xl.value),
    },
    fullWidthColumn: {
      flexDirection: "column",
      alignItems: "stretch",
      alignContent: "stretch",
    },
    fullWidthRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "stretch",
    },
    column: {
      flexDirection: "column",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    fullWidthChildRow: {
      flexGrow: 1,
      flexBasis: 1,
    },
  });
};
