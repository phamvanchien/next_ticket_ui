import { RequestWithPaginationType } from "./base.type"

export interface CategoryType {
  id: number
  title: string
  slug: string
  childrens: CategoryType[]
}

export interface RequestCategoryType extends RequestWithPaginationType {
  forMenu?: boolean
  parentId?: number
}

export interface PostType {
  id: number
  title: string
  slug: string
  image: string
  content: string
  summary: string
  created_at: string
  categories: CategoryType[]
}

export interface CategoryWithPost {
  id: number
  title: string
  slug: string
  childrens: CategoryType[]
  posts: PostType[]
}