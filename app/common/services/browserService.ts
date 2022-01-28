import { Linking } from "react-native";
import { BrowserService } from "./types";

/**
 * Opens a link in device browser
 *
 *  @param url - url to open
 */
const open = async (url: string): Promise<void> => {
  await Linking.openURL(url);
};

/**
 * A service for opening links in the device browser
 */
export const browserService: BrowserService = {
  open,
};
