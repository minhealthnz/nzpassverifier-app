import React, { useMemo } from "react";
import LottieView, { AnimatedLottieViewProps } from "lottie-react-native";
import { StyleSheet, View } from "react-native";
import { Text, useWindowScale, ScaleImage } from "../../../common";

export type ResultHeaderProps = {
  readonly title: string;
  readonly titleColor: string;
  readonly lottieImage: AnimatedLottieViewProps["source"];
};
/**
 * Component to be used for verification headers
 *
 * @param props - {@link ResultHeaderProps}
 */
export const ResultHeader: React.FC<ResultHeaderProps> = (props) => {
  const { scaleImage } = useWindowScale();
  const styles = useMemo(() => createStyles(props.titleColor, scaleImage), [props.titleColor, scaleImage]);

  return (
    <View style={styles.container}>
      <LottieView style={styles.lottie} autoPlay loop={false} source={props.lottieImage} />
      <Text variant={"h1"} style={styles.title}>
        {props.title}
      </Text>
    </View>
  );
};

const createStyles = (titleColor: string, scaleImage: ScaleImage) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    title: {
      flexWrap: "wrap",
      flex: 1,
      marginLeft: 20,
      textAlign: "right",
      color: titleColor,
      paddingBottom: 0, // override default
    },
    lottie: {
      // Lottie will respect aspect ratio and scale height accordingly
      width: scaleImage(88),
    },
  });
