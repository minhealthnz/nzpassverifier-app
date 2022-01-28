import { createSlice } from "@reduxjs/toolkit";
import { doRecordAnalyticsFirstUse } from "..";
import { AnalyticsState } from "./types";

// Define the initial state using that type
const initialState: AnalyticsState = {
  appHasFirstLaunched: false,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(doRecordAnalyticsFirstUse.fulfilled, (mutableState) => {
      mutableState.appHasFirstLaunched = true;
    });
  },
  reducers: {},
});

export const analyticsReducer = analyticsSlice.reducer;
export const analyticsActions = analyticsSlice.actions;
