import axios from "axios";

// create axios instance
export const axiosInstance = axios.create({
  withCredentials: true, // send cookies (for Chrome / Android)
});

// add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // read token from localStorage (for iOS Safari)
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// generic api connector
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method,
    url,
    data: bodyData ?? null,
    headers: headers ?? {},
    params: params ?? null,
  });
};
