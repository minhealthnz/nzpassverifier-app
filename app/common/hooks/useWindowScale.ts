import { useWindowDimensions } from "react-native";
import { useCallback } from "react";

/**
 * Used to calculate a scaling ratio for devices bigger and smaller than this.
 * This is the reference height, layout gets scaled if device height doesn't match this.
 */
const REFERENCE_DEVICE_HEIGHT = 880;
/**
 * Used to calculate a scaling ratio for devices bigger and smaller than this.
 * This is the reference width, layout gets scaled if device width doesn't match this.
 */
const REFERENCE_DEVICE_WIDTH = 400;

export type ScaleVertical = (size: number) => number;
export type ScaleHorizontal = (size: number) => number;
export type ScaleFont = (size: number) => number;
export type ScaleImage = (size: number) => number;

export type WindowScaleFunctions = {
  readonly scaleVertical: ScaleVertical;
  readonly scaleHorizontal: ScaleHorizontal;
  readonly scaleFont: ScaleFont;
  readonly scaleImage: ScaleImage;
};
/**
 * Scaling functions used to scale layout and font based on device screen size
 */
export const useWindowScale = (): WindowScaleFunctions => {
  const { height, width } = useWindowDimensions();

  const scaleVertical = useCallback(
    (size: number) => {
      return (height / REFERENCE_DEVICE_HEIGHT) * size;
    },
    [height]
  );

  const scaleHorizontal = useCallback(
    (size: number) => {
      return (width / REFERENCE_DEVICE_WIDTH) * size;
    },
    [width]
  );

  const scaleFont = useCallback(
    (size: number) => {
      return Math.max(scaleVertical(size), size);
    },
    [scaleVertical]
  );

  const scaleImage = scaleVertical;

  return { scaleVertical, scaleHorizontal, scaleFont, scaleImage };
};
