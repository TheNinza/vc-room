import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/user-slice";
import friendsReducer from "../features/friends/friends-slice";
import uiReducer from "../features/ui/ui-slice";
import notificationsReducer from "../features/notifications/notifications-slice";
import callReducer from "../features/call/call-slice";
import { suggestionsApi } from "../features/suggestions-api/suggestions-api-slice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    friends: friendsReducer,
    ui: uiReducer,
    notifications: notificationsReducer,
    call: callReducer,
    [suggestionsApi.reducerPath]: suggestionsApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(suggestionsApi.middleware),
});

export const storeDispatch = store.dispatch;
