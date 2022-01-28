## Install dependencies

install yarn dependencies

```
yarn install --frozen-lockfile
```

Before running the wallet on ios, you will need to install all the Pods. Make sure you have installed
[CocoaPods](https://cocoapods.org/#install) before running the commands below.

```
cd ios && pod install && cd ..
```

And finally

```
yarn ios
```
