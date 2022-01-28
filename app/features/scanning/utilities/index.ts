import { LayoutRectangle } from "react-native";

/**
 * Gets the barcode finders width and height based on the views layout dimensions
 *
 * @param layout - layout of the view which the finder size should be based on
 * @param finderPadding - padding of the finders square
 */
export const getBarcodeFinderSize = (layout: LayoutRectangle, finderPadding: number): number => {
  // The bar code finder should be a square that is padded from the edge of the screen
  const paddingBothSides = finderPadding * 2;

  const maxBarcodeFinderHeight = layout.height - paddingBothSides;
  const maxBarcodeFinderWidth = layout.width - paddingBothSides;

  // Get smallest side to create a square that fits within both dimensions
  return Math.min(maxBarcodeFinderWidth, maxBarcodeFinderHeight);
};
