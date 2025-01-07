export interface BaseResponseType {
  code: number,
  message: string,
  data: any,
  error: AppErrorType | null
}

export interface RequestWithPaginationType {
  page: number
  size: number
  keyword?: string
}

export interface ResponseWithPaginationType {
  total: number
  totalPage: number
  items: any[]
}

export interface AppErrorType {
  property?: string | null,
  message: string
}

export interface AppPagingType {
  total: number
  page: number
  limit: number
  totalPage: number
}