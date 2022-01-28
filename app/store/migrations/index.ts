import { MigrationManifest } from "redux-persist/es/types";
import { migration1 } from "./1";

/**
 * A map of the version number and the migration script to get from the previous version to the new version
 */
export const migrations: MigrationManifest = {
  /**
   * A placeholder for the first migration
   * Once store version is set to 1, this will execute on all stores with the old version 0
   */
  "1": migration1,
};
