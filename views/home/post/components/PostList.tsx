import { useEffect, useState } from "react";
import PostCardMedium from "./PostCardMedium";

const PostList = () => {
  const [postData, setPostData] = useState();
  useEffect(() => {

  }, []);
  return (
    <div className="row mb-2">
      <div className="col-md-12 blog-main">
        <h3 className="pb-3 mb-4 font-italic border-bottom">
          From the Firehose
        </h3>
      </div>
      <div className="col-md-3 col-6">
        <PostCardMedium />
      </div>
      <div className="col-md-3 col-6">
        <PostCardMedium />
      </div>
      <div className="col-md-3 col-6">
        <PostCardMedium />
      </div>
      <div className="col-md-3 col-6">
        <PostCardMedium />
      </div>
    </div>
  )
}
export default PostList;