import React, { useState, useMemo, useCallback } from "react";
import { TouchableWithoutFeedback, TextStyle, ViewStyle, View, StyleSheet } from "react-native";
import { themeTokens } from "../theme";
import { createConditionalStyle } from "../utilities";
import { Icon, IconName } from "./Icon";
import { Text } from "./Text";
import { useWindowScale, ScaleFont } from "../hooks";

/**
 * Button height is affected by the font size of the inner text changing
 * We need to ensure we scale the border radius of the button to compensate accordingly
 */
type ScaleBorderRadius = ScaleFont;

export type ButtonVariant = "primary" | "secondary";

export type ButtonProps = {
  /**
   * Handler to be called when the user taps the button
   */
  readonly onPress: () => void;

  /**
   * Text to display inside the button
   */
  readonly title: string;

  /**
   * An optional icon to include on the right of the buttons text
   */
  readonly iconName?: IconName;

  /**
   * Disables all interactions with this component
   */
  readonly disabled?: boolean;

  /**
   * The variant of the button
   */
  readonly variant?: ButtonVariant;

  /**
   * Accessibility label
   */
  readonly accessibilityLabel: string;

  /**
   * An accessibility hint helps users understand what will happen when they perform an action
   * on the accessibility element when that result is not apparent from the accessibility label
   */
  readonly accessibilityHint?: string;
};

/**
 * A simple button component that can be presented as a certain {@link ButtonVariant}
 *
 * @param props - {@link ButtonProps}
 */
