import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const accessToken = cookieStore.get("accessToken");
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }
  return config;
});

// export const apiClient = {
//   request: {},
//   get(url: string, config?: AxiosProxyConfig): Promise<AxiosResponse> {
//     return axiosClient.get(url, config);
//   },

//   post(
//     url: string,
//     data?: unknown,
//     config?: AxiosProxyConfig,
//   ): Promise<AxiosResponse> {
//     return axiosClient.post(url, data, config);
//   },
//   put() {},
//   delete() {},
// };

export const apiClient = {
  get(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
    return axiosClient.get(url, config).then((res) => res.data);
    // .then(res => res.data) giúp bên ngoài nhận data luôn, đỡ phải .data lần nữa
  },

  post(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return axiosClient.post(url, data, config).then((res) => res.data);
  },

  put(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse> {
    return axiosClient.put(url, data, config).then((res) => res.data);
  },

  // delete(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> {
  //   return axiosClient.delete(url, config).then((res) => res.data);
  // },
};
