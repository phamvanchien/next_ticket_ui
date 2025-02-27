import '../../assets_home/css/vendor.css';
import '../../assets_home/css/style.css';
import '../../assets_home/css/responsive.css';
import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/config/app.config";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { CategoryType, PostType } from "@/types/post.type";
import HomeCategoryView from '@/views/home/category/HomeCategoryView';
import { catchError, responseError } from '@/services/base.service';

interface CategoryPageProps {
  params: {
    categorySlug: string;
  };
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

export async function generateStaticParams() {
  const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.category}?page=1&size=1000`);
  const categories: BaseResponseType<ResponseWithPaginationType<CategoryType[]>> = await res.json();

  return categories.data.items.map((category) => ({
    categorySlug: category.slug,
  }));
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const category = await fetchCategory(params.categorySlug);

  if (!category || category.code !== API_CODE.OK) {
    return <ErrorPage errorCode={404} />;
  }

  const categoriesId = category.data.childrens.map((c) => c.id.toString());
  categoriesId.push(category.data.id.toString());

  const posts = await fetchPosts(categoriesId);

  return <HomeCategoryView posts={posts.data} category={category.data} categoriesId={categoriesId} />;
};

export default CategoryPage;
