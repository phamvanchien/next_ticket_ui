import { useEffect, useState } from "react";
import PostCardLarge from "./PostCardLarge";
import PostCardSmall from "./PostCardSmall";
import { PostType } from "@/types/post.type";
import { topPosts } from "@/api/post.api";
import { API_CODE } from "@/enums/api.enum";

const TopPost = () => {
  const [postTop, setPostTop] = useState<PostType>();
  const [postList, setPostList] = useState<PostType[]>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await topPosts();
        setLoading(false);
        if (response && response.code === API_CODE.OK && response.data.length > 0) {
          setPostList(response.data.splice(1, 20));
          setPostTop(response.data[0]);
          return;
        }
      } catch (error) {
        return;
      }
    }
    loadPosts();
  }, []);
  useEffect(() => {
    if (postList)
      console.log('POST DATA', postList)
  }, [postList])
  return (
    <div className="row mb-2">
      <div className="col-md-8 col-12">
        <PostCardLarge post={postTop} />
      </div>
      <div className="col-md-4 col-12">
        {
          postList && postList.map(post => (
            <PostCardSmall post={post} key={post.id} />
          ))
        }
      </div>
    </div>
  )
}
export default TopPost;