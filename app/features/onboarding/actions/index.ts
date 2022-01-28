import { createAppAsyncThunk, navigation } from "../../../common";

export const doCompleteOnboarding = createAppAsyncThunk("onboarding/complete", (_options, _thunkAPI) => {
  return navigation.replace("TermsAndConditions");
});
