import React from "react";
import TextInPhotoCard from "./TextInPhotoCard";
import HorizontalCard from "./HorizontalCard";

interface PostVerticalProps {
  title: string
  cardType: "textInPhoto" | "cardHorizontal"
}

const PostVertical: React.FC<PostVerticalProps> = ({ title, cardType }) => {
  return <>
    <div className="section-title">
        <h6 className="title">{title}</h6>
    </div>
    <div className="post-slider">
      <div className="item">
        <div className="trending-post">
          {
            cardType === 'textInPhoto' && <TextInPhotoCard />
          }
          {
            cardType === 'cardHorizontal' && <HorizontalCard />
          }
        </div>
      </div>
    </div>
  </>
}
export default PostVertical;