import React, { useEffect, useState, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { themeTokens } from "../../../common";

export type DotsProps = {
  /**
   * Specifies which dot is active. This should be a number between 0 and "number of dots" - 1.
   * The default is 0 when not defined or for out of range values.
   */
  readonly activeDot?: number;

  /**
   * The number of dots.
   */
  readonly numberOfDots: number;
};

/**
 * A simple dots pagination component
 *
 * @param props - {@link DotsProps}
 */
export const Dots: React.FC<DotsProps> = (props) => {
  const { activeDot, numberOfDots } = props;
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    setActive(activeDot && activeDot < numberOfDots ? activeDot : 0);
  }, [activeDot, numberOfDots]);

  const dots = useMemo(
    () =>
      new Array(numberOfDots)
        .fill(0)
        .map((_, index) => <View key={index} style={index === active ? styles.active : styles.passive} />),
    [numberOfDots, active]
  );

  return (
    <View style={styles.wrapper}>
      <>{dots}</>
    </View>
  );
};

const dotStyle = {
  borderRadius: 4,
  width: 8,
  height: 8,
  margin: 4,
};

const styles = StyleSheet.create({
  wrapper: { justifyContent: "center", flexDirection: "row" },
  active: {
    ...dotStyle,
    backgroundColor: themeTokens.color.main["primary-500"].value,
  },
  passive: {
    ...dotStyle,
    backgroundColor: themeTokens.color.main["primary-100"].value,
  },
});
