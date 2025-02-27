import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryMenu from "./CategoryMenu";
import Link from "next/link";

const HeaderHome = () => {
  return <>
    <div className="td-search-popup" id="td-search-popup">
    <form action="index.html" className="search-form">
      <div className="form-group">
        <input type="text" className="form-control" placeholder="Search....." />
      </div>
      <button type="submit" className="submit-btn">
        <i className="fa fa-search" />
      </button>
    </form>
    </div>
    <div className="body-overlay" id="body-overlay" />
    <div className="navbar-area">
      {/* <div className="topbar-area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6 col-md-7 align-self-center">
              <div className="topbar-menu text-md-left text-center">
                <ul className="align-self-center">
                  <li>
                    <a href="#">Author</a>
                  </li>
                  <li>
                    <a href="#">Advertisment</a>
                  </li>
                  <li>
                    <a href="#">Member</a>
                  </li>
                  <li>
                    <a href="#">Sitemap</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-5 mt-2 mt-md-0 text-md-right text-center">
              <div className="topbar-social">
                <div className="topbar-date d-none d-lg-inline-block">
                  <i className="fa fa-calendar" /> Saturday, October 7
                </div>
                <ul className="social-area social-area-2">
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
        </div>
      </div> */}
      <div className="adbar-area bg-black d-none d-lg-block">
        <div className="container">
          <div className="row">
            <div className="col-xl-6 col-lg-5 align-self-center">
              <div className="logo text-md-left text-center">
                <Link className="main-logo" href="/">
                  <img src="/img_posts/logo.png" alt="img" />
                </Link>
              </div>
            </div>
            <div className="col-xl-6 col-lg-7 text-md-right text-center">
              <a href="#" className="adbar-right">
                <img src="/img_posts/add/1.png" alt="img" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <nav className="navbar navbar-expand-lg">
        <div className="container nav-container">
          <div className="responsive-mobile-menu">
            <div className="logo d-lg-none d-block">
              <a className="main-logo" href="index.html">
                <img src="/img_posts/logo.png" alt="img" />
              </a>
            </div>
            <button
              className="menu toggle-btn d-block d-lg-none"
              data-target="#nextpage_main_menu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="icon-left" />
              <span className="icon-right" />
            </button>
          </div>
          <div className="nav-right-part nav-right-part-mobile">
            <a className="search header-search" href="#">
              <i className="fa fa-search" />
            </a>
          </div>
          <CategoryMenu />
          <div className="nav-right-part nav-right-part-desktop">
            <div className="menu-search-inner">
              <input type="text" placeholder="Search For" />
              <button type="submit" className="submit-btn">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  </>
}
export default HeaderHome;