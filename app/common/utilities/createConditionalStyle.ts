import { ImageStyle, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { StyleConditions } from "./types";

const reduceConditionalStyle =
  (styles: Record<string, StyleProp<ImageStyle | ViewStyle | TextStyle>>) =>
  (accumulatedStyles: StyleProp<ImageStyle | ViewStyle | TextStyle>, conditionEntry: readonly [string, boolean]) => {
    const [styleKey, isIncluded] = conditionEntry;
    if (!isIncluded) {
      return accumulatedStyles;
    }
    return StyleSheet.compose<ImageStyle | ViewStyle | TextStyle>(accumulatedStyles, styles[styleKey]);
  };

/**
 * Return a new style who's properties are equal to a merged value based on a set of conditions
 *
 * @remarks
 * Usual hierarchy rules apply to the styles being merged
 *
 * @example
 * ```
 * const styles = { buttonBase: { color: "blue", borderRadius: 10 }, buttonDisabled: { color: "grey" }};
 * const conditions = { buttonBase: true, buttonDisabled: true }
 *
 * createConditionalStyle(styles, conditions) // { color: "grey", borderRadius: 10 }
 * ```
 *
 */
export const createConditionalStyle = <T>(
  styles: StyleSheet.NamedStyles<T>,
  conditions: StyleConditions<Partial<T>>
): StyleProp<ImageStyle | ViewStyle | TextStyle> => {
  const composedStyles = Object.entries<boolean>(conditions).reduce(reduceConditionalStyle(styles), {});
  return StyleSheet.flatten(composedStyles);
};
