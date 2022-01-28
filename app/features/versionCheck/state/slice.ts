import { createSlice } from "@reduxjs/toolkit";
import { VersionCheckState, VersionCheckStatus } from "./types";
import { doSetVersionCheckResult } from "../actions";

// Define the initial state using that type
const initialState: VersionCheckState = {
  lastVersionCheckAt: 0,
};

const versionCheckSlice = createSlice({
  name: "versionCheck",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(doSetVersionCheckResult, (mutableState, action) => {
      mutableState.isUpdateNeeded = action.payload.isUpdateNeeded;
      mutableState.currentVersion = action.payload.currentVersion;
      mutableState.versionUpdateUrl = action.payload.versionUpdateUrl;

      if (action.payload.status === VersionCheckStatus.Success) {
        mutableState.lastSuccessCheckAt = action.payload.lastSuccessCheckAt;
        mutableState.lastVersionCheckAt = action.payload.lastVersionCheckAt;
        return;
      }
      if (action.payload.status === VersionCheckStatus.Failure) {
        mutableState.lastVersionCheckAt = action.payload.lastVersionCheckAt;
        return;
      }
    });
  },
  reducers: {},
});

export const versionCheckReducer = versionCheckSlice.reducer;
export const versionCheckActions = versionCheckSlice.actions;
