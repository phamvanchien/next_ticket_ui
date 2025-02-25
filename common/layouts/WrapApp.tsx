"use client"
import React from "react";
import { useTranslations } from "next-intl";
import Header from "./Header";

interface WrapAppProps {
  children: React.ReactNode
}

const WrapApp: React.FC<WrapAppProps> = ({ children }) => {
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
  return (
    <div className="wrapper">
      {/* <nav className="header-app navbar navbar-expand-md navbar-light navbar-white p-unset">
        <div className="container">
          <ul className="navbar-nav navbar-no-expand float-right">
            <NavItem href={APP_LINK.INVITATION} className="icon-menu text-center border-right-header">
              <FontAwesomeIcon icon={faEnvelopeOpen} /> {t('top_menu.invitation')}
            </NavItem>
            <NavItem href={APP_LINK.GO_TO_WORKSPACE} className="icon-menu text-center border-right-header">
              <FontAwesomeIcon icon={faCubes} /> {t('top_menu.workspace')}
            </NavItem>
            <NavItem href={APP_LINK.PROFILE} className="icon-menu text-center">
              <FontAwesomeIcon icon={faUser} /> {t('top_menu.profile')}
            </NavItem>
            <NavItem href={APP_LINK.CALENDAR} className="icon-menu text-center">
              <FontAwesomeIcon icon={faCalendarDay} /> {t('top_menu.calendar')}
            </NavItem>
          </ul>
        </div>
      </nav> */}
      <Header className="content-wrapper-app" />
      <div className="content-wrapper content-wrapper-app pt-unset">
        <div className="content">
          <div className="container main-container-app">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
export default WrapApp;