"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "../components/Button";
import { faBell, faChevronDown, faChevronUp, faGripVertical, faSearch } from "@fortawesome/free-solid-svg-icons";
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
import NotifyBell from "./NotifyBell";
import { NotificationType } from "@/types/notification.type";
import { notifications } from "@/api/notification.api";
import { API_CODE } from "@/enums/api.enum";
import { useSocket } from "@/hooks/useSocket";

const Header = () => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const userUpdated = useSelector((state: RootState) => state.userSlice).userUpdated;
  const [pathPage, setPathPage] = useState<string>('');
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showBarBtn, setShowBarBtn] = useState(false);
  const [userData, setUserData] = useState(userLogged);
  const [notificationData, setNotificationData] = useState<NotificationType[]>([]);
  const [notificationTotal, setNotificationTotal] = useState<number>(0);
  const socket = useSocket();
  const loadNotification = async () => {
    try {
      const response = await notifications({
        page: 1,
        size: 10
      });
      if (response && response.code === API_CODE.OK) {
        setNotificationData(response.data.items);
        setNotificationTotal(response.data.total);
      }
    } catch (error) {
      setNotificationData([]);
    }
  }
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
  useEffect(() => {
    if (userLogged) {
      setUserData(userLogged);
    }
  }, [userLogged]);
  useEffect(() => {
    if (userUpdated) {
      setUserData(userUpdated);
    }
  }, [userUpdated]);
  useEffect(() => {
    loadNotification();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('join_room', userLogged?.id.toString());
      socket.on('notify_to_user', (event: NotificationType) => {
        setNotificationData(prev => {
          const updated = [event, ...prev];
          if (updated.length > 10) updated.pop();
          return updated;
        });
        setNotificationTotal(prev => prev + 1);
        console.log(event)
      });
    }
  
    return () => {
      if (socket) {
        socket.off('join_room');
        socket.off('notify_to_user');
      }
    };
  }, [socket]);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-header" style={{ borderBottom: "1px solid #dee2e6", padding: 'unset', height: 50 }}>
      <div className="container-fluid">
        {
          showBarBtn &&
          <Button color="default" className="navbar-brand text-dark m-unset btn-open-sidebar" onClick={() => {
            document.body.classList.toggle("sb-sidenav-toggled");
          }}>
            <FontAwesomeIcon icon={faGripVertical} size="lg" />
          </Button>
        }
        <Logo width={40} height={40} />
        <a className="navbar-brand ps-2 text-dark text-logo-header m-unset">
          Next Tech
        </a>

        <button className="btn btn-toggle-menu d-block d-lg-none me-auto" onClick={() => setShowMenu(!showMenu)}>
          <FontAwesomeIcon icon={!showMenu ? faChevronDown : faChevronUp} />
        </button>

        <div className="d-lg-none d-flex align-items-center ms-auto mobile-icons">
          <LanguageDropdown />

          {/* <button className="btn me-2" onClick={() => setShowSearch(!showSearch)}>
            <FontAwesomeIcon icon={faSearch} />
          </button> */}
          <NotifyBell 
            setNotificationData={setNotificationData}
            setNotificationTotal={setNotificationTotal}
            notificationData={notificationData}
            notificationTotal={notificationTotal}
          />
          <div className="position-relative pointer">
            <Link href={'/profile'}>
              <UserAvatar name={userData?.first_name ?? 'U'} avatar={userData?.avatar} />
            </Link>
          </div>
        </div>

        <div className={`collapse navbar-collapse ${showMenu ? "show" : ""}`} id="navbarNav">
          <ul className="navbar-nav menu-header">
            <li className={`nav-item ${pathPage === 'workspace' ? 'nav-item-active' : ''}`} onClick={() => setShowMenu (false)}>
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
            {/* <li className="nav-item d-none d-lg-block" style={{ lineHeight: '3.5' }}>
              <LanguageDropdown />
            </li> */}
          </ul>

          <form className="d-none d-lg-flex ms-auto me-3">
            <LanguageDropdown />

            <NotifyBell 
              setNotificationData={setNotificationData}
              setNotificationTotal={setNotificationTotal}
              notificationData={notificationData}
              notificationTotal={notificationTotal}
            />

            <Link href={'/profile'}>
              <UserAvatar name={userData?.first_name ?? 'U'} className="m-l-10 pointer" avatar={userData?.avatar} />
            </Link>
          </form>


          {/* <ul className="navbar-nav d-none d-lg-flex">
            <li className="nav-item">
              <UserAvatar name={userData?.first_name ?? 'U'} avatar={userData?.avatar} />
            </li>
          </ul> */}
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
