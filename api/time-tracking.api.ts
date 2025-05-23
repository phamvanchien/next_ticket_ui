import { BaseResponseType, RequestWithPaginationType } from "@/types/base.type";
import { request } from "./base.api";
import { API_METHOD_ENUM } from "@/enums/api.enum";
import { GetWorkingRecordsType, RequestCreateReportTrackingType, RequestCreateTimeTrackingType, TimeTrackingRecordType, TimeTrackingReportFormType, TimeTrackingReportType, TimeTrackingType } from "@/types/time-tracking.type";
import { APP_CONFIG } from "@/configs/app.config";
import { UserType } from "@/types/user.type";

export const timeTracking = async (workspaceId: number, payload: RequestWithPaginationType): Promise<BaseResponseType<TimeTrackingType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId,
    params: payload
  });
}

export const checkMember = async (workspaceId: number, payload: {members: number[]}): Promise<BaseResponseType<UserType[]>> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/check-member',
    data: payload
  });
}

export const create = async (workspaceId: number, payload: RequestCreateTimeTrackingType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId,
    data: payload
  });
}

export const startWorking = async (workspaceId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/start-working',
  });
}

export const getWorkingTimeRecord = async (workspaceId: number): Promise<BaseResponseType<TimeTrackingRecordType>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/working',
  });
}

export const endWorking = async (workspaceId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/end-working',
  });
}

export const getWorkingTimeRecords = async (workspaceId: number, payload?: GetWorkingRecordsType): Promise<BaseResponseType<TimeTrackingRecordType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/working-list',
    params: payload
  });
}

export const getReportTracking = async (workspaceId: number, month: number): Promise<BaseResponseType<TimeTrackingReportType>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/report',
    params: {
      month: month
    }
  });
}

export const createReportForm = async (workspaceId: number, timeTrackingId: number, payload: RequestCreateReportTrackingType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.POST,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/' + timeTrackingId + '/create-report',
    data: payload
  });
}

export const getReportList = async (workspaceId: number, trackingTimeId: number): Promise<BaseResponseType<TimeTrackingReportFormType[]>> => {
  return request({
    method: API_METHOD_ENUM.GET,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/' + trackingTimeId + '/report-list',
  });
}

export const deleteReport = async (workspaceId: number, trackingTimeId: number, reportId: number): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.DELETE,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/' + trackingTimeId + '/' + reportId
  });
}

export const updateTimeSheet = async (workspaceId: number, trackingTimeId: number, payload: RequestCreateTimeTrackingType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.PUT,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/' + trackingTimeId,
    data: payload
  });
}

export const updateTimeSheetActive = async (workspaceId: number, trackingTimeId: number, payload: RequestCreateTimeTrackingType): Promise<BaseResponseType> => {
  return request({
    method: API_METHOD_ENUM.PUT,
    url: APP_CONFIG.API.PREFIX.time_tracking.url + '/' + workspaceId + '/' + trackingTimeId + '/update-active',
    data: payload
  });
}