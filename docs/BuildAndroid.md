## Running debug build with metro bundling on emulator

```zsh
yarn android
```

## Building android APK
Run the command below, the apk should appear in `./app/build/outputs/apk`
```zsh
cd android
./gradlew assembleRelease
```

## Building android AAB
Run the command below, the apk should appear in `./app/build/outputs/bundle`
```zsh
cd android
./gradlew bundleRelease
```

## Clean android build folder
```zsh
cd android
./gradlew clean
```


## Upgrading the gradle version
Gradle is used to build the android bundle. The gradle wrapper(gradlew) is used to wrap gradle execution with a specific gradle version
To upgrade the version of gradle used to build the android app: use the wrapper task:
```zsh
cd android
./gradlew wrapper --gradle-version 7.2
```
To upgrade the gradle wrapper itself, run the above command again
```zsh
./gradlew wrapper --gradle-version 7.2
```
see [official gradle docs](https://docs.gradle.org/current/userguide/gradle_wrapper.html#sec:adding_wrapper)