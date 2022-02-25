import React, { useMemo } from "react";
import { GestureResponderEvent, StyleSheet } from "react-native";
import { GestureHandlerRootView, TouchableOpacity } from "react-native-gesture-handler";
import { Icon } from "./Icon";
import { themeTokens } from "../theme";

export type IconButtonProps = {
  readonly onPress: (event?: GestureResponderEvent) => void;
  readonly iconName: string;
  readonly size?: number;
  readonly color?: string;
  readonly accessibilityLabel: string;
  readonly disabled?: boolean;
};

/**
 * An icon wrapped in a {@link TouchableOpacity} to trigger an on press action
 * Icons based on the {@link Icon} component utilizing a set of icomoon icons
 */
export const IconButton: React.FC<IconButtonProps> = (props) => {
  const { onPress, iconName, size = 38, color, accessibilityLabel, disabled = false } = props;

  const styles = useMemo(() => getStyles(color), [color]);

  return (
    <GestureHandlerRootView>
      <TouchableOpacity
        disabled={disabled}
        onPress={onPress}
        accessible={true}
        accessibilityRole={"button"}
        accessibilityLabel={accessibilityLabel}
      >
        <Icon name={iconName} style={[styles.icon]} size={size} />
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const getStyles = (color?: string) =>
  StyleSheet.create({
    icon: {
      color: color ?? themeTokens.color.button.primary.enabled.value,
    },
  });
