import { createSlice } from "@reduxjs/toolkit";
import { VerificationState } from "./types";
import { doSetVerifyResult, doVerifyPayload } from "../actions";

const initialState: VerificationState = {
  isLoading: false,
  result: undefined,
};

const verificationSlice = createSlice({
  name: "verification",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(doVerifyPayload.pending, (mutableState, _action) => {
      mutableState.isLoading = true;
      mutableState.result = undefined;
    });
    builder.addCase(doVerifyPayload.rejected, (mutableState, _action) => {
      mutableState.isLoading = false;
      mutableState.result = undefined;
    });
    builder.addCase(doVerifyPayload.fulfilled, (mutableState, _action) => {
      mutableState.isLoading = false;
    });
    builder.addCase(doSetVerifyResult, (mutableState, action) => {
      mutableState.result = action.payload;
    });
  },
  reducers: {},
});

export const verificationReducer = verificationSlice.reducer;
export const verificationActions = verificationSlice.actions;
