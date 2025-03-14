import { PostType } from "@/types/post.type";
import { formatTime } from "@/utils/helper.util";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

interface PostTrendingProps {
  post: PostType
}

const PostTrending: React.FC<PostTrendingProps> = ({ post }) => {
  return (
    <div className="single-post-wrap style-overlay">
      <div className="thumb">
        <img src={post.image} alt="img" />
      </div>
      <div className="details">
        <div className="post-meta-single">
          <p>
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            {formatTime(new Date(post.created_at))}
          </p>
        </div>
        <h6 className="title">
          <Link href={'/' + post.slug}>
            {post.title}
          </Link>
        </h6>
      </div>
    </div>
  )
}
export default PostTrending;