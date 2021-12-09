import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { auth } from "../../lib/firebase/firebase";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      (process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV) + "/api/search",
    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken(true);
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getSearchResultsPeople: builder.query({
      query: (searchString) => ({
        url: `/people`,
        params: { searchString },
      }),
    }),
  }),
});

export const { useGetSearchResultsPeopleQuery } = searchApi;
