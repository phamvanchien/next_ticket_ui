"use client"
import { faBars, faBell, faEnvelopeOpen, faGear, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect } from "react";
import { APP_LINK } from "@/enums/app.enum";
import NavItem from "./NavItem";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";

const Header = () => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const handleOpenMenu = () => {
    const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>;
    body[0].classList.remove('sidebar-collapse');
    body[0].classList.add('sidebar-open');
  }
  const handleCloseMenu = () => {
    const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>;
    body[0].classList.add('sidebar-collapse');
    body[0].classList.remove('sidebar-open');
  }

  const clickOpenMenu = (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();
    const sidebarOpenClass = document.getElementsByClassName('sidebar-open') as HTMLCollectionOf<HTMLBodyElement>;
    if (sidebarOpenClass.length > 0) {
      handleCloseMenu();
    } else {
      handleOpenMenu();
    }
  }
  useEffect(() => {
    if (window.innerWidth > 768) {
      handleOpenMenu();
    }
  }, []);
  return (
    <nav className="main-header navbar navbar-expand-md navbar-light navbar-white">
      <div className="container" style={{maxWidth: '100%'}}>
        <FontAwesomeIcon className="navbar-brand d-block d-lg-none text-white btn-bars" icon={faBars} size="2x" onClick={clickOpenMenu} />
        <ul className="navbar-nav navbar-no-expand float-right">
          <NavItem href={APP_LINK.INVITATION} className="icon-menu mr-2">
            <FontAwesomeIcon icon={faEnvelopeOpen} /> Invitation
          </NavItem>
          <NavItem href={APP_LINK.PROFILE} className="icon-menu mr-2">
            <FontAwesomeIcon icon={faUser} />
          </NavItem>
          <NavItem href={APP_LINK.HOME} className="icon-menu">
            <FontAwesomeIcon icon={faBell} />
            <span className="badge badge-warning navbar-badge badge-notification">15</span>
          </NavItem>
        </ul>
        {/* <HeaderProfile /> */}
      </div>
    </nav>
  )
}
export default Header;