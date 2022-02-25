import React from "react";
import { Modal as ReactNativeModal, SafeAreaView, StyleSheet, View } from "react-native";
import { ButtonBar } from "./ButtonBar";
import { IconButton } from "./IconButton";
import { themeTokens } from "../theme";
import { IconName } from "./Icon";
import { useTranslation } from "react-i18next";
import { Text } from "./Text";

export type ModalProps = {
  readonly visible: boolean;
  readonly onPressClose: () => void;
  readonly title: string;
};

/**
 * A simple modal component wrapping the default react native modal that is reused throughout designs
 *
 * @remarks
 * Before using this component consider if it is more useful to be a react-navigation route
 * with presentation "transparentModal" instead
 *
 * @see DEBT-001
 *
 * @param props - {@link ModalProps}
 */
export const Modal: React.FC<ModalProps> = (props) => {
  const { visible, onPressClose, title, children } = props;
  const { t } = useTranslation();

  return (
    <ReactNativeModal
      transparent={true}
      visible={visible}
      animationType={"slide"}
      supportedOrientations={["portrait", "landscape"]}
    >
      <SafeAreaView>
        <View style={styles.wrapper}>
          <View style={styles.card}>
            <View style={styles.header}>
              <Text variant={"h1"}>{title}</Text>
            </View>
            <View style={styles.body}>{children}</View>
            <ButtonBar>
              <IconButton
                onPress={onPressClose}
                iconName={IconName.closePrimary}
                accessibilityLabel={t("common:close")}
              />
            </ButtonBar>
          </View>
        </View>
      </SafeAreaView>
    </ReactNativeModal>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: themeTokens.spacing.horizontal.medium.value,
    paddingVertical: themeTokens.spacing.vertical.medium.value,
    height: "100%",
  },
  card: {
    flex: 1,
    borderRadius: themeTokens.borderRadius.medium.value,
    shadowColor: "black",
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
    color: "black",
    backgroundColor: themeTokens.color.base.white.value,
  },
  body: {
    borderRadius: themeTokens.borderRadius.medium.value,
    position: "relative",
    flex: 1,
  },
  header: {
    paddingTop: themeTokens.spacing["modal-padding"].medium.value,
    paddingHorizontal: themeTokens.spacing["modal-padding"].medium.value,
  },
});
