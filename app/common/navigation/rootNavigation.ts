import { createNavigationContainerRef, StackActions } from "@react-navigation/native";
import type { RoutesAndParams, TypedNavigationFunction } from "./types";

/**
 * Recommended approach by react navigation
 *
 * @see https://reactnavigation.org/docs/navigating-without-navigation-prop
 */
export const navigationRef = createNavigationContainerRef<RoutesAndParams>();

const navigate: TypedNavigationFunction = (name, ...args) => {
  if (navigationRef.isReady()) {
    const paramsOrNever = args[0];
    return navigationRef.navigate(name, paramsOrNever);
  }
};

const replace: TypedNavigationFunction = (name, ...args) => {
  if (navigationRef.isReady()) {
    const paramsOrNever = args[0];
    return navigationRef.dispatch(StackActions.replace(name, paramsOrNever));
  }
};

const push: TypedNavigationFunction = (name, ...args) => {
  if (navigationRef.isReady()) {
    const paramsOrNever = args[0];
    return navigationRef.dispatch(StackActions.push(name, paramsOrNever));
  }
};

const reset: TypedNavigationFunction = (name, ...args) => {
  if (navigationRef.isReady()) {
    const paramsOrNever = args[0];
    return navigationRef.reset({ routes: [{ name: name, params: paramsOrNever }] });
  }
};

const back = (): void => {
  if (navigationRef.isReady()) {
    return navigationRef.goBack();
  }
};

export const navigation = {
  push,
  replace,
  back,
  reset,
  navigate,
};
