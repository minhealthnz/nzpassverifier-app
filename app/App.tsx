import React from "react";
import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import {
  SetupContainer,
  OnboardingContainer,
  TermsAndConditionsContainer,
  VerificationProgressContainer,
  HomeContainer,
  VersionUpdateContainer,
  VerificationSuccessContainer,
  ScanContainer,
  VerificationInvalidContainer,
  VerificationCannotReadContainer,
  VerificationCannotValidateContainer,
  ConnectionRequiredContainer,
} from "./features";
import { navigationRef } from "./common";
import { PersistGate } from "redux-persist/integration/react";
import { SafeAreaProvider } from "react-native-safe-area-context";

const MainStack = createStackNavigator();
const VerificationResultsStack = createStackNavigator();
// const SettingsStack = createStackNavigator();

const VerificationStack: React.FC = () => (
  <VerificationResultsStack.Navigator
    screenOptions={{
      headerShown: false,
      ...TransitionPresets.ModalFadeTransition,
    }}
  >
    <VerificationResultsStack.Group>
      <VerificationResultsStack.Screen name="VerificationProgress" component={VerificationProgressContainer} />
      <VerificationResultsStack.Screen name="VerificationSuccess" component={VerificationSuccessContainer} />
      <VerificationResultsStack.Screen name="VerificationInvalid" component={VerificationInvalidContainer} />
      <VerificationResultsStack.Screen
        name="VerificationCannotValidate"
        component={VerificationCannotValidateContainer}
      />
      <VerificationResultsStack.Screen name="VerificationCannotRead" component={VerificationCannotReadContainer} />
    </VerificationResultsStack.Group>
  </VerificationResultsStack.Navigator>
);

const ReactNavigationApp: React.FC = () => (
  <NavigationContainer ref={navigationRef}>
    <MainStack.Navigator initialRouteName={"Setup"} screenOptions={{ headerShown: false }}>
      <MainStack.Group>
        <MainStack.Screen name="Setup" component={SetupContainer} />
        <MainStack.Screen name="Onboarding" component={OnboardingContainer} />
        <MainStack.Screen name="TermsAndConditions" component={TermsAndConditionsContainer} />
        <MainStack.Screen name="Home" component={HomeContainer} />
        <MainStack.Screen name="Scan" component={ScanContainer} />
        <MainStack.Screen name="VersionUpdate" component={VersionUpdateContainer} />
        <MainStack.Screen name="ConnectionRequired" component={ConnectionRequiredContainer} />
      </MainStack.Group>
      <MainStack.Group
        screenOptions={{
          presentation: "modal",
          gestureEnabled: true,
          gestureResponseDistance: 10000,
        }}
      >
        <MainStack.Screen name="Verify" component={VerificationStack} />
      </MainStack.Group>
    </MainStack.Navigator>
  </NavigationContainer>
);

/**
 * The main application with a persisted redux store
 */
const ReduxApp: React.FC = () => (
  <ReduxProvider store={store}>
    <PersistGate persistor={persistor} loading={null}>
      <SafeAreaProvider>
        <ReactNavigationApp />
      </SafeAreaProvider>
    </PersistGate>
  </ReduxProvider>
);

export default ReduxApp;
