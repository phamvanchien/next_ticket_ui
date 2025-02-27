import '../assets_home/css/vendor.css';
import '../assets_home/css/style.css';
import '../assets_home/css/responsive.css';
import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/config/app.config";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { PostType } from "@/types/post.type";
import HomePostDetail from "@/views/home/post_detail/HomePostDetail";
import { catchError, responseError } from '@/services/base.service';

interface PostDetailProps {
  params: { slug: string };
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

export async function generateStaticParams() {
  const res = await fetch(`${APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.post.url}?page=1&size=1000&sortCreatedAt=DESC`);
  const posts: BaseResponseType<{ items: PostType[] }> = await res.json();

  return posts.data.items.map((post) => ({
    slug: post.slug,
  }));
}

const PostDetail = async ({ params }: PostDetailProps) => {
  const post = await fetchPost(params.slug);

  if (!post || post.code !== API_CODE.OK) {
    return <ErrorPage errorCode={404} />;
  }

  return <HomePostDetail post={post.data} />;
};

export default PostDetail;