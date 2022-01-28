import { TypedCreateAsyncThunk, TypedAsyncThunkAPI } from "./types";
import { RootState } from "../../store";
import { createAsyncThunk } from "@reduxjs/toolkit";

/**
 * Utility function to provide typed state in the thunk middleware
 */
export const createAppAsyncThunk: TypedCreateAsyncThunk<{
  readonly state: RootState;
}> = createAsyncThunk;

/**
 * Utility function to create a function that takes a typed {@link GetThunkAPI} as parameter
 */
export const withAppAsyncThunkAPI = <R>(
  fn: (thunkAPI: TypedAsyncThunkAPI<{ readonly state: RootState }>) => R
): typeof fn => fn;
