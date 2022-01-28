import path from "path";
import { WebViewSource } from "react-native-webview/lib/WebViewTypes";
import { Platform } from "react-native";
import { DocumentDirectoryPath, MainBundlePath } from "react-native-fs";

/**
 * Get the html asset for web view from specific platform path
 */
export const getWebViewAsset = (assetPath: string): WebViewSource => {
  const filePath = Platform.select<string>({
    ios: path.join(`${MainBundlePath}`, assetPath),
    android: path.join("file:///android_asset", assetPath),
    default: path.join(`${DocumentDirectoryPath}`, assetPath),
  });

  return { uri: filePath };
};
