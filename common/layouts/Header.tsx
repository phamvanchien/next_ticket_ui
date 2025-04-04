"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { faChevronDown, faChevronUp, faGripVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
import AvatarName from "../components/AvatarName";
import { useEffect, useState } from "react";
import LanguageDropdown from "../components/LanguageDropdown";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { getCookie } from "@/utils/cookie.util";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { APP_AUTH } from "@/enums/app.enum";
import { setUser } from "@/reduxs/user.redux";
import { useSelector } from "react-redux";
import UserAvatar from "../components/AvatarName";
import { usePathname } from "next/navigation";
import Logo from "../components/Logo";
import { setWorkspaceSelected } from "@/reduxs/workspace.redux";

const Header = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspaceSelected = useSelector((state: RootState) => state.workspaceSlide).workspaceSelected;
  const [pathPage, setPathPage] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showBarBtn, setShowBarBtn] = useState(false);
  useEffect(() => {
    const userAuth = getCookie(APP_AUTH.COOKIE_AUTH_USER);
    if (userAuth) {
      const userParse = JSON.parse(userAuth);
      dispatch(setUser(userParse));
    }
  }, []);
  useEffect(() => {
    setPathPage('');
    if (pathname) {
      const pathArray = pathname.split('/').filter(p => p !== '');
      if (pathArray.length > 1) {
        setShowBarBtn(true);
      } else {
        setShowBarBtn(false);
        dispatch(setWorkspaceSelected(undefined));
      }
      if (pathArray.length > 0) {
        setPathPage(pathArray[0]);
      }
    }
  }, [pathname]);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{ borderBottom: "1px solid #dee2e6", padding: 'unset', height: 50 }}>
      <div className="container-fluid">
        {
          showBarBtn &&
          <Button color="default" className="navbar-brand text-dark m-unset" onClick={() => {
            document.body.classList.toggle("sb-sidenav-toggled");
          }}>
            <FontAwesomeIcon icon={faGripVertical} size="lg" />
          </Button>
        }
        <Logo width={40} height={40} />
        <a className="navbar-brand ps-2 text-dark text-logo-header m-unset" href="index.html">
          {workspaceSelected ? workspaceSelected.name : 'Next Tech'}
        </a>

        <button className="btn btn-toggle-menu d-block d-lg-none me-auto" onClick={() => setShowMenu(!showMenu)}>
          <FontAwesomeIcon icon={!showMenu ? faChevronDown : faChevronUp} />
        </button>

        <div className="d-lg-none d-flex align-items-center ms-auto mobile-icons">
          <LanguageDropdown />

          <button className="btn me-2" onClick={() => setShowSearch(!showSearch)}>
            <FontAwesomeIcon icon={faSearch} />
          </button>

          <div className="position-relative">
            <UserAvatar name={userLogged?.first_name ?? 'U'} avatar={userLogged?.avatar} />
          </div>
        </div>

        <div className={`collapse navbar-collapse ${showMenu ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav menu-header">
            <li className={`nav-item ${pathPage === 'workspace' ? 'nav-item-active' : ''}`}>
              <Link className="nav-link text-dark" href="/workspace">{t('top_menu.workspace')}</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" href="/projects">Projects</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" href="/tasks">Tasks</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link text-dark" href="/calendar">Calendar</Link>
            </li>
            <li className="nav-item d-none d-lg-block" style={{ lineHeight: '3.5' }}>
              <LanguageDropdown />
            </li>
          </ul>

          <form className="d-none d-lg-flex ms-auto me-3">
            <div className="input-group">
              <input className="form-control" type="text" placeholder={t('search_label')} aria-label="Search" />
              <button className="btn btn-primary" type="button">
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>

          <ul className="navbar-nav d-none d-lg-flex">
            <li className="nav-item">
              <UserAvatar name={userLogged?.first_name ?? 'U'} avatar={userLogged?.avatar} />
            </li>
          </ul>
        </div>

        {showSearch && (
          <form className="w-100 my-2">
            <div className="input-group">
              <input className="form-control" type="text" placeholder={t('search_label')} aria-label="Search" />
              <button className="btn btn-primary" type="button" onClick={() => setShowSearch(false)}>
                <FontAwesomeIcon icon={faSearch} />
              </button>
            </div>
          </form>
        )}
      </div>
    </nav>
  );
};

export default Header;
