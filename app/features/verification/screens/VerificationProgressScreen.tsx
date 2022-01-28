import React, { useEffect, useMemo } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ScreenContainer, themeTokens, WindowScaleFunctions, useWindowScale } from "../../../common";
import { PullDownTab } from "../components";
import LoadingSpinner from "../assets/loading.json";
import { Edge } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

export type VerificationProgressScreenProps = {
  readonly handleOnUnmount: () => void;
  readonly handleOnMount: () => void;
};

/**
 * A screen displaying the progress of verification
 *
 * @param props - {@link VerificationProgressScreenProps}
 *
 * @remarks The screen is responsible for initiating the verification on first render within useEffect
 */
export const VerificationProgressScreen: React.FC<VerificationProgressScreenProps> = (props) => {
  const { handleOnUnmount, handleOnMount } = props;
  const navigation = useNavigation();
  const scalingFunctions = useWindowScale();
  const styles = useMemo(() => createStyles(scalingFunctions), [scalingFunctions]);

  // Don't include top safeArea on iOS as sheet modal is not completely fullscreen
  const safeAreaEdges: readonly Edge[] | undefined = useMemo(
    () => (Platform.OS === "ios" ? ["left", "right", "bottom"] : undefined),
    []
  );

  useEffect(() => {
    /*
     * Don't fire on mount until navigation is completed, hanldeOnMount triggers navigation action
     * so we need to wait until navigator is ready. useFocusEffect() doesn't provide this expected behaviour
     * TODO(DEBT-007): Remove focus listener once result screens are merged together
     */
    const unsubscribe = navigation.addListener("focus", () => {
      handleOnMount();
    });

    return () => {
      unsubscribe();
      handleOnUnmount();
    };
  }, [navigation, handleOnUnmount, handleOnMount]);

  return (
    <ScreenContainer safeAreaEdges={safeAreaEdges} isSensitiveView statusBarStyle={"light-content"}>
      <View style={styles.container}>
        <View style={styles.pullDownBarContainer}>
          <PullDownTab color={styles.pullDownTab.color} />
        </View>
        <View style={styles.content}>
          <LottieView source={LoadingSpinner} autoPlay loop style={styles.lottieAnimationView} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const createStyles = (scalingFunctions: WindowScaleFunctions) => {
  const { scaleImage } = scalingFunctions;
  return {
    ...StyleSheet.create({
      container: {
        flex: 1,
        width: "100%",
      },
      content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      pullDownBarContainer: {
        paddingVertical: themeTokens.spacing.vertical.large.value,
      },
      lottieAnimationView: {
        // Lottie will respect aspect ratio and scale height accordingly
        width: scaleImage(88),
      },
      pullDownTab: {
        color: themeTokens.color.alert.fail[500].value,
      },
    }),
  };
};
