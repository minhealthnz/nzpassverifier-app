import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  createMigrate,
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { PersistConfig } from "redux-persist/es/types";
import { applicationStorage } from "../common";
import { migrations } from "./migrations";
import {
  analyticsReducer,
  scanningReducer,
  termsAndConditionsReducer,
  verificationReducer,
  versionCheckReducer,
  issuerCachingReducer,
  onboardingReducer,
  settingsReducer,
} from "../features";

const scanningPersistConfig = {
  key: "scanning",
  storage: applicationStorage,
  whitelist: ["isFrontCameraAlertDisabled"],
};

const reducers = combineReducers({
  onboarding: onboardingReducer,
  scanning: persistReducer(scanningPersistConfig, scanningReducer),
  verification: verificationReducer,
  termsAndConditions: termsAndConditionsReducer,
  versionCheck: versionCheckReducer,
  issuerCaching: issuerCachingReducer,
  analytics: analyticsReducer,
  settings: settingsReducer,
});
type BaseReducersState = ReturnType<typeof reducers>;

/**
 * Redux state persistence configuration
 *
 * @remarks
 * Any migration less than or equal to version will be run. Keep up to date with the version we want to migrate to.
 * If there is no persisted state stored or version is already up to date, no migrations will be run
 */
const persistConfig: PersistConfig<BaseReducersState> = {
  key: "application-state",
  storage: applicationStorage,
  whitelist: ["onboarding", "termsAndConditions", "versionCheck", "issuerCaching", "analytics", "settings"],
  version: 0,
  migrate: createMigrate(migrations, { debug: true }),
};

const persistedReducer = persistReducer(persistConfig, reducers);

/**
 * The applications redux store
 *
 * @remarks
 * Extra middleware can be added to concat as required.
 * Persist actions are ignored by the store to avoid checking for non serializable values on persist actions
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(),
});

export const persistor = persistStore(store);
