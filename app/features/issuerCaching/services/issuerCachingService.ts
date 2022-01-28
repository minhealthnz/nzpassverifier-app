import { getDefaultIssuerResolver, Cache } from "@mattrglobal/vc-cwt-verifier";

import { config } from "../../../common";

export const enum RefreshCachedIssuerStatus {
  /**
   * The operation has aborted.
   */
  Skipped = "Skipped",
  /**
   * The operation has completed.
   */
  Completed = "Completed",
}

export type CachedIssuer = {
  /**
   * Expiration time, in milliseconds.
   */
  readonly ttl: number;
  /**
   * Resolved issuer document.
   */
  readonly value: unknown;
  /**
   * Last updated timestamp, in milliseconds.
   */
  readonly updatedTimestamp: number;
};

export type BuildIssuerCacheOptions = {
  readonly setCachedItem: (key: string, value: CachedIssuer) => void;
  readonly getCachedItem: (key: string) => CachedIssuer | undefined;
};

/**
 * Function that returns a {@link Cache} instance for issuer resolution.
 */
export const buildIssuerCache = (options: BuildIssuerCacheOptions): Cache => {
  const { getCachedItem, setCachedItem } = options;

  return {
    set: <T>(key: string, value: T): boolean => {
      const updatedTimestamp = Date.now();
      const ttl = updatedTimestamp + config.ISSUER_CACHE_MAX_AGE_MS;
      setCachedItem(key, { value, ttl, updatedTimestamp });
      return true;
    },
    get: <T>(key: string): T | undefined => {
      const cached = getCachedItem(key);
      if (!cached || cached.ttl < Date.now()) {
        return undefined;
      }
      return cached.value as T;
    },
  };
};

export type RefreshCachedIssuersOptions = {
  /**
   * An instance of the issuer {@link Cache}.
   */
  readonly issuerCache: Cache;
  /**
   * Timestamp of the last refresh execution, milliseconds since epoch. This is used for the backoff
   * mechanism to reduce redundant resolution requests.
   */
  readonly lastRefreshTimestamp?: number;
};

/**
 * Function that resolves public key documents for the trusted issuers. This can be used to proactively
 * refresh the cache for the issuer resolver while connected to the internet.
 *
 * Ignore the returned errors when failed to resolve an issuer.
 */
export const refreshCachedIssuers = async (
  options: RefreshCachedIssuersOptions
): Promise<RefreshCachedIssuerStatus> => {
  const { issuerCache, lastRefreshTimestamp = 0 } = options;
  const { TRUSTED_ISSUER_LIST = [], ISSUER_CACHE_REFRESH_MIN_AGE_MS, ISSUER_RESOLUTION_REQUEST_TIMEOUT_MS } = config;

  if (Date.now() < lastRefreshTimestamp + ISSUER_CACHE_REFRESH_MIN_AGE_MS) {
    return RefreshCachedIssuerStatus.Skipped;
  }

  const issuerResolver = getDefaultIssuerResolver({
    cache: issuerCache,
    timeoutMs: ISSUER_RESOLUTION_REQUEST_TIMEOUT_MS,
  });
  const resolveResults = TRUSTED_ISSUER_LIST.map(async (issuer) => {
    // Refresh the cache value even it hasn't expired yet
    await issuerResolver.cacheIssuer(issuer, { force: true });
  });
  await Promise.all(resolveResults);

  return RefreshCachedIssuerStatus.Completed;
};

export const issuerCachingService = {
  buildIssuerCache,
  refreshCachedIssuers,
};
