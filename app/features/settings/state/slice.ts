import { createSlice } from "@reduxjs/toolkit";
import { doToggleCameraType, doToggleAudio } from "../actions";
import { SettingsState } from "./types";

const initialState: SettingsState = {
  isFrontCamera: false,
  isAudioOn: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doToggleCameraType, (mutableState) => {
      mutableState.isFrontCamera = !mutableState.isFrontCamera;
    });
    builder.addCase(doToggleAudio.fulfilled, (mutableState, action) => {
      mutableState.isAudioOn = action.payload;
    });
  },
});

export const settingsReducer = settingsSlice.reducer;
export const settingsActions = settingsSlice.actions;
