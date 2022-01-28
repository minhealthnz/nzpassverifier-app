# Versioning Legal Assets

The app bundles the legal HTML documents as static assets:

- [Terms And Conditions](../app/features/termsAndConditions/assets/TermsOfUse.html)

The current document versions are configured in the `.env` file at the project's root directory:

- `TERMS_AND_CONDITIONS_VERSION`, defaults to `1`.

To update a document's version, replace the HTML asset with the new document, then increment the environment variable
value in `.env` file with the new version. On the next build the asset will be bundled with the app and displayed in the
terms and conditions web view.

### Remarks for developers

The `.env` file must **not** be pushed onto source control. You can create one from `.env.template` for local
development.

The environment variables are injected into the app **at build time**, see
[react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv). After updating the `.env` file, you must
invalidate the [Babel cache](https://babeljs.io/docs/en/config-files#apicache) so that the app can pickup your latest
changes. For example, you can restart the [Metro](https://facebook.github.io/metro) service with `--resetCache`:

```bash
yarn start --resetCache
```
