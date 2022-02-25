import React from "react";
import { StyleSheet, View } from "react-native";
import { ForwardSlash, ForwardSlashProps } from ".";
import { DateStrings } from "..";
import { Text, TextProps } from "../../../common";

export type DateWithSlashesProps = {
  /**
   * Date string to display
   */
  readonly dateStrings: DateStrings;
  /**
   * Props for the date strings
   */
  readonly textProps: TextProps;
  /**
   * Props for the forward slashes between date numbers
   */
  readonly slashProps: ForwardSlashProps;
};

/**
 * A Date component which shows dates in the format (DD / MM / YYYY) with forward slashes
 *
 * @param props - {@link DateWithSlashesProps}
 */
export const DateWithSlashes: React.FC<DateWithSlashesProps> = (props) => {
  const { dateStrings, textProps, slashProps } = props;
  const { day, month, year } = dateStrings;
  const { width: slashWidth, height: slashHeight, paddingHorizontal: slashPadding } = slashProps;

  return (
    <View style={styles.date}>
      <Text variant={textProps.variant} style={textProps.style}>
        {day}
      </Text>
      <ForwardSlash width={slashWidth} height={slashHeight} paddingHorizontal={slashPadding} />
      <Text variant={textProps.variant} style={textProps.style}>
        {month}
      </Text>
      <ForwardSlash width={slashWidth} height={slashHeight} paddingHorizontal={slashPadding} />
      <Text variant={textProps.variant} style={textProps.style}>
        {year}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  date: {
    flexDirection: "row",
    alignItems: "center",
  },
});
