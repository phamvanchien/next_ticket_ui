import { MemberShareType } from "./document.type";
import { ProjectType } from "./project.type"
import { UserType } from "./user.type"

export interface RequestCreateTimeTrackingType {
  start_at: Date;
  end_at: Date;
  start_rest_at: Date;
  end_rest_at: Date;
  project_id?: number;
  title: string;
  location_long?: string;
  location_lat?: string;
  active?: boolean;
  member_include_workspace_owner?: boolean
  members: {
    member_id: number
    permission: number | null
  }[]
  working_day_start?: number
  working_day_end?: number
}

export interface TimeTrackingType {
  id: number
  workspace_id: number
  project: ProjectType | null
  tracking_type: number
  title: string
  working_day: {
    start: number,
    end: number
  },
  time: {
    total_minute: number
    total_hour: number
    start_at: string
    end_at: string
  },
  rest_time: {
    total_minute: number
    total_hour: number
    start_rest_at: string
    end_rest_at: string
  },
  active: boolean
  location:  {
    long: string
    lat: string
  } | null,
  members: MemberShareType[],
  created_at: string
  is_admin: boolean
}

export interface GetWorkingRecordsType {
  start_at?: Date,
  end_at?: Date
}

export interface TimeTrackingRecordType {
  id: number
  workspace_id: number
  time_tracking_id: number
  start_at: string
  end_at: string
  total_minute: number
  created_at: string
  status: 0 | 1 | 2
}

export interface TimeTrackingReportType {
  total: {
    late: number
    out_soon: number
    minute: number
    minute_missing: number
  },
  items: TimeTrackingReportDay[]
}

export interface TimeTrackingReportDay {
  date: string,
  day_off: boolean
  status: 0 | 1,
  records: TimeTrackingRecordType[]
}

export interface RequestCreateReportTrackingType {
  report_type: number;
  date: string;
  content?: string;
}

export interface TimeTrackingReportFormType {
  id: number
  workspace_id: number
  content: string
  type: number
  approve_by: UserType,
  approve_at: string
  date: string
  created_at: string
}