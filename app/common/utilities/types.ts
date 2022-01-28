import { AsyncThunk, AsyncThunkOptions, AsyncThunkPayloadCreator } from "@reduxjs/toolkit";

export type StyleConditions<T> = {
  readonly [P in keyof T]: boolean;
};

export type TypedCreateAsyncThunk<ThunkApiConfig> = <Returned, ThunkArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, ThunkArg, ThunkApiConfig>,
  options?: AsyncThunkOptions<ThunkArg, ThunkApiConfig>
) => AsyncThunk<Returned, ThunkArg, ThunkApiConfig>;

export type TypedAsyncThunkAPI<ThunkApiConfig> = Parameters<
  AsyncThunkPayloadCreator<unknown, unknown, ThunkApiConfig>
>[1];
