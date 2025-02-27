"use client"
import { CategoryType, PostType } from "@/types/post.type";
import FooterHome from "../components/Footer";
import HeaderHome from "../components/Header";
import React, { useEffect, useState } from "react";
import CategoryInPost from "../post_detail/components/CategoryInPost";
import NormalCard from "../post/components/NormalCard";
import { ResponseWithPaginationType } from "@/types/base.type";
import { API_CODE } from "@/enums/api.enum";
import { posts as postApi } from "@/api/post.api";

interface HomeCategoryViewProps {
  category: CategoryType
  posts: ResponseWithPaginationType<PostType[]>
  categoriesId: string[]
}

const HomeCategoryView: React.FC<HomeCategoryViewProps> = ({ category, posts, categoriesId }) => {
  const defaultSize = 8;
  const [postsData, setPostsData] = useState<ResponseWithPaginationType<PostType[]>>(posts);
  const [pageSize, setPageSize] = useState(defaultSize);
  const loadPostsByCategory = async () => {
    try {
      const response = await postApi({
        categoryId: categoriesId.join(','),
        page: 1,
        size: pageSize,
        sortCreatedAt: "DESC"
      });
      if (response && response.code === API_CODE.OK) {
        setPostsData(response.data);
      }
    } catch (error) {
      return;
    }
  }
  const handleClickLoadMore = async () => {
    setPageSize(pageSize + defaultSize);
  }
  useEffect(() => {
    loadPostsByCategory();
  }, [pageSize]);
  return <>
    <HeaderHome />
    <div className="post-area pd-top-75 pd-bottom-50" id="trending">
      <div className="container">
        <div className="row mb-4">
          <div className="col-12">
            <h4>{category.title}</h4>
          </div>
          <div className="col-12">
            <div className="widget widget_tag_cloud">
              <CategoryInPost categories={category.childrens} />
            </div>
          </div>
        </div>
        <div className="row">
          {
            postsData.items.map(post => (
              <div className="col-12 col-lg-3" key={post.id}>
                <NormalCard post={post} />
              </div>
            ))
          }
        </div>
        {
          (postsData && postsData.totalPage > 1 && pageSize < postsData?.total) &&
          <div className="row mt-4">
            <div className="col-12 text-center">
              <button className="btn btn-blue" onClick={handleClickLoadMore}>Xem thêm</button>
            </div>
          </div>
        }
      </div>
    </div>
    <FooterHome />
  </>
}
export default HomeCategoryView;