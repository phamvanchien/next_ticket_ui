import { APP_CONFIG } from "@/config/app.config";
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

export const request = async ({ method, url, data, params, ...config }: RequestApiWithTokenType) => {
  try {
    if (method === API_METHOD_ENUM.GET) {
      return await callWithFetch(url, { ...config, params });
    }
    const response = await axiosInstance({
      method,
      url,
      data,
      headers: {
        ...config?.headers,
        Authorization: `Bearer ${getCookie(APP_AUTH.COOKIE_AUTH_KEY)}`,
      },
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

