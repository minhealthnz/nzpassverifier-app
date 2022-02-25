import { Platform } from "react-native";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { RINGER_MODE, getRingerMode } from "react-native-ringer-mode";

export const enum VibrationType {
  VALID = "soft",
  INVALID = "notificationError",
}

const options = {
  enableVibrateFallback: false, // don't play the fallback 1 second vibration on iOS lower than 10
  ignoreAndroidSystemSettings: true, // always play haptic vibration even if disabled on Android OS setting
};

/**
 * Plays the requested vibration
 * */
const vibrate = (type: VibrationType): void => {
  if (Platform.OS === "ios") {
    ReactNativeHapticFeedback.trigger(type, options);
    return;
  } else {
    void vibrateIfAndroidNotSilent(type);
    return;
  }
};

const vibrateIfAndroidNotSilent = async (type: VibrationType) => {
  // Android needs to check the ringer setting to conform to
  const ringerMode = await getRingerMode();
  if (ringerMode === RINGER_MODE.silent) {
    return;
  }
  ReactNativeHapticFeedback.trigger(type, options);
};

/**
 * A service for playing vibrations
 */
export const vibrationService = {
  vibrate,
};
