import '../../assets_home/css/vendor.css';
import '../../assets_home/css/style.css';
import '../../assets_home/css/responsive.css';
import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/config/app.config";
import { API_CODE } from "@/enums/api.enum";
import { catchError, responseError } from "@/services/base.service";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { CategoryType, PostType } from "@/types/post.type";
import { use } from "react";
import HomeCategoryView from '@/views/home/category/HomeCategoryView';

interface CategoryPageProps {
  params: {
    categorySlug: string
  };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const category = use(fetchCategory(params.categorySlug));

  if (!category || category.code !== API_CODE.OK) {
    return <ErrorPage errorCode={404} />
  }

  const categoriesId = category.data.childrens.map(c => c.id.toString());
  categoriesId.push(category.data.id.toString());

  const posts = use(fetchPosts(categoriesId));

  return <HomeCategoryView posts={posts.data} category={category.data} categoriesId={categoriesId} />
}

const fetchCategory = async (slug: string): Promise<BaseResponseType<CategoryType>> => {
  try {
    const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.category}/${slug}`);
    return await res.json();
  } catch (error) {
    const errorRes = responseError(500);
    errorRes.error = catchError();
    return errorRes;
  }
};

const fetchPosts = async (categoryIds: string[]): Promise<BaseResponseType<ResponseWithPaginationType<PostType[]>>> => {
  try {
    const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.url}?page=1&size=8&sortCreatedAt=DESC&categoryId=${categoryIds.join(',')}`);
    return await res.json();
  } catch (error) {
    const errorRes = responseError(500);
    errorRes.error = catchError();
    return errorRes;
  }
};

export async function getStaticPaths() {
  const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.category}?page=1&size=1000`);
  const categories: BaseResponseType<ResponseWithPaginationType<CategoryType[]>> = await res.json()

  const paths = categories.data.items.map((category) => ({
    params: { categorySlug: category.slug }
  }))
 
  return { paths, fallback: false }
};

export default CategoryPage;