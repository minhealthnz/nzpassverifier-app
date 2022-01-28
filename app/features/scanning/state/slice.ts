import { createSlice } from "@reduxjs/toolkit";
import { ScanningState } from "./types";
import { doScan, doSetPayload, doDisableFrontCameraAlerts } from "../actions";

const initialState: ScanningState = {
  payload: undefined,
  isFrontCameraAlertDisabled: false,
};

const scanningSlice = createSlice({
  name: "scan",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(doScan.pending, (mutableState, _action) => {
      mutableState.payload = undefined;
    });
    builder.addCase(doSetPayload, (mutableState, action) => {
      mutableState.payload = action.payload;
    });
    builder.addCase(doDisableFrontCameraAlerts, (mutableState) => {
      mutableState.isFrontCameraAlertDisabled = true;
    });
  },
});

export const scanningReducer = scanningSlice.reducer;
export const scannerActions = scanningSlice.actions;
