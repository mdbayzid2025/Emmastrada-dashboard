import { baseApi } from "../../base/baseAPI";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFAQ: builder.query({
      query: () => "/faqs",
      providesTags: ["faqs"]
      // transformResponse: (res: { data: any }) => res?.data,
    }),
    addFAQ: builder.mutation({
      query: (data) => ({
        url: "/faqs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["faqs"]
    }),
    updateFAQ: builder.mutation({
      query: ({ id, data }) => ({
        url: `/faqs/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["faqs"]
    }),
    deleteFAQ: builder.mutation({
      query: (id)=> {
        return {
          url: `/faqs/${id}`,
          method: "DELETE",          
        }
      }
    }),

    getTermsCondition: builder.query({      
      query: () => "/settings?key=termsOfService",
      transformResponse: (res: { data: any }) => res?.data,
    }),

    getAbout: builder.query({
      query: () => "/settings?key=aboutUs",
      // transformResponse: (res: { data: any }) => res?.data,
    }),
    addAbout: builder.mutation({
      query: (data) => ({
          url: "/settings",
          method: "POST",
          body: data,
        }),
    }),
    getPrivacyPolicy: builder.query({
      query: () => "/disclaimer/privacy-policy",
      transformResponse: (res: { data: any }) => res?.data,
    }),
    addDisclaimer: builder.mutation({
      query: (data) => ({
          url: "/settings",
          method: "PUT",
          body: data,
        }),
    }),

    addSupport: builder.mutation({
      query: (data) => {
        return {
          url: "/contact-info",
          method: "POST",
          body: data,
        };
      },
    }),
    getSupport: builder.query({
      query: () => "/contact-info",
      transformResponse: (res: { data: any }) => res?.data,
    }),

    getNotification: builder.query({
      query: () => "/reports",
      transformResponse: (res: { data: any }) => res?.data,
    }),
  }),
});

export const {
  useGetFAQQuery,
  useGetAboutQuery,
  useGetPrivacyPolicyQuery,

  useGetSupportQuery,
  useAddSupportMutation,

  useAddAboutMutation,
  useAddFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,

  useGetTermsConditionQuery,
  useAddDisclaimerMutation,
} = settingApi;
