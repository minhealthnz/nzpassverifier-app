import { createSlice } from "@reduxjs/toolkit";
import { OnboardingState } from "./types";
import { doCompleteOnboarding } from "../actions";

const initialState: OnboardingState = {
  isComplete: false,
};

const onboardingSlice = createSlice({
  name: "onboarding",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(doCompleteOnboarding.fulfilled, (mutableState) => {
      mutableState.isComplete = true;
    });
  },
  reducers: {},
});

export const onboardingReducer = onboardingSlice.reducer;
export const onboardingActions = onboardingSlice.actions;
