import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { firestore, serverTimestamp } from "../../lib/firebase/firebase";

const INITIAL_STATE = {
  friendsData: [],
  friendRequestSendingStatus: {
    isSuccess: false,
    isError: null,
    message: "",
  },
  error: null,
};

// thunks
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async ({ friendUid, uid }, thunkApi) => {
    if (!friendUid) {
      return null;
    }
    try {
      const batch = firestore.batch();
      const timeStamp = serverTimestamp();
      const notificationRef = firestore.collection("notifications").doc();
      const senderNotificationRef = firestore
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc(notificationRef.id);

      const recieverNotificationRef = firestore
        .collection("users")
        .doc(friendUid)
        .collection("notifications")
        .doc(notificationRef.id);

      batch.set(notificationRef, {
        from: uid,
        to: friendUid,
        status: "pending",
        createdAt: timeStamp,
        lastModified: timeStamp,
      });

      batch.set(senderNotificationRef, {
        notificationId: notificationRef.id,
        status: "pending",
        seen: false,
      });

      batch.set(recieverNotificationRef, {
        notificationId: notificationRef.id,
        status: "pending",
        seen: false,
      });

      await batch.commit();

      return { message: "Successfully sent request" };
    } catch (error) {
      return thunkApi.rejectWithValue({
        message: "Error Sending Request",
      });
    }
  }
);

const friendsSlice = createSlice({
  name: "friends",
  initialState: INITIAL_STATE,
  reducers: {
    setFriends: (state, { payload }) => {
      state.friendsData = payload;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(sendFriendRequest.fulfilled, (state, { payload }) => {
      state.friendRequestSendingStatus = {
        isError: null,

        isSuccess: true,
        message: payload,
      };
    });
    builder.addCase(sendFriendRequest.rejected, (state, { payload }) => {
      state.friendRequestSendingStatus = {
        isError: true,

        isSuccess: false,
        message: payload,
      };
    });
    builder.addCase(sendFriendRequest.pending, (state, { payload }) => {
      state.friendRequestSendingStatus = {
        isError: null,

        isSuccess: false,
        message: "",
      };
    });
  },
});

export const { setFriends } = friendsSlice.actions;
export default friendsSlice.reducer;
