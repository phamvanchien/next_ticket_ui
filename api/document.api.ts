import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { APP_CONFIG } from "@/config/app.config";
import { CreateDocumentRequestType, DocumentResponse, DocumentsResponse } from "@/types/document.type";

export const create = async (workspaceId: number, payload: CreateDocumentRequestType): Promise<DocumentResponse> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId,
    data: payload
  });
}

export const documents = async (workspaceId: number, page: number, size: number): Promise<DocumentsResponse> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId,
    params: {
      page: page,
      size: size
    }
  });
}