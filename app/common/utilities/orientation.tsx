import { useEffect, useState } from "react";
import { Dimensions, ScaledSize } from "react-native";

export const enum Orientation {
  Portrait = "Portrait",
  Landscape = "Landscape",
}

/**
 * Helper function to reuse logic orientation calculation for
 * the initial orientation calculation and on change
 *
 * @param width - width dimension from {@link ScaledSize}
 * @param height - height dimension from {@link ScaledSize}
 */
const getOrientation = ({ width, height }: ScaledSize) =>
  width < height ? Orientation.Portrait : Orientation.Landscape;

/**
 * A simple hook that returns the devices current orientation & reacts to changes in orientation
 */
export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(getOrientation(Dimensions.get("window")));

  useEffect(() => {
    const changeListener = Dimensions.addEventListener("change", ({ window }) =>
      setOrientation(getOrientation(window))
    );
    return () => changeListener.remove();
  }, []);

  return orientation;
};
