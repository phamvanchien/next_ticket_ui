"use client"
import HeaderHome from "@/views/home/components/Header";
import TopPost from "./components/TopPost";
import PostVertical from "./components/PostVertical";
import PostWithCategory from "./components/PostWithCategory";
import FooterHome from "../components/Footer";

const HomePostView = () => {
  return <>
    <HeaderHome />
    <TopPost />
    <div className="post-area pd-top-75 pd-bottom-50" id="trending">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <PostVertical title="Xu hướng" cardType="trending" />
          </div>
          <div className="col-lg-3 col-md-6">
            <PostVertical title="Xem nhiều" cardType="cardHorizontal" />
          </div>
          <div className="col-lg-3 col-md-6">
            <PostVertical title="Phần mềm" cardType="cardNomarl" />
          </div>
          <div className="col-lg-3 col-md-6">
            <PostVertical title="Công cụ" cardType="cardNomarlLast" />
          </div>
        </div>
      </div>
    </div>
    <PostWithCategory />
    {/* <div className="pd-top-80 pd-bottom-50" id="grid">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/15.png" alt="img" />
                <a className="tag-base tag-purple" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">Why Are the Offspring of Older </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/16.png" alt="img" />
                <a className="tag-base tag-green" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">People Who Eat a Late Dinner May</a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/17.png" alt="img" />
                <a className="tag-base tag-red" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">Kids eat more calories in </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/18.png" alt="img" />
                <a className="tag-base tag-purple" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">The FAA will test drone </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/19.png" alt="img" />
                <a className="tag-base tag-red" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">Lifting Weights Makes Your Nervous</a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/20.png" alt="img" />
                <a className="tag-base tag-blue" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">New, Remote Weight-Loss Method </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/21.png" alt="img" />
                <a className="tag-base tag-light-green" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">Social Connection Boosts Fitness App </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay">
              <div className="thumb">
                <img src="/img_posts/post/22.png" alt="img" />
                <a className="tag-base tag-blue" href="#">
                  Tech
                </a>
              </div>
              <div className="details">
                <div className="post-meta-single">
                  <p>
                    <i className="fa fa-clock-o" />
                    08.22.2020
                  </p>
                </div>
                <h6 className="title">
                  <a href="#">Internet For Things - New results </a>
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> */}
    <FooterHome />
  </>
}
export default HomePostView;