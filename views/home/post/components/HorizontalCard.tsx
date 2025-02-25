import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HorizontalCard = () => {
  return (
    <div className="single-post-list-wrap">
      <div className="media">
        <div className="media-left">
          <img src="/img_posts/post/list/1.png" alt="img" />
        </div>
        <div className="media-body">
          <div className="details">
            <div className="post-meta-single">
              <ul>
                <li>
                  <FontAwesomeIcon icon={faClock} className="mr-2" />
                  08.22.2020
                </li>
              </ul>
            </div>
            <h6 className="title">
              <a href="#">
                Himachal Pradesh rules in order to allow tourists{" "}
              </a>
            </h6>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HorizontalCard;