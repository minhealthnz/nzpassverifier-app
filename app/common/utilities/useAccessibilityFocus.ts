import { MutableRefObject, useRef, useCallback } from "react";
import { AccessibilityInfo, findNodeHandle } from "react-native";

/**
 * If VoiceOver/TalkBack screen reader is enabled, focuses onto the component with the ref object
 * when the setFocus function is called
 */
export const useAccessibilityFocus = (): readonly [MutableRefObject<null>, () => void] => {
  const ref = useRef(null);

  const setAccessibilityFocusIfReaderOn = async (reactTag: number) => {
    const isReaderOn = await AccessibilityInfo.isScreenReaderEnabled();
    isReaderOn && AccessibilityInfo.setAccessibilityFocus(reactTag);
  };

  const setFocus = useCallback(() => {
    const focusPoint = findNodeHandle(ref.current);
    if (!focusPoint) {
      return;
    }

    // setAccessibilityFocus() doesn't work reliably it is fired immediately, so it needs a short timer to trigger it
    const timer = setTimeout(() => {
      void setAccessibilityFocusIfReaderOn(focusPoint);
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [ref]);

  return [ref, setFocus];
};
