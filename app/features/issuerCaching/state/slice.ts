import { createSelector, createSlice } from "@reduxjs/toolkit";
import { IssuerCachingState } from "./types";
import { doSetCachedIssuer, doDeleteCachedIssuer, doSetIssuerCacheUpdated } from "../actions";
import { RootState } from "../../../store";

const initialState: IssuerCachingState = {};

const issuerCachingSlice = createSlice({
  name: "issuerCaching",
  initialState: initialState,
  extraReducers: (builder) => {
    builder.addCase(doSetCachedIssuer, (mutableState, action) => {
      mutableState.cachedIssuers = {
        ...mutableState.cachedIssuers,
        [action.payload.key]: action.payload.value,
      };
    });
    builder.addCase(doSetIssuerCacheUpdated, (mutableState, action) => {
      mutableState.lastRefreshTimestamp = action.payload.lastRefreshTimestamp;
    });
    builder.addCase(doDeleteCachedIssuer, (mutableState, action) => {
      delete mutableState.cachedIssuers?.[action.payload.key];
    });
  },
  reducers: {},
});

const selectCachedIssuers = (state: RootState) => state.issuerCaching.cachedIssuers;

/**
 * Calculate the maximum updated timestamp among cached issuers in the store
 *
 * @remarks
 * This is used to represent the last cache update
 */
export const selectMaximumCachedIssuersUpdatedTimestamp = createSelector(selectCachedIssuers, (cachedIssuers) => {
  if (cachedIssuers === undefined) {
    return undefined;
  }

  const cachedIssuersValues = Object.values(cachedIssuers);

  if (cachedIssuersValues.length === 0) {
    return undefined;
  }

  return cachedIssuersValues.reduce((maxUpdateTimestamp, item) => {
    return Math.max(maxUpdateTimestamp, item.updatedTimestamp ?? 0);
  }, 0);
});

export const issuerCachingReducer = issuerCachingSlice.reducer;
export const issuerCachingActions = issuerCachingSlice.actions;
