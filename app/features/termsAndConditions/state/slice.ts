import { createSlice } from "@reduxjs/toolkit";
import { TermsAndConditionsState } from "./types";
import { doAcceptTermsAndConditions } from "../actions";

// Define the initial state using that type
const initialState: TermsAndConditionsState = {
  isLoading: false,
  acceptedVersion: 0,
};

const termsAndConditionsSlice = createSlice({
  name: "termsAndConditions",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(doAcceptTermsAndConditions.pending, (mutableState, _action) => {
      mutableState.isLoading = true;
    });
    builder.addCase(doAcceptTermsAndConditions.fulfilled, (mutableState, action) => {
      mutableState.isLoading = false;
      mutableState.acceptedVersion = action.payload;
    });
  },
  reducers: {},
});

export const termsAndConditionsReducer = termsAndConditionsSlice.reducer;
export const termsAndConditionsActions = termsAndConditionsSlice.actions;
