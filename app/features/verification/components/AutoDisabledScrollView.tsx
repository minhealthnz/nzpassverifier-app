import React, { PropsWithChildren, useCallback, useEffect, useState } from "react";
import { LayoutChangeEvent, ScrollViewProps } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

/**
 * ScrollView that automatically disables/enables scrollability based on content size
 *
 * @param props - {@link ScrollViewProps}
 */
export const AutoDisabledScrollView: React.FC<PropsWithChildren<ScrollViewProps>> = (props) => {
  const [isContentBigger, setIsContentBigger] = useState(false);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (!scrollViewHeight) return;
    if (!contentHeight) return;
    const diff = contentHeight - scrollViewHeight;
    setIsContentBigger(diff > 0);
  }, [scrollViewHeight, contentHeight]);

  const onLayout = useCallback(({ nativeEvent }: LayoutChangeEvent) => {
    setScrollViewHeight(nativeEvent.layout.height);
  }, []);

  const onContentSizeChange = useCallback((width: number, height: number) => {
    setContentHeight(height);
  }, []);

  return (
    <ScrollView
      scrollEnabled={isContentBigger}
      onLayout={onLayout}
      onContentSizeChange={onContentSizeChange}
      {...props}
    />
  );
};
