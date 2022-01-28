import React, { useMemo } from "react";
import { Text as ReactText, TextStyle, StyleSheet, TextProps as ReactTextProps } from "react-native";
import { themeTokens } from "../theme";
import { useWindowScale } from "../hooks";

/**
 * Common text variants used within the application
 */
type TextVariant = "body" | "h1" | "h2" | "detail" | "label" | "button" | "broadcast" | "attribute";

export type TextProps = ReactTextProps & {
  /**
   * The variant of this text to base the styles on
   *
   * @see {@link TextVariant}
   */
  readonly variant?: TextVariant;
};

/**
 * A simple text component supporting the {@link TextVariant}'s we use throughout the application
 *
 * @param props - {@link TextProps}
 */
export const Text: React.FC<TextProps> = (props) => {
  const { variant = "body", ...textProps } = props;
  const { scaleFont } = useWindowScale();

  /**
   * Get the styles for the specific variant of text
   */
  const textStyle = useMemo(() => {
    const styles = getVariantStyles(variant);
    return {
      ...styles,
      fontSize: scaleFont(styles.fontSize ?? 0),
      lineHeight: scaleFont(styles.lineHeight ?? 0),
    };
  }, [variant, scaleFont]);

  /**
   * Treat styles from properties as style overrides to the variant styles
   */
  const styleOverride = useMemo(() => (Array.isArray(props.style) ? props.style : [props.style]), [props.style]);

  return <ReactText {...textProps} style={[textStyle, styleOverride]} />;
};

/**
 * A type of stylesheet containing styles for all the possible variants
 *
 * @remarks
 * A property of this style should map to a {@link TextVariant}
 */
type TextStyles = {
  /**
   * Common style for body text
   */
  readonly body: TextStyle;
  /**
   * The largest of headings
   */
  readonly h1: TextStyle;
  /**
   * The second largest of headings
   */
  readonly h2: TextStyle;
  /**
   * Label of a subjects details
   */
  readonly label: TextStyle;
  /**
   * Attribute of a subjects details
   */
  readonly attribute: TextStyle;
  /**
   * An further description of a label or attribute
   */
  readonly detail: TextStyle;
  /**
   * Common style for text used within buttons
   */
  readonly button: TextStyle;
  /**
   * Larger body font used within results
   */
  readonly broadcast: TextStyle;
};

/**
 * Simple mapping to get a variants styles from the style sheet
 *
 * @param variant - {@link TextVariant}
 */
const getVariantStyles = (variant: TextVariant): TextStyle => {
  switch (variant) {
    case "body":
      return styles.body;
    case "h1":
      return styles.h1;
    case "h2":
      return styles.h2;
    case "label":
      return styles.label;
    case "detail":
      return styles.detail;
    case "button":
      return styles.button;
    case "broadcast":
      return styles.broadcast;
    case "attribute":
      return styles.attribute;
    default:
      return styles.body;
  }
};

/**
 * Defines style for each variant
 *
 * @remarks
 * These are common styles. Specific styles are overridden as needed via props.styles passed into this component
 */
const styles = StyleSheet.create<TextStyles>({
  body: {
    fontSize: themeTokens.typography.Body.fontSize.value,
    letterSpacing: themeTokens.typography.Body.letterSpacing.value,
    fontFamily: themeTokens.typography.Body.fontFamily.value,
    lineHeight: themeTokens.typography.Body.lineHeight.value,
    color: themeTokens.color.text.dark.value,
  },
  h1: {
    paddingBottom: themeTokens.spacing.vertical.xl.value,
    fontSize: themeTokens.typography.H1.fontSize.value,
    letterSpacing: themeTokens.typography.H1.letterSpacing.value,
    fontFamily: themeTokens.typography.H1.fontFamily.value,
    lineHeight: themeTokens.typography.H1.lineHeight.value,
    color: themeTokens.color.text.dark.value,
  },
  h2: {
    paddingTop: themeTokens.spacing.vertical.large.value,
    paddingBottom: themeTokens.spacing.vertical.large.value,
    fontSize: themeTokens.typography.H2.fontSize.value,
    fontFamily: themeTokens.typography.H2.fontFamily.value,
    lineHeight: themeTokens.typography.H2.lineHeight.value,
    color: themeTokens.color.text.dark.value,
  },
  detail: {
    fontSize: themeTokens.typography.Detail.fontSize.value,
    letterSpacing: themeTokens.typography.Detail.letterSpacing.value,
    fontFamily: themeTokens.typography.Detail.fontFamily.value,
    lineHeight: themeTokens.typography.Detail.lineHeight.value,
    color: themeTokens.color.text.label.value,
  },
  label: {
    fontSize: themeTokens.typography.Label.fontSize.value,
    letterSpacing: themeTokens.typography.Label.letterSpacing.value,
    fontFamily: themeTokens.typography.Label.fontFamily.value,
    lineHeight: themeTokens.typography.Label.lineHeight.value,
    color: themeTokens.color.text.label.value,
  },
  button: {
    fontSize: themeTokens.typography.Button.fontSize.value,
    letterSpacing: themeTokens.typography.Button.letterSpacing.value,
    fontFamily: themeTokens.typography.Button.fontFamily.value,
    lineHeight: themeTokens.typography.Button.lineHeight.value,
    color: themeTokens.color.text.dark.value,
  },
  broadcast: {
    fontSize: themeTokens.typography.Broadcast.fontSize.value,
    letterSpacing: themeTokens.typography.Broadcast.letterSpacing.value,
    fontFamily: themeTokens.typography.Broadcast.fontFamily.value,
    lineHeight: themeTokens.typography.Broadcast.lineHeight.value,
    color: themeTokens.color.text.dark.value,
  },
  attribute: {
    fontSize: themeTokens.typography.Attribute.fontSize.value,
    letterSpacing: themeTokens.typography.Attribute.letterSpacing.value,
    fontFamily: themeTokens.typography.Attribute.fontFamily.value,
    lineHeight: themeTokens.typography.Attribute.lineHeight.value,
    color: themeTokens.color.text.dark.value,
  },
});
