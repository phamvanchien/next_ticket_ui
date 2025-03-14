import { PostType } from "@/types/post.type";
import { formatTime } from "@/utils/helper.util";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

interface NormalCardProps {
  post: PostType
}

const NormalCard: React.FC<NormalCardProps> = ({ post }) => {
  return (
    <div className="single-post-wrap">
      <div className="thumb">
        <img src={post.image} alt="img" height={200} style={{width: '100%'}} />
      </div>
      <div className="details">
        <div className="post-meta-single mb-4 pt-1">
          <ul>
            {
              (post?.categories && post.categories.length > 0) &&
              <li>
                <Link className="tag-base tag-blue" href={`/chuyen-muc/${post?.categories[0].slug}`}>
                  {post?.categories[0].title}
                </Link>
              </li>
            }
            <li>
              <FontAwesomeIcon icon={faClock} className="mr-2" />
              {formatTime(new Date(post.created_at))}
            </li>
          </ul>
        </div>
        <h6 className="title">
          <Link href={'/' + post.slug}>
            {post.title}
          </Link>
        </h6>
        <p>
          {post.summary.substring(0, 120)} ...
        </p>
      </div>
    </div>
  )
}
export default NormalCard;