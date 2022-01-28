import { StyleSheet, View } from "react-native";
import { Icon, IconName, Text, themeTokens, useWindowScale, WindowScaleFunctions } from "../../../common";
import React, { useMemo } from "react";

export type ExternalLinkProps = {
  readonly onPress: () => void;
  readonly children: string;
};

/**
 * A body text styled as a link with an external icon next to it
 */
export const ExternalLink: React.FC<ExternalLinkProps> = (props) => {
  const { onPress, children } = props;
  const scaleFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scaleFunctions), [scaleFunctions]);

  return (
    <View style={styles.linkRow}>
      <Text accessibilityRole={"link"} style={[styles.linkText]} onPress={onPress}>
        {children}
      </Text>
      <Icon style={[styles.linkIcon]} name={IconName.external} />
    </View>
  );
};

const createStyles = ({ scaleFont, scaleHorizontal }: WindowScaleFunctions) =>
  StyleSheet.create({
    linkRow: {
      flexDirection: "row",
      textAlignVertical: "center",
    },
    linkText: {
      color: themeTokens.color.text.link.value,
      textDecorationLine: "underline",
    },
    linkIcon: {
      fontSize: scaleFont(themeTokens.typography.Body.fontSize.value),
      lineHeight: scaleFont(themeTokens.typography.Body.lineHeight.value),
      paddingLeft: scaleHorizontal(themeTokens.spacing.horizontal.medium.value),
      color: themeTokens.color.text.link.value,
    },
  });
