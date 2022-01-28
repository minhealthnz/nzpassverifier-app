/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  return {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
      /**
       * Define transformer for react-native-svg-transformer
       *
       * @see https://www.npmjs.com/package/react-native-svg-transformer
       */
      babelTransformerPath: require.resolve("react-native-svg-transformer"),
    },
    /**
     * Resolver configuration for react-native-svg-transformer
     *
     * @see https://www.npmjs.com/package/react-native-svg-transformer
     */
    resolver: {
      assetExts: assetExts.filter((ext) => ext !== "svg"),
      sourceExts: [...sourceExts, "svg"],
    },
  };
})();
