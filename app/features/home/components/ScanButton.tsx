import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, Text, Animated, Easing } from "react-native";
import { createConditionalStyle, themeTokens } from "../../../common";
import { useFocusEffect } from "@react-navigation/native";
import { AnimatedTouchableWithoutFeedback } from "./AnimatedTouchableWithoutFeedback";

export type ScanButtonProps = {
  readonly title: string;
  readonly accessibilityLabel: string;
  readonly accessibilityHint?: string;
  readonly onPress: () => void;
};

/**
 * How long it takes from the beacon to get from the button edges to the maximum distance
 */
const beaconAnimationDuration = 1000;
/**
 * How often the beacon animation waits between plays
 */
const beaconAnimationDelay = 3000;

/**
 * A large circular button used to start scanning that scales when pressed in and beacons on idle
 *
 * @param props - button title and action
 */
export const ScanButton: React.FC<ScanButtonProps> = (props) => {
  const { title, onPress, accessibilityHint, accessibilityLabel } = props;

  const [isActive, setIsActive] = useState(false);

  const scanButtonStyle = useMemo(
    () =>
      createConditionalStyle(styles, {
        scanButton: true,
        scanButtonActive: isActive,
      }),
    [isActive]
  );

  /**
   * Animated values required to create the beacon
   */
  const beaconProgress = useMemo(() => new Animated.Value(0), []);
  const animatedOverlayScale = useMemo(
    () => beaconProgress.interpolate({ inputRange: [0, 100], outputRange: [1, 1.3] }),
    [beaconProgress]
  );
  const animatedOverlayOpacity = useMemo(
    () => beaconProgress.interpolate({ inputRange: [0, 100], outputRange: [1, 0] }),
    [beaconProgress]
  );

  /**
   * Animate the scale and opacity in parallel to create a beacon
   */
  const beaconAnimation = useMemo(
    () =>
      Animated.loop(
        Animated.timing(beaconProgress, {
          useNativeDriver: false,
          toValue: 100,
          easing: Easing.ease,
          duration: beaconAnimationDuration,
          delay: beaconAnimationDelay,
        })
      ),
    [beaconProgress]
  );

  const animatedButtonScale = useMemo(() => new Animated.Value(1), []);
  const animatedShadowRadius = useMemo(
    () =>
      animatedButtonScale.interpolate({
        inputRange: [0.95, 1],
        outputRange: [styles.scanButton.shadowRadius / 3, styles.scanButton.shadowRadius],
      }),
    [animatedButtonScale]
  );
  const springButtonIn = Animated.spring(animatedButtonScale, {
    velocity: -1,
    toValue: 0.95,
    useNativeDriver: false,
  });
  const springButtonOut = Animated.spring(animatedButtonScale, {
    velocity: 1,
    overshootClamping: true,
    toValue: 1,
    useNativeDriver: false,
  });

  /**
   * Start the beacon when this screen is focused
   */
  useFocusEffect(
    useCallback(() => {
      beaconProgress.setValue(0);
      beaconAnimation.start();
      return beaconAnimation.reset;
    }, [beaconAnimation, beaconProgress])
  );

  const handlePressIn = useCallback(() => {
    springButtonIn.start();
    setIsActive(true);
  }, [springButtonIn]);

  const handlePressOut = useCallback(() => {
    springButtonOut.start();
    setIsActive(false);
  }, [springButtonOut]);

  const handlePress = useCallback(() => {
    onPress();
  }, [onPress]);

  const beaconOverlay = useMemo(
    () => (
      <Animated.View
        pointerEvents={"none"}
        style={[
          styles.beaconOverlay,
          {
            transform: [{ scaleX: animatedOverlayScale }, { scaleY: animatedOverlayScale }],
            opacity: animatedOverlayOpacity,
          },
        ]}
      />
    ),
    [animatedOverlayOpacity, animatedOverlayScale]
  );

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ scaleX: animatedButtonScale }, { scaleY: animatedButtonScale }],
        },
      ]}
    >
      <AnimatedTouchableWithoutFeedback
        style={[
          scanButtonStyle,
          {
            shadowRadius: animatedShadowRadius,
            elevation: animatedShadowRadius,
          },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole={"button"}
      >
        <Text style={styles.scanText}>{title}</Text>
      </AnimatedTouchableWithoutFeedback>
      {beaconOverlay}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  /**
   * A wrapper to contain the button in order to avoid moving around any flex it may be contained in as an animation that changes the size takes place
   * The beacon border overflowing is considered overflow of this component
   */
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
    width: themeTokens.size.scanbutton.width.value,
    height: themeTokens.size.scanbutton.height.value,
    overflow: "visible",
  },
  scanText: {
    color: themeTokens.color.button.text.white.value,
    fontSize: themeTokens.typography.Scan.fontSize.value,
    letterSpacing: themeTokens.typography.Scan.letterSpacing.value,
    fontFamily: themeTokens.typography.Scan.fontFamily.value,
    textAlign: "center",
    // PaddingLeft b/c the letterSpacing gets applied to the last character resulting in off centered word
    paddingLeft: themeTokens.letterSpacing.scan.value,
  },
  scanButton: {
    shadowOpacity: 0.5,
    shadowColor: "grey",
    shadowRadius: themeTokens.shadow["soft-shadow"].value.spread,
    elevation: themeTokens.shadow["soft-shadow"].value.spread,
    shadowOffset: {
      width: themeTokens.shadow["soft-shadow"].value.x,
      height: themeTokens.shadow["soft-shadow"].value.y,
    },
    backgroundColor: themeTokens.color.button.primary.enabled.value,
    borderColor: themeTokens.color.main["primary-100"].value,
    borderWidth: themeTokens.borderWidth.button.scan.value,
    height: themeTokens.size.scanbutton.height.value,
    width: themeTokens.size.scanbutton.width.value,
    borderRadius: themeTokens.borderRadius.button.scan.value,
    opacity: 1,
    justifyContent: "center",
  },
  scanButtonActive: {
    backgroundColor: themeTokens.color.button.primary.pressed.value,
  },
  beaconOverlay: {
    position: "absolute",
    backgroundColor: "transparent",
    borderColor: themeTokens.color.main["primary-100"].value,
    borderWidth: 2,
    height: themeTokens.size.scanbutton.height.value,
    width: themeTokens.size.scanbutton.width.value,
    borderRadius: themeTokens.borderRadius.button.scan.value,
  },
});
