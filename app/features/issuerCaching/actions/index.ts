import NetInfo from "@react-native-community/netinfo";
import { Cache } from "@mattrglobal/vc-cwt-verifier";

import { createAppAsyncThunk, createAppAction, withAppAsyncThunkAPI } from "../../../common";
import { CachedIssuer } from "../state";
import { RefreshCachedIssuerStatus, issuerCachingService } from "../services";

/**
 * A reducer action to persist the resolved issuer into the store state
 */
type DoSetCachedIssuerOptions = { readonly key: string; readonly value: CachedIssuer };
export const doSetCachedIssuer = createAppAction<DoSetCachedIssuerOptions>("issuerCaching/setCachedIssuer");

/**
 * A reducer action to remove a cached issuer from the store
 */
type DoDeleteCachedIssuerOptions = { readonly key: string };
export const doDeleteCachedIssuer = createAppAction<DoDeleteCachedIssuerOptions>("issuerCaching/deleteCachedIssuer");

/**
 * A reducer action to notify the issuer cache had been refreshed
 */
export type DoSetIssuerCacheUpdatedOptions = { readonly lastRefreshTimestamp: number };
export const doSetIssuerCacheUpdated = createAppAction<DoSetIssuerCacheUpdatedOptions>(
  "issuerCaching/setIssuerCacheUpdated"
);

/**
 * A thunk action to initialize the triggers for refreshing issuer cache.
 *
 * @remarks
 * This action should only be invoked once when launching the app
 */
export const doSetupCacheRefresh = createAppAsyncThunk("issuerCaching/setupCacheRefresh", (_options, thunkAPI) => {
  // Refresh cached issuers when network status has changes.
  // Note that this also triggers the initial pull.
  NetInfo.addEventListener((state) => {
    if (!state.isInternetReachable) {
      return;
    }
    void thunkAPI.dispatch(doRefreshIssuerCache());
  });
});

/**
 * A thunk action to trigger cache updates.
 *
 * @remarks
 * This action can be executed as a background task
 */
export const doRefreshIssuerCache = createAppAsyncThunk(
  "issuerCaching/refreshIssuerCache",
  async (_options, thunkAPI) => {
    const { lastRefreshTimestamp } = thunkAPI.getState().issuerCaching;

    // refresh the trusted issuers cache
    const result = await issuerCachingService.refreshCachedIssuers({
      lastRefreshTimestamp: lastRefreshTimestamp,
      issuerCache: buildIssuerCacheFromStore(thunkAPI),
    });

    if (result !== RefreshCachedIssuerStatus.Completed) {
      return;
    }

    // cleanup the expired values from the issuers cache
    const { cachedIssuers } = thunkAPI.getState().issuerCaching;
    Object.entries(cachedIssuers || {}).forEach(([key, value]) => {
      if (value.ttl < Date.now()) {
        thunkAPI.dispatch(doDeleteCachedIssuer({ key }));
        return;
      }
    });

    // mark the operation as completed
    thunkAPI.dispatch(doSetIssuerCacheUpdated({ lastRefreshTimestamp: Date.now() }));
  }
);

/**
 * Helper function that creates an issuer resolver {@link Cache} adapter.
 */
export const buildIssuerCacheFromStore = withAppAsyncThunkAPI((thunkAPI): Cache => {
  return issuerCachingService.buildIssuerCache({
    getCachedItem: (key: string) => {
      // make sure we use the latest state
      const { cachedIssuers } = thunkAPI.getState().issuerCaching;
      return cachedIssuers?.[key];
    },
    setCachedItem: (key: string, value: CachedIssuer) => {
      thunkAPI.dispatch(doSetCachedIssuer({ key, value }));
    },
  });
});
