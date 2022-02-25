import { browserService, config, createAppAsyncThunk, navigation } from "../../../common";

export const doViewScan = createAppAsyncThunk("home/scan", (_options, _thunkAPI) => {
  return navigation.navigate("Scan");
});

export const doShowHelp = createAppAsyncThunk("home/showHelp", async () => {
  return await browserService.open(config.HELP_URL);
});

export const doShowPrivacyPolicy = createAppAsyncThunk("home/doShowPrivacyPolicy", async () => {
  return await browserService.open(config.PRIVACY_POLICY_URL);
});
