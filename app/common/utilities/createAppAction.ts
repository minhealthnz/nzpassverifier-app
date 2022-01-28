import { createAction } from "@reduxjs/toolkit";

/**
 * Utility function to provide typed state in the thunk middleware
 */
export const createAppAction: typeof createAction = createAction;
