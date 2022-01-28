import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../../store";

/**
 * Type safe selector for the shape of our store
 * Use throughout your app instead of plain `useSelector`
 *
 * @see https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
