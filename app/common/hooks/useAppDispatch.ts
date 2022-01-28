import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";

/**
 * Type safe store dispatcher
 * Use throughout your app instead of plain `useDispatch`
 *
 * @see https://redux-toolkit.js.org/tutorials/typescript#define-typed-hooks
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();
