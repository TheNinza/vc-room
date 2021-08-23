import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/user-slice";
import friendsReducer from "../features/friends/friends-slice";
import uiReducer from "../features/ui/ui-slice";

export const store = configureStore({
  reducer: { user: userReducer, friends: friendsReducer, ui: uiReducer },
});

export const storeDispatch = store.dispatch;
