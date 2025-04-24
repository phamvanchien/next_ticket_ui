import { API_METHOD_ENUM } from "@/enums/api.enum";
import { request } from "./base.api";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { APP_CONFIG } from "@/configs/app.config";
import { CreateDocumentRequestType, DocumentFileType, DocumentType, GetDocumentType, UpdateDocumentRequestType } from "@/types/document.type";

export const create = async (workspaceId: number, payload: CreateDocumentRequestType): Promise<BaseResponseType<DocumentType>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId,
    data: payload
  });
}

export const documents = async (workspaceId: number, payload: GetDocumentType): Promise<BaseResponseType<ResponseWithPaginationType<DocumentType[]>>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId,
    params: payload
  });
}

export const update = async (workspaceId: number, documentId: number, payload: UpdateDocumentRequestType): Promise<BaseResponseType<DocumentType>> => {
  return request({
    method: API_METHOD_ENUM.PATCH,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId + '/' + documentId,
    data: payload
  });
}

export const uploadFiles = async (
  workspaceId: number,
  documentId: number,
  files: File[]
): Promise<BaseResponseType<DocumentFileType[]>> => {
  const formData = new FormData();
  
  files.forEach((file) => {
    formData.append("files", file);
  });

  return request({
    method: API_METHOD_ENUM.POST,
    url: `${APP_CONFIG.API.PREFIX.document.url}/${workspaceId}/${documentId}/upload-files`,
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const document = async (workspaceId: number, documentId: number): Promise<BaseResponseType<DocumentType>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId + '/' + documentId
  });
}

export const removeFile = async (workspaceId: number, documentId: number, fileId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId + '/' + documentId + '/' + fileId + '/remove-file'
  });
}

export const remove = async (workspaceId: number, documentId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId + '/' + documentId
  });
}