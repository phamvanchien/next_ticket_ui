import { useEffect, useState } from "react";
import { PostType } from "@/types/post.type";
import { topPosts } from "@/api/post.api";
import { API_CODE } from "@/enums/api.enum";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { formatTime } from "@/utils/helper.util";
import PostCardTop from "./PostCardTop";
import Link from "next/link";
import LoadingPost from "@/common/components/LoadingPost";

const TopPost = () => {
  const [postTop, setPostTop] = useState<PostType>();
  const [postList, setPostList] = useState<PostType[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await topPosts();
        if (response && response.code === API_CODE.OK && response.data.length > 0) {
          setPostList(response.data.splice(1, 4));
          setPostTop(response.data[0]);
          setLoading(false);
          return;
        }
      } catch (error) {
        return;
      }
    }
    loadPosts();
  }, []);
  if (loading) {
    return <LoadingPost />
  }
  return (
    <div className="banner-area banner-inner-1 bg-black" id="banner">
      <div className="banner-inner pt-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-6">
              <div className="thumb after-left-top">
                <img src={postTop?.image} alt="img" />
              </div>
            </div>
            <div className="col-lg-6 align-self-center">
              <div className="banner-details mt-4 mt-lg-0">
                <div className="post-meta-single">
                  <ul>
                    {
                      (postTop?.categories && postTop.categories.length > 0) &&
                      <li>
                        <Link className="tag-base tag-blue" href={`/chuyen-muc/${postTop.categories[0].slug}`}>
                          {postTop?.categories[0].title}
                        </Link>
                      </li>
                    }
                    {
                      postTop &&
                      <li className="date">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        {formatTime(new Date(postTop.created_at))}
                      </li>
                    }
                  </ul>
                </div>
                <h2>
                  <Link href={'/' + (postTop?.slug ?? '')}>
                    {postTop?.title}
                  </Link>
                </h2>
                <p>
                  {postTop?.summary}
                </p>
                <Link className="btn btn-blue btn-read-more" href="#">
                  Đọc tiếp
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          {
            postList?.map(post => (
              <div className="col-lg-3 col-sm-6" key={post.id}>
                <PostCardTop post={post} />
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}
export default TopPost;