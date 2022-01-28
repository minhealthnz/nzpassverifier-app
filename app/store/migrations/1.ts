import { StateMigrationFn } from "./types";

/**
 * A placeholder for the first migration function
 *
 * @param state - The previous state
 */
export const migration1: StateMigrationFn = (state) => {
  return { ...state, _persist: { version: 1, rehydrated: false } };
};
