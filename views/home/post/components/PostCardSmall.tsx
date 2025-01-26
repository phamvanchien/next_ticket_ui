import { PostType } from "@/types/post.type";
import { formatTime } from "@/utils/helper.util";
import Link from "next/link";
import React from "react";

interface PostCardSmallProps {
  post: PostType
}

const PostCardSmall: React.FC<PostCardSmallProps> = ({ post }) => {
  return (
    <div className="card">
      <div className="card-body p-unset">
        <img src={post.image} className="float-left mr-2 w-40" alt="Card image cap" />
        <div style={{ width: '99%' }}>
          <h6 className="text-dark mt-2 post-title">
            <Link href={''}>{post.title}</Link>
          </h6>
          <span className="text-muted text-time-post">{formatTime(new Date(post.created_at))}</span>
        </div>
      </div>
    </div>
  )
}
export default PostCardSmall;