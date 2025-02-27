import { PostType } from "@/types/post.type";
import { formatTime } from "@/utils/helper.util";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React from "react";

interface HorizontalCardProps {
  post: PostType
}

const HorizontalCard: React.FC<HorizontalCardProps> = ({ post }) => {
  return (
    <div className="single-post-list-wrap">
      <div className="media">
        <div className="media-left">
          <img src={post.image} alt="img" width={90} height={70} />
        </div>
        <div className="media-body">
          <div className="details">
            <div className="post-meta-single">
              <ul>
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
          </div>
        </div>
      </div>
    </div>
  )
}
export default HorizontalCard;