import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { auth } from "../../lib/firebase/firebase";
import { rtkQueryToastLoader } from "../../utils/rtkQueryToastLoader";
import { fetchUserData } from "../user/user-slice";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV) + "/api/user",
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken(true);
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    updateUser: builder.mutation({
      query: (data) => ({
        url: "/updateUser",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_data, { queryFulfilled, dispatch }) => {
        rtkQueryToastLoader(queryFulfilled, "Updating User...", () => {
          dispatch(fetchUserData(auth.currentUser));
        });
      },
    }),
    deleteUser: builder.mutation({
      query: () => `/deleteUser`,
      onQueryStarted: async (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(queryFulfilled, "Deleting User...", () => {
          auth.signOut();
        });
      },
    }),
  }),
});

export const { useUpdateUserMutation, useDeleteUserMutation } = userApi;
