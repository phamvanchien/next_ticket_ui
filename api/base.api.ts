import { APP_CONFIG } from "@/configs/app.config";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { BaseResponseType } from "@/types/base.type";
import { RequestApiWithTokenType } from "@/types/config.type";
import { getCookie } from "@/utils/cookie.util";
import axios, { AxiosError } from "axios";

export const catchError = (error: any): BaseResponseType => {
  const axiosError: AxiosError = error;
  return axiosError.response?.data as BaseResponseType;
}

const axiosInstance = axios.create({
  baseURL: APP_CONFIG.API.URL,
  timeout: APP_CONFIG.API.TIMEOUT,
});

export const request = async ({ method, url, data, params, headers = {}, ...config }: RequestApiWithTokenType) => {
  try {
    const lang = getCookie("locale") || "en";

    // ✅ Headers mặc định luôn tồn tại
    const defaultHeaders = {
      Authorization: `Bearer ${getCookie(APP_AUTH.COOKIE_AUTH_KEY)}`,
      "Accept-Language": lang,
    };

    // ✅ Nếu data là FormData, không tự động thêm 'Content-Type' để tránh lỗi của Axios
    const finalHeaders = {
      ...defaultHeaders,
      ...headers, // Headers được truyền vào sẽ được ưu tiên
    };

    if (method === API_METHOD_ENUM.GET) {
      return await callWithFetch(url, { ...config, params, headers: finalHeaders });
    }

    const response = await axiosInstance({
      method,
      url,
      data,
      headers: finalHeaders, // ✅ Luôn giữ headers mặc định
      ...config,
    });

    return response.data;
  } catch (error) {
    return catchError(error);
  }
};

const callWithFetch = async (url: string, config: Record<string, any> = {}) => {
  try {
    const params = config.params || {};
    const lang = getCookie('locale') || 'en';

    const urlWithParams = new URL(url, APP_CONFIG.API.URL);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        urlWithParams.searchParams.append(key, params[key].toString());
      }
    });

    const response = await fetch(urlWithParams.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getCookie(APP_AUTH.COOKIE_AUTH_KEY)}`,
        'Accept-Language': lang,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
};