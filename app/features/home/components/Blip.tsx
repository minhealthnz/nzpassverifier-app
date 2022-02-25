import React, { useMemo } from "react";
import { StyleSheet } from "react-native";
import { SvgProps } from "react-native-svg";
import { themeTokens, useWindowScale, WindowScaleFunctions } from "../../../common";

import { GreenBlip, RedBlip, YellowBlip } from "../assets";

export type BlipProps = {
  readonly type: "green" | "yellow" | "red";
};

/**
 * Blip with different styles
 */
export const Blip: React.FC<BlipProps> = (props) => {
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  const BlipComponent = useMemo((): React.FC<SvgProps> => {
    switch (props.type) {
      case "green":
        return GreenBlip;
      case "yellow":
        return YellowBlip;
      case "red":
        return RedBlip;
    }
  }, [props.type]);

  return <BlipComponent {...styles.blip} />;
};

const createStyles = ({ scaleFont }: WindowScaleFunctions) =>
  StyleSheet.create({
    blip: {
      // We need to scale svg same as font is scaled
      width: scaleFont(themeTokens.alertBlip.width.value),
      height: scaleFont(themeTokens.alertBlip.height.value),
    },
  });
