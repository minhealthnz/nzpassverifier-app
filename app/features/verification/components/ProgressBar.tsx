import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { useWindowScale, ScaleVertical, themeTokens } from "../../../common";

/**
 * @param isPaused - used to start and stop animation
 * @param filledColor - progress bar color
 * @param unfilledColor - unfilled color
 * @param animationDuration - duration of the animation
 */
export type ProgressBarProps = {
  readonly isPaused?: boolean;
  readonly filledColor: string;
  readonly unfilledColor?: string;
  readonly initialAnimationDuration?: number;
};

/**
 * Component which renders an animated progress bar
 *
 * @param props - {@link ProgressBarProps}
 */
export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { isPaused = false, filledColor, unfilledColor, initialAnimationDuration = 0 } = props;
  const animatedValRef = useRef(new Animated.Value(0)).current;
  const [animationTimeLeft, setAnimationTimeLeft] = useState(initialAnimationDuration);
  const { scaleVertical } = useWindowScale();

  useEffect(() => {
    if (!isPaused) {
      return Animated.timing(animatedValRef, {
        toValue: 1,
        duration: animationTimeLeft,
        useNativeDriver: false,
        easing: Easing.linear,
      }).start();
    }
  }, [animationTimeLeft, animatedValRef, isPaused]);

  useEffect(() => {
    if (isPaused) {
      return animatedValRef.stopAnimation((progressVal) => {
        const timeLeft = initialAnimationDuration - initialAnimationDuration * progressVal;
        setAnimationTimeLeft(timeLeft);
      });
    }
  }, [animatedValRef, isPaused, initialAnimationDuration]);

  const styles = useMemo(
    () => createStyles({ filledColor, unfilledColor }, scaleVertical),
    [filledColor, unfilledColor, scaleVertical]
  );

  const interpolatedFlex = useMemo(
    () => animatedValRef.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
    [animatedValRef]
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.filled, { flex: interpolatedFlex }]} />
    </View>
  );
};

const createStyles = (
  customStyles: { readonly filledColor: string; readonly unfilledColor?: string },
  scaleVertical: ScaleVertical
) =>
  StyleSheet.create({
    container: {
      width: "100%",
      height: scaleVertical(24),
      flexDirection: "row",
      backgroundColor: customStyles.unfilledColor,
    },
    filled: {
      backgroundColor: customStyles.filledColor,
      borderTopEndRadius: themeTokens.borderRadius.tiny.value,
      borderBottomEndRadius: themeTokens.borderRadius.tiny.value,
    },
  });
