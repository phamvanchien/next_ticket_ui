"use client"
import { faBars, faNavicon, faTimes, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import Button from "../components/Button";
import { APP_AUTH, APP_LINK, IMAGE_DEFAULT } from "@/enums/app.enum";
import Link from "next/link";
import Dropdown from "../dropdown/Dropdown";
import DropdownItem from "../dropdown/DropdownItem";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { getCookie } from "@/utils/cookie.util";
import { setUser } from "@/reduxs/user.redux";

interface HeaderProps {
  className?: string
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const [openMenuMobile, setOpenMenuMobile] = useState(false);
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

  const clickOpenMenu = (event: React.MouseEvent<HTMLAnchorElement>) => {
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
  useEffect(() => {
    const userAuth = getCookie(APP_AUTH.COOKIE_AUTH_USER);
    if (userAuth) {
      const userParse = JSON.parse(userAuth);
      dispatch(setUser(userParse));
    }
  }, []);
  return (
    <nav className="main-header navbar navbar-expand-md navbar-light navbar-white" style={{ marginLeft: 'unset' }}>
      <div className="container" style={{ maxWidth: '100%' }}>
        <Link href="/" className="navbar-brand" onClick={clickOpenMenu}>
          <img
            src="/img/logo-3.png"
            alt="AdminLTE Logo"
            className="brand-image mt-2"
            width={145}
            height={40}
          />
        </Link>
        <Button
          color="default"
          className="navbar-toggler order-1"
          type="button"
          onClick={() => setOpenMenuMobile (openMenuMobile ? false : true)}
        >
          {openMenuMobile ? <FontAwesomeIcon icon={faTimes} /> : <FontAwesomeIcon icon={faNavicon} />}
        </Button>
        <div className={`collapse navbar-collapse order-3 ${openMenuMobile ? 'show' : ''}`} id="navbarCollapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link href={APP_LINK.GO_TO_WORKSPACE} className="nav-link">
                {t('top_menu.workspace')}
              </Link>
            </li>
            <li className="nav-item">
              <Link href={APP_LINK.INVITATION} className="nav-link">
                {t('top_menu.invitation')}
              </Link>
            </li>
            <li className="nav-item mr-3">
              <Button color="primary" className="mt-2">
                Create
              </Button>
            </li>
            <li className="nav-item dropdown dropdown-lang">
              <LanguageSwitcher dropdown />
            </li>
          </ul>
        </div>
        <ul className="order-1 order-md-3 navbar-nav navbar-no-expand ml-auto">
          {userLogged && <li className="nav-item" style={{marginTop: 0}}>
            <Link href={APP_LINK.PROFILE} className="nav-link">
              <b>Hi {userLogged.last_name}</b>
            </Link>
          </li>}
          <li className="nav-item">
            <Link
              className="nav-link btn-avatar-header"
              data-widget="control-sidebar"
              data-slide="true"
              href={APP_LINK.PROFILE}
              role="button"
            >
              <img src={userLogged?.avatar ?? IMAGE_DEFAULT.NO_USER} width={40} height={40} className="img-circle" onError={(e) => e.currentTarget.src = IMAGE_DEFAULT.NO_USER} />
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Header;