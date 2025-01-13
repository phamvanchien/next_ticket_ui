import { faBars, faBell, faCubes, faEnvelopeOpen, faHome, faPlus, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NavItem from "./NavItem";
import { APP_LINK } from "@/enums/app.enum";
import React from "react";

interface WrapAppProps {
  children: React.ReactNode
}

const WrapApp: React.FC<WrapAppProps> = ({ children }) => {
  return (
    <div className="wrapper">
    <nav className="header-app navbar navbar-expand-md navbar-light navbar-white ml-unset bg-primary" style={{height: 38}}>
      <div className="container">
        <ul className="navbar-nav navbar-no-expand float-right p-unset">
          <NavItem href={APP_LINK.INVITATION} className="icon-menu border-right-header">
            <FontAwesomeIcon icon={faHome} />
          </NavItem>
          <NavItem href={APP_LINK.INVITATION} className="icon-menu border-right-header">
            <FontAwesomeIcon icon={faEnvelopeOpen} /> Invitation
          </NavItem>
          <NavItem href={APP_LINK.GO_TO_WORKSPACE} className="icon-menu border-right-header">
            <FontAwesomeIcon icon={faCubes} /> Workspaces
          </NavItem>
          <NavItem href={APP_LINK.PROFILE} className="icon-menu">
            <FontAwesomeIcon icon={faUser} /> Profile
          </NavItem>
        </ul>
      </div>
    </nav>
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