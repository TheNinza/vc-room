import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { auth } from "../../lib/firebase/firebase";
import { rtkQueryToastLoader } from "../../utils/rtkQueryToastLoader";

export const friendsApi = createApi({
  reducerPath: "friendsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV) + "/api/friends",
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "/sendFriendRequest",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(queryFulfilled, "Sending friend request...");
      },
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => {
        return {
          url: "/acceptFriendRequest",
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(queryFulfilled, "Accepting friend request...");
      },
    }),

    declineFriendRequest: builder.mutation({
      query: (data) => {
        return {
          url: "/declineFriendRequest",
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(queryFulfilled, "Declining friend request...");
      },
    }),

    removeFriend: builder.mutation({
      query: (data) => {
        return {
          url: "/removeFriend",
          method: "POST",
          body: data,
        };
      },
      onQueryStarted: async (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(queryFulfilled, "Removing friend...");
      },
    }),
  }),
});

export const {
  useAcceptFriendRequestMutation,
  useSendFriendRequestMutation,
  useDeclineFriendRequestMutation,
  useRemoveFriendMutation,
} = friendsApi;
