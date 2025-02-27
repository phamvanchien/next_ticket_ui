"use client"
import dynamic from "next/dynamic";
import { PostType } from "@/types/post.type";
import HeaderHome from "../components/Header";
import RelatePost from "./components/RelatePost";
import FooterHome from "../components/Footer";
import CategoryInPost from "./components/CategoryInPost";
import { formatTime } from "@/utils/helper.util";

const PostBestView = dynamic(() => import("./components/PostBestView"), { ssr: false });

interface HomePostDetailProps {
  post: PostType;
}

const HomePostDetail: React.FC<HomePostDetailProps> = ({ post }) => {
  return (
    <>
      <HeaderHome />
      <div className="post-area pd-top-75 pd-bottom-50" id="trending">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12">
              <div className="widget widget_tag_cloud">
                <h5 className="widget-title">Chuyên mục</h5>
                <CategoryInPost categories={post.categories} />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12 col-lg-9">
              <p className="text-muted">{formatTime(new Date(post.created_at))}</p>
              <h2>{post?.title}</h2>
              <p dangerouslySetInnerHTML={{ __html: post?.content }}></p>
            </div>
            <div className="col-12 col-lg-3">
              <PostBestView />
            </div>
          </div>
          <div className="row">
            <RelatePost post={post} />
          </div>
        </div>
      </div>
      <FooterHome />
    </>
  );
};

export default HomePostDetail;