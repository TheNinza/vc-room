import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  friendsData: [],
  error: null,
};

const friendsSlice = createSlice({
  name: "friends",
  initialState: INITIAL_STATE,
  reducers: {
    setFriends: (state, { payload }) => {
      state.friendsData = payload;
    },
  },
});

export const { setFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
