import { createIconSetFromIcoMoon } from "react-native-vector-icons";

import icoMoonSelection from "./selection.json";

/**
 * A component for displaying icons based on a selection of exported icons from icomoon
 */
export const Icon = createIconSetFromIcoMoon(icoMoonSelection, "icomoon", "icomoon.ttf");
