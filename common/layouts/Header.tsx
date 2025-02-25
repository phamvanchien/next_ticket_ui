"use client"
import { faBars, faCubes, faEnvelopeOpen, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect } from "react";
import { APP_LINK } from "@/enums/app.enum";
import NavItem from "./NavItem";
import { useTranslations } from "next-intl";

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const t = useTranslations();
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
    <nav className={`navbar main-header navbar-expand-lg navbar-light bg-light w-100 ${className ?? ''}`} style={{flexWrap: 'unset'}}>
      <FontAwesomeIcon className="navbar-brand d-block d-lg-none text-dark btn-bars pt-unset" icon={faBars} size="2x" onClick={clickOpenMenu} />
      <a className="navbar-brand" href="#">
        <img src="/img/logo.png" height={40} />
      </a>
      <a className="nav-link" href="#">
        {t('top_menu.invitation')}
      </a>
      <a className="nav-link" href="#">
        {t('top_menu.workspace')}
      </a>
      <a className="nav-link" href="#">
      {t('top_menu.profile')}
      </a>
    </nav>
    // <nav className={`main-header navbar navbar-expand-md navbar-light navbar-white ${className ?? ''}`}>
    //   <div className="container" style={{maxWidth: '100%'}}>
    //     <FontAwesomeIcon className="navbar-brand d-block d-lg-none text-dark btn-bars pt-unset" icon={faBars} size="2x" onClick={clickOpenMenu} />
    //     <img src="/img/logo.png" height={50} />
    //     <ul className="navbar-nav navbar-no-expand float-right">
    //       <NavItem href={APP_LINK.INVITATION} className="icon-menu border-right-header">
    //         <FontAwesomeIcon icon={faEnvelopeOpen} /> {t('top_menu.invitation')}
    //       </NavItem>
    //       <NavItem href={APP_LINK.GO_TO_WORKSPACE} className="icon-menu border-right-header">
    //         <FontAwesomeIcon icon={faCubes} /> {t('top_menu.workspace')}
    //       </NavItem>
    //       <NavItem href={APP_LINK.PROFILE} className="icon-menu">
    //         <FontAwesomeIcon icon={faUser} /> {t('top_menu.profile')}
    //       </NavItem>
    //     </ul>
    //   </div>
    // </nav>
  )
}
export default Header;