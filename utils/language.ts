"use server";
import {cookies} from "next/headers";

export const setLanguageCookie = async (locale: string) => {
  cookies().set("locale", locale, {path: "/", maxAge: 60 * 60 * 24 * 365});
}

export const getLanguageCookie = async (): Promise<string> => {
  return cookies().get("locale")?.value || "en";
}