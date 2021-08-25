import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  notificationCount: 0,
  notificationsData: [],
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: INITIAL_STATE,
  reducers: {
    setNotificationCount: (state, { payload }) => {
      state.notificationCount = payload;
    },
    setNotifications: (state, { payload }) => {
      state.notificationsData = payload;
    },
  },
});

export const { setNotificationCount, setNotifications } =
  notificationSlice.actions;
export default notificationSlice.reducer;
