import { termsAndConditionsService } from "../services";
import { createAppAsyncThunk, navigation } from "../../../common";

export const doAcceptTermsAndConditions = createAppAsyncThunk<number, void>(
  "termsAndConditions/accept",
  (_options, _thunkAPI) => {
    const version = termsAndConditionsService.acceptTermsAndConditions();
    navigation.replace("Home");
    return version;
  }
);
