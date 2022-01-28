import MMKVStorage from "react-native-mmkv-storage";

const INSTANCE_ID = "applicationStorage";

/**
 * Encrypted storage for this application
 * The redux store is persisted to this storage instance
 */
export const applicationStorage = new MMKVStorage.Loader().withInstanceID(INSTANCE_ID).withEncryption().initialize();
