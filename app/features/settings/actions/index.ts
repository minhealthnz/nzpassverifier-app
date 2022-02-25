import {
  Audios,
  audioService,
  createAppAction,
  createAppAsyncThunk,
  vibrationService,
  VibrationType,
} from "../../../common";

/**
 * Action that toggles the camera type
 */
export const doToggleCameraType = createAppAction("settings/doToggleCameraType");

/**
 * Action that toggles the audio on/off
 */
export const doToggleAudio = createAppAsyncThunk<boolean>("settings/doToggleAudio", (options, thunkAPI) => {
  // TODO(DEBT-011): Move audio service calls to scan screen container/presenter once we have proper state reactive action handling
  const newIsAudioOn = !thunkAPI.getState().settings.isAudioOn;
  newIsAudioOn && audioService.playSound(Audios.ACTIVATED);
  return newIsAudioOn;
});

/**
 * Action that toggles the vibration on/off
 */
export const doToggleVibration = createAppAsyncThunk<boolean>("settings/doToggleVibration", (options, thunkAPI) => {
  const newIsVibrationOn = !thunkAPI.getState().settings.isVibrationOn;
  newIsVibrationOn && vibrationService.vibrate(VibrationType.VALID);
  return newIsVibrationOn;
});
