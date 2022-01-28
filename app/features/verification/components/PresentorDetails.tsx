import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { themeTokens, Text, useWindowScale, WindowScaleFunctions, HorizontalRule, TextProps } from "../../../common";
import { ForwardSlash, ForwardSlashProps } from ".";
import { DateStrings } from "../state";

export type PresentorDetailsProps = {
  readonly familyName?: string;
  readonly givenName: string;
  readonly dob: DateStrings;
  readonly expiry: DateStrings;
};

/**
 * Component to render NZCP details
 *
 * @param props - {@link PresentorDetailsProps}
 */
export const PresentorDetails: React.FC<PresentorDetailsProps> = (props) => {
  const { t } = useTranslation();
  const scalingFunctions = useWindowScale();

  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  const renderDate = (dateStrings: DateStrings, textProps: TextProps, slashProps: ForwardSlashProps) => {
    const { day, month, year } = dateStrings;
    const { width: slashWidth, height: slashHeight } = slashProps;
    return (
      <View style={styles.date}>
        <Text variant={textProps.variant} style={styles.datePadding}>
          {day}
        </Text>
        <View style={styles.forwardSlashPadding}>
          <ForwardSlash width={slashWidth} height={slashHeight} />
        </View>
        <Text variant={textProps.variant} style={styles.datePadding}>
          {month}
        </Text>
        <View style={styles.forwardSlashPadding}>
          <ForwardSlash width={slashWidth} height={slashHeight} />
        </View>
        <Text variant={textProps.variant} style={styles.datePadding}>
          {year}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {props.familyName && (
        <View>
          <Text variant={"label"}>{t("verification:presentorDetail:familyName")}</Text>
          <Text variant={"attribute"}>{props.familyName}</Text>
          <View style={styles.itemSpacer} />
        </View>
      )}
      <View>
        <Text variant={"label"} accessibilityLabel={t("verification:accessibility:firstNames")}>
          {t("verification:presentorDetail:firstNames")}
        </Text>
        <Text variant={"attribute"}>{props.givenName}</Text>
        <View style={styles.itemSpacer} />
      </View>
      <View>
        <Text variant={"label"}>{t("verification:presentorDetail:dob")}</Text>
        {renderDate(props.dob, dobTextProps, dobSlashProps)}
        <Text variant={"detail"} accessibilityLabel={t("verification:accessibility:ddmmyyy")}>
          {t("verification:presentorDetail:ddmmyyyy")}
        </Text>
        <View style={styles.itemSpacer} />
      </View>
      <HorizontalRule style={styles.horizontalRule} />
      <View>
        <View style={styles.itemSpacer} />
        <Text variant={"label"}>{t("verification:presentorDetail:certificateExpiryDate")}</Text>
        {renderDate(props.expiry, expiryTextProps, expirySlashProps)}
        <View style={styles.itemSpacer} />
      </View>
    </View>
  );
};

const dobTextProps: TextProps = { variant: "attribute" };
const expiryTextProps: TextProps = { variant: "h1" };
const dobSlashProps: ForwardSlashProps = { width: 11, height: 34 };
const expirySlashProps: ForwardSlashProps = { width: 9, height: 26 };

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleVertical, scaleHorizontal } = scalingFunctions;
  return StyleSheet.create({
    container: {
      paddingVertical: scaleVertical(themeTokens.spacing.vertical.xl.value),
      paddingHorizontal: scaleHorizontal(themeTokens.spacing.horizontal.xl.value),
      backgroundColor: themeTokens.color.base.white.value,
    },
    itemSpacer: {
      height: themeTokens.spacing.vertical.large.value,
    },
    date: {
      flexDirection: "row",
      alignItems: "center",
    },
    datePadding: {
      paddingTop: themeTokens.spacing.vertical.small.value,
      paddingBottom: themeTokens.spacing.vertical.small.value,
    },
    forwardSlashPadding: {
      paddingHorizontal: themeTokens.spacing.vertical.small.value + themeTokens.spacing.vertical.tiny.value,
    },
    horizontalRule: {
      height: 1,
    },
  });
};
