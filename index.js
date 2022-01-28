/**
 * Required for react-navigation stack navigator
 *
 * @see https://reactnavigation.org/docs/stack-navigator/#installation
 */
import "react-native-gesture-handler";
import { AppRegistry } from "react-native";

import "./app/translations/i18n";

import App from "./app/App";
import { name as appName } from "./app.json";

AppRegistry.registerComponent(appName, () => App);
