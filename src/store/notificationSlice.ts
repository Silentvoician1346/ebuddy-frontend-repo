import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface INotificationState {
  message: string;
}

const initialState: INotificationState = {
  message: "",
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationState: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
    },
  },
});

export const { setNotificationState } = notificationSlice.actions;
export const notificationReducer = notificationSlice.reducer;
