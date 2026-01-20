// import { createApi } from "@reduxjs/toolkit/query/react";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
 
    baseUrl: "https://api.wesound.app/api/v1",    
    // baseUrl: "https://rakibur5000.binarybards.online/api/v1",    
    prepareHeaders: (headers) => {
      // headers.set("ngrok-skip-browser-warning", "true");
      const token = Cookies.get("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    credentials: "include",
  }),
  endpoints: () => ({}),
  tagTypes: ["user", "notifications", "admin", "category", "slider", "faqs", "withdrawal", "planner"],
});

export const imageUrl = "https://api.wesound.app";
// export const imageUrl = "https://rakibur5000.binarybards.online";
