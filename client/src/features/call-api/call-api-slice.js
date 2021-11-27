import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { auth } from "../../lib/firebase/firebase";
import { rtkQueryToastLoader } from "../../utils/rtkQueryToastLoader";
import { setActiveCallDocId } from "../call/call-slice";

export const callApi = createApi({
  reducerPath: "callApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV) + "/api/call",
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createCall: builder.mutation({
      query: (data) => ({
        url: "/createCall",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_data, { queryFulfilled, dispatch }) => {
        rtkQueryToastLoader(queryFulfilled, "Creating Call...", (data) => {
          dispatch(setActiveCallDocId(data.data.callId));
        });
      },
    }),

    deleteCall: builder.mutation({
      query: (data) => ({
        url: "/deleteCall",
        method: "POST",
        body: data,
      }),
      onQueryStarted: async (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(queryFulfilled, "Deleting Call...");
      },
    }),
  }),
});

export const { useCreateCallMutation, useDeleteCallMutation } = callApi;
