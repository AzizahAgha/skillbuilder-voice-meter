import axios from "axios";
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();


// console.log('base url =>', {config: publicRuntimeConfig.BACKEND_URL, env: process.env.NEXT_PUBLIC_BACKEND_URL})


const axiosInstance = axios.create({
  baseURL: publicRuntimeConfig.BACKEND_URL,
});

axiosInstance.interceptors.request.use((config) => {
  config.params = config.params || {};

  const isBrowser = process.browser;

  if (isBrowser) {
    const token = localStorage.getItem("auth");

    if (token) config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
