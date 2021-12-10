import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { auth } from "../../lib/firebase/firebase";
import { rtkQueryToastLoader } from "../../utils/rtkQueryToastLoader";

export const paymentsApi = createApi({
  reducerPath: "paymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_BACKEND_PROD
        : process.env.REACT_APP_BACKEND_DEV + "/api/payments",

    prepareHeaders: async (headers) => {
      const token = await auth.currentUser.getIdToken(true);
      headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    fetchProducts: builder.query({
      query: () => `/products`,
      transformResponse: (response) => {
        const prices = response.prices || [];
        prices.sort((a, b) => b.amount - a.amount);
        return prices;
      },
    }),
    checkout: builder.mutation({
      query: (data) => ({
        url: `/checkout`,
        method: "POST",
        body: data,
      }),

      onQueryStarted: (_data, { queryFulfilled }) => {
        rtkQueryToastLoader(
          queryFulfilled,
          "Starting Your Payment",
          async (response) => {
            if (response.data?.session?.id) {
              window.location.href = response.data.session.url;
            }
          },
          true
        );
      },
    }),
  }),
});

export const { useFetchProductsQuery, useCheckoutMutation } = paymentsApi;
