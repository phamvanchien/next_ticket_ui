import { PostType } from "@/types/post.type";
import { formatTime } from "@/utils/helper.util";
import Link from "next/link";
import React from "react";

interface PostCardLargeProps {
  post?: PostType
}

const PostCardLarge: React.FC<PostCardLargeProps> = ({ post }) => {
  if (!post) {
    return <></>
  }
  return (
    <div className="card">
      <img className="card-img-top" src={post.image} alt="Card image cap" style={{height: 350}} />
      <div className="card-body p-10">
        {
          post.categories.length > 0 &&
          <strong className="d-inline-block mb-2 text-primary">{post.categories[0].title}</strong>
        }
        <h5 className="mb-0">
          <Link className="text-dark post-title" href="#">{post.title}</Link>
        </h5>
        <div className="mb-1 text-muted">{formatTime(new Date(post.created_at))}</div>
        <p className="card-text mb-auto">
          {post.summary.length > 50 ? post.summary.substring(0, 100) : post.summary}...
        </p>
        <a href="#">Continue reading</a>
      </div>
    </div>
  )
}
export default PostCardLarge;