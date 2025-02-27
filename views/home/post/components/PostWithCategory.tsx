import { categoryWithPost } from "@/api/post.api";
import { API_CODE } from "@/enums/api.enum";
import { CategoryWithPost } from "@/types/post.type";
import { useEffect, useState } from "react";
import NormalCard from "./NormalCard";

const PostWithCategory = () => {
  const [categoryWithPostsData, setCategoryWithPostsData] = useState<CategoryWithPost[]>();
  const loadCategoryWithPosts = async () => {
    try {
      const response = await categoryWithPost(1, 3);
      if (response.code === API_CODE.OK) {
        setCategoryWithPostsData(response.data.items);
      }
    } catch (error) {
      return;
    }
  }
  useEffect(() => {
    loadCategoryWithPosts();
  }, []);
  return (
    <div className="bg-sky pd-bottom-50" id="latest">
      {
        categoryWithPostsData?.filter(e => e.posts.length > 0)?.map(item => (
          <div className="container" key={item.id}>
            <div className="section-title">
              <h4 className="title">{item.title}</h4>
            </div>
            <div className="row">
              {
                item.posts.map(post => (
                  <div className="col-lg-3 col-sm-6" key={post.id}>
                    <NormalCard post={post} />
                  </div>
                ))
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}
export default PostWithCategory;