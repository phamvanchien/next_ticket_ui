import { PostType } from "@/types/post.type";
import { formatTime } from "@/utils/helper.util";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

interface PostCardTopProps {
  post: PostType
}

const PostCardTop: React.FC<PostCardTopProps> = ({ post }) => {
  return (
    <div className="single-post-wrap style-white">
      <div className="thumb">
        <img src={post.image} alt="img" height={220} />
        {
          (post.categories && post.categories.length > 0) &&
          <Link className="tag-base tag-blue" href={`/chuyen-muc/${post.categories[0].slug}`}>
            {post.categories[0].title}
          </Link>
        }
        </div>
        <div className="details">
        <h6 className="title">
            <Link href={`/${post.slug}`}>{post.title}</Link>
        </h6>
        <div className="post-meta-single mt-3">
          <ul>
            <li>
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              {formatTime(new Date(post.created_at))}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default PostCardTop;