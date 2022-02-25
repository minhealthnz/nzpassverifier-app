import { config } from "../../../common";
import { differenceInDays } from "date-fns";

export const enum CacheInfoStatus {
  upToDate = "upToDate",
  recentlyUpdated = "recentlyUpdated",
  needsUpdateSoon = "needsUpdateSoon",
  needsImmediateUpdate = "needsImmediateUpdate",
}

export type CacheUptoDate = {
  readonly status: CacheInfoStatus.upToDate;
};

export type CacheRecentlyUpdated = {
  readonly status: CacheInfoStatus.recentlyUpdated;
  readonly lastCacheUpdate: Date;
};

export type CacheNeedsUpdateSoon = {
  readonly status: CacheInfoStatus.needsUpdateSoon;
  readonly cacheInvalidDate: Date;
};

export type CacheNeedsImmediateUpdate = {
  readonly status: CacheInfoStatus.needsImmediateUpdate;
  readonly cacheInvalidDate: Date;
};

export type CacheStatusDetails =
  | CacheUptoDate
  | CacheRecentlyUpdated
  | CacheNeedsUpdateSoon
  | CacheNeedsImmediateUpdate;

/**
 * Gets the cache info status based on lastCacheUpdate and current time
 */
export const getCurrentCacheStatus = (lastCacheUpdate?: number): CacheStatusDetails => {
  if (!lastCacheUpdate) {
    return { status: CacheInfoStatus.needsImmediateUpdate, cacheInvalidDate: new Date() };
  }
  const cacheInvalidDate = new Date(lastCacheUpdate + config.ISSUER_CACHE_MAX_AGE_MS);
  const daysRemainingToUpdate = differenceInDays(cacheInvalidDate, Date.now());

  // less than 24 hours to update
  if (daysRemainingToUpdate < 1) {
    return { status: CacheInfoStatus.needsImmediateUpdate, cacheInvalidDate };
  }

  // less than 7 days to update
  if (daysRemainingToUpdate < 7) {
    return { status: CacheInfoStatus.needsUpdateSoon, cacheInvalidDate };
  }

  // less than 13 days to update
  if (daysRemainingToUpdate < 13) {
    return { status: CacheInfoStatus.recentlyUpdated, lastCacheUpdate: new Date(lastCacheUpdate) };
  }

  return { status: CacheInfoStatus.upToDate };
};
