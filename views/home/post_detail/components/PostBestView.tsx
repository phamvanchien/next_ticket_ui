"use client"
import { posts } from "@/api/post.api";
import { API_CODE } from "@/enums/api.enum";
import { PostType } from "@/types/post.type";
import { useEffect, useState } from "react";
import HorizontalCard from "../../post/components/HorizontalCard";

const PostBestView = () => {
  const [postsBestView, setPostsBestView] = useState<PostType[]>();
  const loadPosts = async () => {
    try {
      const [bestView] = await Promise.all([
        await posts({
          sortBestView: "DESC",
          page: 1,
          size: 15
        })
      ]);
      if (bestView.code === API_CODE.OK) {
        setPostsBestView(bestView.data.items);
      }
    } catch (error) {
      return;
    }
  }
  useEffect(() => {
    loadPosts();
  }, []);
  return <>
    <div className="section-title" style={{marginTop: 50}}>
      <h6 className="title">Xem nhiều</h6>
    </div>
    <div className="post-slider">
      <div className="item">
        <div className="trending-post">
          {
            postsBestView && postsBestView.map(post => (
              <HorizontalCard post={post} key={post.id} />
            ))
          }
        </div>
      </div>
    </div>
  </>
}
export default PostBestView;