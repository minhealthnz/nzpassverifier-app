import { store } from "./store";

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Inferred type of actions we can dispatch
 */
export type AppDispatch = typeof store.dispatch;