export const Button: React.FC<ButtonProps> = (props) => {
  const {
    onPress,
    title,
    disabled = false,
    variant = "primary",
    accessibilityLabel,
    accessibilityHint,
    iconName,
  } = props;

  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handlePressIn = useCallback(() => setIsActive(true), []);
  const handlePressOut = useCallback(() => setIsActive(false), []);
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => setIsFocused(false), []);

  const { scaleFont: scaleBorderRadius } = useWindowScale();
  const baseStyles = useMemo(() => createBaseStyles(scaleBorderRadius), [scaleBorderRadius]);
  const primaryStyles = useMemo(() => createPrimaryStyles(baseStyles), [baseStyles]);
  const secondaryStyles = useMemo(() => createSecondaryStyles(baseStyles), [baseStyles]);

  /**
   * Compute the styles for the specific variant depending on the state of the button
   */
  const variantStyles = useMemo(() => {
    switch (variant) {
      case "primary":
        return primaryStyles;
      case "secondary":
        return secondaryStyles;
      default:
        return primaryStyles;
    }
  }, [variant, primaryStyles, secondaryStyles]);

  const wrapperStyles = useMemo(
    () =>
      createConditionalStyle(variantStyles, {
        wrapper: true,
        wrapperActive: isActive,
        wrapperFocused: isFocused,
        wrapperDisabled: disabled,
      }),
    [disabled, isActive, isFocused, variantStyles]
  );
  const textStyles = useMemo(
    () =>
      createConditionalStyle(variantStyles, {
        text: true,
        textActive: isActive,
        textFocused: isFocused,
        textDisabled: disabled,
      }),
    [disabled, isActive, isFocused, variantStyles]
  );
  const iconStyles = useMemo(
    () =>
      createConditionalStyle(variantStyles, {
        icon: true,
        iconActive: isActive,
        iconFocused: isFocused,
        iconDisabled: disabled,
      }),
    [disabled, isActive, isFocused, variantStyles]
  );

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onFocus={handleFocus}
      onBlur={handleBlur}
      disabled={disabled}
      onPress={onPress}
      accessible={true}
      accessibilityRole={"button"}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled }}
    >
      <View style={wrapperStyles}>
        <Text variant={"button"} style={textStyles}>
          {title}
        </Text>
        {iconName && <Icon name={iconName} style={iconStyles} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

/**
 * A helper type to assure a button variant has defined all it's styles for possible states
 */
type ButtonStyles = {
  readonly wrapper: ViewStyle;
  readonly wrapperActive: ViewStyle;
  readonly wrapperFocused: ViewStyle;
  readonly wrapperDisabled: ViewStyle;

  readonly text: TextStyle;
  readonly textActive: TextStyle;
  readonly textFocused: TextStyle;
  readonly textDisabled: TextStyle;

  readonly icon: TextStyle;
  readonly iconActive: TextStyle;
  readonly iconFocused: TextStyle;
  readonly iconDisabled: TextStyle;
};

/**
 * Defines styles that should be assumed in common for all button variants
 *
 * @param scaleBorderRadius - {@link ScaleBorderRadius}
 *
 * @remarks
 * Typically excludes colors as these are expected to be different per variant
 */
const createBaseStyles = (scaleBorderRadius: ScaleBorderRadius) =>
  StyleSheet.create<Partial<ButtonStyles>>({
    wrapper: {
      flexDirection: "row",
      paddingHorizontal: themeTokens.spacing.buttonPadding.horizontal.value,
      paddingVertical: themeTokens.spacing.buttonPadding.vertical.value,
      borderRadius: scaleBorderRadius(themeTokens.borderRadius.button.standard.value),
      borderWidth: 1,
    },
    icon: {
      lineHeight: themeTokens.typography.Button.lineHeight.value,
      fontSize: themeTokens.typography.Button.fontSize.value,
      paddingLeft: themeTokens.spacing.horizontal.small.value,
    },
  });

/**
 * Defines styles that should be specific for the primary button variant
 */
const createPrimaryStyles = (baseStyles: Partial<ButtonStyles>) =>
  StyleSheet.create<ButtonStyles>({
    wrapper: {
      ...baseStyles.wrapper,
      paddingHorizontal: themeTokens.spacing.buttonPadding.horizontal.value,
      paddingVertical: themeTokens.spacing.buttonPadding.vertical.value,
      backgroundColor: themeTokens.color.button.primary.enabled.value,
      borderColor: themeTokens.color.button.primary.enabled.value,
    },
    wrapperActive: {
      ...baseStyles.wrapperActive,
      borderColor: themeTokens.color.button.primary.pressed.value,
      backgroundColor: themeTokens.color.button.primary.pressed.value,
    },
    wrapperFocused: {
      ...baseStyles.wrapperFocused,
      backgroundColor: themeTokens.color.button.primary.focus.value,
      borderColor: themeTokens.color.button.primary.focus.value,
    },
    wrapperDisabled: {
      ...baseStyles.wrapperDisabled,
      backgroundColor: themeTokens.color.button.primary.disabledDark.value,
      borderColor: themeTokens.color.button.primary.disabledDark.value,
    },
    text: {
      ...baseStyles.text,
      color: themeTokens.color.button.text.white.value,
    },
    textActive: { ...baseStyles.textActive },
    textFocused: { ...baseStyles.textFocused },
    textDisabled: {
      ...baseStyles.textDisabled,
    },
    icon: { ...baseStyles.icon, color: themeTokens.color.button.text.white.value },
    iconActive: { ...baseStyles.iconActive },
    iconFocused: { ...baseStyles.iconFocused },
    iconDisabled: { ...baseStyles.iconDisabled },
  });

/**
 * Defines styles that should be specific for the secondary button variant
 */
const createSecondaryStyles = (baseStyles: Partial<ButtonStyles>) =>
  StyleSheet.create<ButtonStyles>({
    wrapper: {
      ...baseStyles.wrapper,
      borderColor: themeTokens.color.button.primary.enabled.value,
      borderWidth: themeTokens.borderWidth.button.secondary.value,
    },
    wrapperActive: {
      ...baseStyles.wrapperActive,
      borderColor: themeTokens.color.main["primary-100"].value,
      backgroundColor: themeTokens.color.neutrals["grey-100"].value,
    },
    wrapperFocused: {
      ...baseStyles.wrapperFocused,
      borderColor: themeTokens.color.button.primary.focus.value,
    },
    wrapperDisabled: {
      ...baseStyles.wrapperDisabled,
      borderColor: themeTokens.color.button.primary.disabledDark.value,
    },
    text: {
      ...baseStyles.text,
      color: themeTokens.color.button.primary.enabled.value,
    },
    textActive: {
      ...baseStyles.textActive,
      color: themeTokens.color.button.primary.pressed.value,
    },
    textFocused: {
      ...baseStyles.textFocused,
      color: themeTokens.color.button.primary.focus.value,
    },
    textDisabled: {
      ...baseStyles.textDisabled,
      color: themeTokens.color.button.text.disabled.value,
    },
    icon: { ...baseStyles.icon, color: themeTokens.color.button.primary.enabled.value },
    iconActive: { ...baseStyles.iconActive, color: themeTokens.color.button.primary.pressed.value },
    iconFocused: { ...baseStyles.iconFocused, color: themeTokens.color.button.primary.focus.value },
    iconDisabled: { ...baseStyles.iconDisabled, color: themeTokens.color.button.text.disabled.value },
  });
