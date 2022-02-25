import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Text, themeTokens, useWindowScale, WindowScaleFunctions } from "../../../common";
import { Blip, BlipProps } from "./Blip";
import { CacheInfoStatus, CacheStatusDetails } from "../utilities";
import { isToday, format, formatDistanceToNowStrict } from "date-fns";

export type OfflineRecordsStatusProps = {
  readonly cacheStatusDetails: CacheStatusDetails;
};

/**
 * Component displaying issuer cache status
 *
 * @param props - {@link OfflineRecordsStatusProps}
 */
export const OfflineRecordsStatus: React.FC<OfflineRecordsStatusProps> = (props) => {
  const { cacheStatusDetails } = props;
  const { t } = useTranslation("home");
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  const { blipType, infoMessage } = useMemo((): {
    readonly blipType: BlipProps["type"];
    readonly infoMessage: string;
  } => {
    switch (cacheStatusDetails.status) {
      case CacheInfoStatus.upToDate:
        return { blipType: "green", infoMessage: t("cacheUpToDate") };
      case CacheInfoStatus.recentlyUpdated:
        return {
          blipType: "green",
          infoMessage: t("cacheRecentlyUpdated", {
            daysString: formatDistanceToNowStrict(cacheStatusDetails.lastCacheUpdate, { unit: "day" }),
          }),
        };
      case CacheInfoStatus.needsUpdateSoon:
        return {
          blipType: "yellow",
          infoMessage: t("cacheNeedsToBeUpdatedWithInXDays", {
            daysString: formatDistanceToNowStrict(cacheStatusDetails.cacheInvalidDate, { unit: "day" }),
          }),
        };
      case CacheInfoStatus.needsImmediateUpdate:
        const { cacheInvalidDate } = cacheStatusDetails;
        return {
          blipType: "red",
          infoMessage: t("cacheNeedsImmediateUpdate", {
            twentyFourHourTimeString: format(cacheInvalidDate, "HH:mm"),
            dayNoun: isToday(cacheInvalidDate) ? "today" : "tomorrow",
          }),
        };
    }
  }, [cacheStatusDetails, t]);

  return (
    <View style={styles.container}>
      <Blip type={blipType} />
      <Text style={styles.text}>{infoMessage}</Text>
    </View>
  );
};

const createStyles = ({ scaleVertical }: WindowScaleFunctions) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
    },
    text: {
      textAlign: "center",
      paddingTop: scaleVertical(themeTokens.spacing.vertical.medium.value),
      paddingBottom: scaleVertical(themeTokens.spacing.vertical.large.value),
    },
  });
