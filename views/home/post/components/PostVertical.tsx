import React, { useEffect, useState } from "react";
import PostTrending from "./PostTrending";
import HorizontalCard from "./HorizontalCard";
import { posts } from "@/api/post.api";
import { PostType } from "@/types/post.type";
import { API_CODE } from "@/enums/api.enum";
import NormalCard from "./NormalCard";
import LoadingPost from "@/common/components/LoadingPost";

interface PostVerticalProps {
  title?: string
  cardType: "trending" | "cardHorizontal" | "cardNomarl" | "cardNomarlLast"
}

const PostVertical: React.FC<PostVerticalProps> = ({ title, cardType }) => {
  const [postsTrending, setPostsTrending] = useState<PostType[]>();
  const [postsBestView, setPostsBestView] = useState<PostType[]>();
  const [postsSoftware, setPostsSoftware] = useState<PostType[]>();
  const [postsTool, setPostsTool] = useState<PostType[]>();
  const loadPosts = async () => {
    try {
      const [trending, bestView, software, tool] = await Promise.all([
        await posts({
          categoryId: '25',
          page: 1,
          size: 6
        }),
        await posts({
          sortBestView: "DESC",
          page: 1,
          size: 15
        }),
        await posts({
          categoryId: '13',
          page: 1,
          size: 3
        }),
        await posts({
          categoryId: '52',
          sortBestView: "DESC",
          page: 1,
          size: 3
        })
      ]);
      if (trending.code === API_CODE.OK) {
        setPostsTrending(trending.data.items);
      }
      if (bestView.code === API_CODE.OK) {
        setPostsBestView(bestView.data.items);
      }
      if (software.code === API_CODE.OK) {
        setPostsSoftware(software.data.items);
      }
      if (tool.code === API_CODE.OK) {
        setPostsTool(tool.data.items);
      }
    } catch (error) {
      return;
    }
  }
  useEffect(() => {
    loadPosts();
  }, []);
  return <>
    {
      title &&
      <div className="section-title">
        <h4 className="title">{title}</h4>
      </div>
    }
    <div className="post-slider">
      <div className="item">
        <div className="trending-post">
          {
            (cardType === 'trending' && postsTrending) &&
            postsTrending.map(post => (
              <PostTrending post={post} key={post.id} />
            ))
          }
          {
            (cardType === 'cardHorizontal' && postsBestView) &&
            postsBestView.map(post => (
              <HorizontalCard post={post} key={post.id} />
            ))
          }
          {
            (cardType === 'cardNomarl' && postsSoftware) &&
            postsSoftware.map(post => (
              <NormalCard post={post} key={post.id} />
            ))
          }
          {
            (cardType === 'cardNomarlLast' && postsTool) &&
            postsTool.map(post => (
              <NormalCard post={post} key={post.id} />
            ))
          }
        </div>
      </div>
    </div>
  </>
}
export default PostVertical;