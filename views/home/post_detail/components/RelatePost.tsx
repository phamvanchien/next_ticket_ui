import { posts } from "@/api/post.api";
import { API_CODE } from "@/enums/api.enum";
import { CategoryType, PostType } from "@/types/post.type";
import React, { useEffect, useState } from "react";
import NormalCard from "../../post/components/NormalCard";

interface RelatePostProps {
  post: PostType
}

const RelatePost: React.FC<RelatePostProps> = ({ post }) => {
  const [relatePosts, setRelatePosts] = useState<PostType[]>();
  useEffect(() => {
    const loadRelatePosts = async () => {
      try {
        const response = await posts({
          categoryId: post.categories.map(c => c.id.toString()).join(','),
          page: 1,
          size: 8
        });
        if (response && response.code === API_CODE.OK) {
          setRelatePosts(response.data.items);
        }
      } catch (error) {
        return;
      }
    }
    loadRelatePosts();
  }, []);
  if (!relatePosts) {
    return <></>
  }
  return <>
    <div className="section-title mt-4">
      <h4 className="title">Bài viết liên quan</h4>
    </div>
    <div className="row">
      {
        relatePosts.filter(p => p.id !== post.id).map(post => (
          <div className="col-lg-3 col-sm-6" key={post.id}>
            <NormalCard post={post} />
          </div>
        ))
      }
    </div>
  </>
}
export default RelatePost;