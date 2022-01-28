# NZ Pass Verifier

## License

This project is licensed under the terms of the GNU Affero General Public License.
Note that the NZ Pass Verifier has a dependency on the MATTR Verifier Single Format (CWT/COSE) SDK, which is licensed under a commercial license. You will need to fulfil the requirements of this license in order to make use of the SDK.
See https://learn.mattr.global/docs/terms/sdk-licence-verifier-single-format-cwt-cose for licensing details.

## Architecture

### Features

The application is broken into features. Within a feature contains the specific logic for the app to use that feature.
It should be straightforward to add and remove features.

The base structure of a feature is as follows:

```
- app
    - features
        - featureName
            - actions // Thunk middleware actions
            - components // Components only used by this feature
            - containers // Container components
            - screens // Screen components with layouts for this feature
            - services // Services containing the business logic for this feature
            - state // The redux slice containing reducers and initial state
```

### UI

Containers are smart components that host the logic for interacting with the store to create the properties for a screen.
Constructed properties are passed from the container to a screen that acts as a display wrapper for an entire screen and
its components. The screen may or may not contain many other components which can all access what they need from the
screen properties.

In summary the UI architecture is made up of the following:

#### Container ('Smart component')

- Accesses the redux store to derive the properties for the screen
- Doesn't do ANY display work
- Passes the view model to a screen

#### Screen ('Dumb component')

- Provides a main wrapper & layout of an entire screen
- Can contain many components
- Usually requires properties for display and actions

#### Component (Also a 'Dumb component')

- More fine grained layout eg. a button, button group, a list.
- Usually contained within a container as part of an entire screen

#### Redux store migration

We use redux persist to store the redux store in memory on the device. If the store evolves or changes shape between
release it may require a migration to the new store so the old store can rehydrate into the app correctly on boot.

1. Create a new migration file in `app/store/migrations`. E.g. `2.ts` for the second migration.
2. Define the new migration in the migrations key value map define in `app/store/migrations.index.ts`.

```typescript
//... Other imported migrations
import { migration2 } from "./2";

export const migrations: MigrationManifest = {
  //... Previous migrations
  "2": migration2,
};
```

3. In `store.ts`, bump the store version defined in `persistConfig` to the new version number.

```typescript
const persistConfig: PersistConfig<BaseReducersState> = {
  //... Other config
  version: 2,
};
```

4. The migration will be run when the app is updated.

## Error handling

see [here](./docs/ErrorHandling.md)

## Building

see [building Android](./docs/BuildAndroid.md)

see [building iOS](./docs/BuildIOS.md)

## Changing terms of use

see [Versioning Legal Assets](./docs/VersioningLegalAssets.md)
