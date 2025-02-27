import '../assets_home/css/vendor.css';
import '../assets_home/css/style.css';
import '../assets_home/css/responsive.css';
import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/config/app.config";
import { API_CODE } from "@/enums/api.enum";
import { catchError, responseError } from "@/services/base.service";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { PostType } from "@/types/post.type";
import HomePostDetail from "@/views/home/post_detail/HomePostDetail";
import { use } from "react";

interface PostDetailProps {
  params: { slug: string };
}

const PostDetail = ({ params }: PostDetailProps) => {
  const post = use(fetchPost(params.slug));

  if (!post || post.code !== API_CODE.OK) {
    return <ErrorPage errorCode={404} />
  }

  return <HomePostDetail post={post.data} />
}

const fetchPost = async (slug: string): Promise<BaseResponseType<PostType>> => {
  try {
    const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.url}/${slug}`);
    return await res.json();
  } catch (error) {
    const errorRes = responseError(500);
    errorRes.error = catchError();
    return errorRes;
  }
};

export async function getStaticPaths() {
  const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.url}?page=1&size=1000&sortCreatedAt=DESC`);
  const posts: BaseResponseType<ResponseWithPaginationType<PostType[]>> = await res.json()

  const paths = posts.data.items.map((post) => ({
    params: { slug: post.slug },
  }))
 
  return { paths, fallback: false }
}

export default PostDetail;