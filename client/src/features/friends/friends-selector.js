import { createSelector } from "@reduxjs/toolkit";

const selectFriends = (state) => state.friends;

export const selectNumFriends = createSelector(
  [selectFriends],
  (friends) => friends.friendsData.length
);
