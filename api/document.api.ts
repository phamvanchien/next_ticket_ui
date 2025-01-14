import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { APP_CONFIG } from "@/config/app.config";
import { CreateDocumentRequestType, DocumentResponse } from "@/types/document.type";

export const create = async (workspaceId: number, payload: CreateDocumentRequestType): Promise<DocumentResponse> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.comment.url + '/' + workspaceId,
    data: payload
  });
}