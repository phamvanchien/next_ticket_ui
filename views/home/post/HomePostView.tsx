"use client"
import HeaderHome from "@/views/home/components/Header";
import TopPost from "./components/TopPost";
import PostVertical from "./components/PostVertical";

const HomePostView = () => {
  return <>
    <HeaderHome />
    <TopPost />
    <div className="post-area pd-top-75 pd-bottom-50" id="trending">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-md-6">
            <PostVertical title="Xu hướng" cardType="textInPhoto" />
          </div>
          <div className="col-lg-3 col-md-6">
            <PostVertical title="Mới nhất" cardType="cardHorizontal" />
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="section-title">
              <h6 className="title">What’s new</h6>
            </div>
            <div className="post-slider">
              <div className="item">
                <div className="single-post-wrap">
                  <div className="thumb">
                    <img src="/img_posts/post/8.png" alt="img" />
                  </div>
                  <div className="details">
                    <div className="post-meta-single mb-4 pt-1">
                      <ul>
                        <li>
                          <a className="tag-base tag-blue" href="#">
                            Tech
                          </a>
                        </li>
                        <li>
                          <i className="fa fa-clock-o" />
                          08.22.2020
                        </li>
                      </ul>
                    </div>
                    <h6 className="title">
                      <a href="#">
                        Uttarakhand’s Hemkund Sahib yatra to start from September
                        4
                      </a>
                    </h6>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipi sicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="single-post-wrap">
                  <div className="thumb">
                    <img src="/img_posts/post/8.png" alt="img" />
                  </div>
                  <div className="details">
                    <div className="post-meta-single mb-4 pt-1">
                      <ul>
                        <li>
                          <a className="tag-base tag-blue" href="#">
                            Tech
                          </a>
                        </li>
                        <li>
                          <i className="fa fa-clock-o" />
                          08.22.2020
                        </li>
                      </ul>
                    </div>
                    <h6 className="title">
                      <a href="#">
                        Uttarakhand’s Hemkund Sahib yatra to start from September
                        4
                      </a>
                    </h6>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipi sicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="section-title">
              <h6 className="title">Join With Us</h6>
            </div>
            <div className="social-area-list mb-4">
              <ul>
                <li>
                  <a className="facebook" href="#">
                    <i className="fa fa-facebook social-icon" />
                    <span>12,300</span>
                    <span>Like</span> <i className="fa fa-plus" />
                  </a>
                </li>
                <li>
                  <a className="twitter" href="#">
                    <i className="fa fa-twitter social-icon" />
                    <span>12,600</span>
                    <span>Followers</span> <i className="fa fa-plus" />
                  </a>
                </li>
                <li>
                  <a className="youtube" href="#">
                    <i className="fa fa-youtube-play social-icon" />
                    <span>1,300</span>
                    <span>Subscribers</span> <i className="fa fa-plus" />
                  </a>
                </li>
                <li>
                  <a className="instagram" href="#">
                    <i className="fa fa-instagram social-icon" />
                    <span>52,400</span>
                    <span>Followers</span> <i className="fa fa-plus" />
                  </a>
                </li>
                <li>
                  <a className="google-plus" href="#">
                    <i className="fa fa-google social-icon" />
                    <span>19,101</span>
                    <span>Subscribers</span> <i className="fa fa-plus" />
                  </a>
                </li>
              </ul>
            </div>
            <div className="add-area">
              <a href="#">
                <img className="w-100" src="/img_posts/add/6.png" alt="img" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="bg-sky pd-top-80 pd-bottom-50" id="latest">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap style-overlay-bg">
              <div className="thumb">
                <img src="/img_posts/post/9.png" alt="img" />
              </div>
              <div className="details">
                <div className="post-meta-single mb-3">
                  <ul>
                    <li>
                      <a className="tag-base tag-blue" href="cat-fashion.html">
                        fashion
                      </a>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-clock-o" />
                        08.22.2020
                      </p>
                    </li>
                  </ul>
                </div>
                <h6 className="title">
                  <a href="#">
                    A Comparison of the Sony FE 85mm f/1.4 GM and Sigma
                  </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap">
              <div className="thumb">
                <img src="/img_posts/post/10.png" alt="img" />
                <p className="btn-date">
                  <i className="fa fa-clock-o" />
                  08.22.2020
                </p>
              </div>
              <div className="details">
                <h6 className="title">
                  <a href="#">Rocket Lab will resume launches no sooner than</a>
                </h6>
              </div>
            </div>
            <div className="single-post-wrap">
              <div className="thumb">
                <img src="/img_posts/post/11.png" alt="img" />
                <p className="btn-date">
                  <i className="fa fa-clock-o" />
                  08.22.2020
                </p>
              </div>
              <div className="details">
                <h6 className="title">
                  <a href="#">
                    P2P Exchanges in Africa Pivot: Nigeria and Kenya the
                  </a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="single-post-wrap">
              <div className="thumb">
                <img src="/img_posts/post/12.png" alt="img" />
                <p className="btn-date">
                  <i className="fa fa-clock-o" />
                  08.22.2020
                </p>
              </div>
              <div className="details">
                <h6 className="title">
                  <a href="#">
                    Bitmex Restricts Ontario Residents as Mandated by
                  </a>
                </h6>
              </div>
            </div>
            <div className="single-post-wrap">
              <div className="thumb">
                <img src="/img_posts/post/13.png" alt="img" />
                <p className="btn-date">
                  <i className="fa fa-clock-o" />
                  08.22.2020
                </p>
              </div>
              <div className="details">
                <h6 className="title">
                  <a href="#">The Bitcoin Network Now 7 Plants Worth of Power</a>
                </h6>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="trending-post style-box">
              <div className="section-title">
                <h6 className="title">Trending News</h6>
              </div>
              <div className="post-slider owl-carousel">
                <div className="item">
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
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Important to rate more liquidity</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/2.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Sounds like John got the Josh</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/3.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Grayscale's and Bitcoin Trusts</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/4.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Sounds like John got the Josh</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap mb-0">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/5.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Grayscale's and Bitcoin Trusts</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="item">
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
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Important to rate more liquidity</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/2.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Sounds like John got the Josh</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/3.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Grayscale's and Bitcoin Trusts</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/4.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Sounds like John got the Josh</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="single-post-list-wrap mb-0">
                    <div className="media">
                      <div className="media-left">
                        <img src="/img_posts/post/list/5.png" alt="img" />
                      </div>
                      <div className="media-body">
                        <div className="details">
                          <div className="post-meta-single">
                            <ul>
                              <li>
                                <i className="fa fa-clock-o" />
                                08.22.2020
                              </li>
                            </ul>
                          </div>
                          <h6 className="title">
                            <a href="#">Grayscale's and Bitcoin Trusts</a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="pd-top-80 pd-bottom-50" id="grid">
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
    </div>
    <div className="footer-area bg-black pd-top-95">
      <div className="container">
        <div className="row">
          <div className="col-lg-3 col-sm-6">
            <div className="widget">
              <h5 className="widget-title">ABOUT US</h5>
              <div className="widget_about">
                <p>
                  Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
                  labore et dolore magna aliqua. Quis ipsum ultrices gravida.
                  Risus commodo viverra maecenas accumsan lacus vel facilisis.
                </p>
                <ul className="social-area social-area-2 mt-4">
                  <li>
                    <a className="facebook-icon" href="#">
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a className="twitter-icon" href="#">
                      <i className="fa fa-twitter" />
                    </a>
                  </li>
                  <li>
                    <a className="youtube-icon" href="#">
                      <i className="fa fa-youtube-play" />
                    </a>
                  </li>
                  <li>
                    <a className="instagram-icon" href="#">
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a className="google-icon" href="#">
                      <i className="fa fa-google-plus" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="widget widget_tag_cloud">
              <h5 className="widget-title">TAGS</h5>
              <div className="tagcloud">
                <a href="#">Consectetur</a>
                <a href="#">Video</a>
                <a href="#">App</a>
                <a href="#">Food</a>
                <a href="#">Game</a>
                <a href="#">Internet</a>
                <a href="#">Phones</a>
                <a href="#">Development</a>
                <a href="#">Video</a>
                <a href="#">Game</a>
                <a href="#">Gadgets</a>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="widget">
              <h5 className="widget-title">CONTACTS</h5>
              <ul className="contact_info_list">
                <li>
                  <i className="fa fa-map-marker" /> 829 Cabell Avenue Arlington,
                  VA 22202
                </li>
                <li>
                  <i className="fa fa-phone" /> +088 012121240
                </li>
                <li>
                  <i className="fa fa-envelope-o" /> Info@website.com <br />{" "}
                  Support@mail.com
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-3 col-sm-6">
            <div className="widget widget_recent_post">
              <h5 className="widget-title">POPULAR NEWS</h5>
              <div className="single-post-list-wrap style-white">
                <div className="media">
                  <div className="media-left">
                    <img src="/img_posts/post/list/1.png" alt="img" />
                  </div>
                  <div className="media-body">
                    <div className="details">
                      <div className="post-meta-single">
                        <ul>
                          <li>
                            <i className="fa fa-clock-o" />
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
              <div className="single-post-list-wrap style-white">
                <div className="media">
                  <div className="media-left">
                    <img src="/img_posts/post/list/2.png" alt="img" />
                  </div>
                  <div className="media-body">
                    <div className="details">
                      <div className="post-meta-single">
                        <ul>
                          <li>
                            <i className="fa fa-clock-o" />
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
            </div>
          </div>
        </div>
        <div className="footer-bottom text-center">
          <ul className="widget_nav_menu">
            <li>
              <a href="#">About</a>
            </li>
            <li>
              <a href="#">Terms &amp; Conditions</a>
            </li>
            <li>
              <a href="#">rivacy Policy</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
          </ul>
          <p>
            Copyright ©2021 <a href="https://solverwp.com/">SolverWp</a>
          </p>
        </div>
      </div>
    </div>
  </>

//   return <>
//   <div className="container">
//     <HeaderHome />
//     <CategoryMenu />
//     <TopPost />
//     <PostList />
//     <div className="row mb-2">
//       <div className="col-md-12 blog-main">
//         <h3 className="pb-3 mb-4 font-italic border-bottom">
//           From the Firehose
//         </h3>
//       </div>
//       <div className="col-md-6 col-12">
//         <PostCardLarge />
//       </div>
//       <div className="col-md-6 col-12">
//         <div className="nav-scroller py-1 mb-2">
//           <nav className="nav d-flex justify-content-between">
//             <a className="p-2 text-muted" href="#">World</a>
//             <a className="p-2 text-muted" href="#">U.S.</a>
//             <a className="p-2 text-muted" href="#">Technology</a>
//             <a className="p-2 text-muted" href="#">Design</a>
//             <a className="p-2 text-muted" href="#">Culture</a>
//             <a className="p-2 text-muted" href="#">Business</a>
//             <a className="p-2 text-muted" href="#">Politics</a>
//           </nav>
//         </div>
//         {/* <PostCardSmall />
//         <PostCardSmall />
//         <PostCardSmall />
//         <PostCardSmall /> */}
//       </div>
//     </div>
//   </div>
//   <FooterHome />
// </>
}
export default HomePostView;