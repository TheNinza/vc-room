import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { auth } from "../../lib/firebase/firebase";

export const suggestionsApi = createApi({
  reducerPath: "suggestionsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV,
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken();
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSuggestions: builder.query({
      query: () => `api/suggestions`,
    }),
  }),
});

export const { useGetSuggestionsQuery } = suggestionsApi;
