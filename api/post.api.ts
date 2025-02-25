import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { APP_CONFIG } from "@/config/app.config";
import { CategoryType, CategoryWithPost, PostType, RequestCategoryType } from "@/types/post.type";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";

export const categories = async (payload: RequestCategoryType): Promise<BaseResponseType<ResponseWithPaginationType<CategoryType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.post.category,
    params: {
      priority: payload.forMenu,
      category_id: payload.parentId,
      page: payload.page,
      size: payload.size
    }
  });
}

export const topPosts = async (): Promise<BaseResponseType<PostType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.post.top
  });
}

export const categoryWithPost = async (): Promise<BaseResponseType<ResponseWithPaginationType<CategoryWithPost[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.post.categoryWithPost
  });
}

export const posts = async (): Promise<BaseResponseType<ResponseWithPaginationType<PostType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.post.url
  });
}