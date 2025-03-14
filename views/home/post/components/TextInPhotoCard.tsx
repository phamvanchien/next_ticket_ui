import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const TextInPhotoCard = () => {
  return (
    <div className="single-post-wrap style-overlay">
      <div className="thumb">
        <img src="/img_posts/post/5.png" alt="img" />
      </div>
      <div className="details">
        <div className="post-meta-single">
          <p>
            <FontAwesomeIcon icon={faClock} className="mr-2" />
            December 26, 2018
          </p>
        </div>
        <h6 className="title">
          <a href="#">The FAA will test drone </a>
        </h6>
      </div>
    </div>
  )
}
export default TextInPhotoCard;