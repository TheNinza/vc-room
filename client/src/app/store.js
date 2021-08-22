import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/user-slice";
import friendsReducer from "../features/friends/friends-slice";

export const store = configureStore({
  reducer: { user: userReducer, friends: friendsReducer },
});

export const storeDispatch = store.dispatch;
