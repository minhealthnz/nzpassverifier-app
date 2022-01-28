export type IssuerCachingState = {
  readonly cachedIssuers?: Record<string, CachedIssuer>;
  readonly lastRefreshTimestamp?: number;
};

export type CachedIssuer = {
  /**
   * Expiration time, in milliseconds.
   */
  readonly ttl: number;
  /**
   * Last updated timestamp, in milliseconds.
   */
  readonly updatedTimestamp: number;
  /**
   * Resolved issuer document.
   */
  readonly value: unknown;
};
