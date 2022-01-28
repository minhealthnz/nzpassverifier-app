import { PersistedState } from "redux-persist/es/types";

export type StateMigrationFn = (state: PersistedState) => PersistedState;
