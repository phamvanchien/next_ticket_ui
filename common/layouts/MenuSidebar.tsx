"use client"
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setWorkspaceSelected } from "@/reduxs/workspace.redux";
import { WorkspaceType } from "@/types/workspace.type";
import { faBullseye, faClock, faCubes, faFileText, faGear, faHistory } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import UserAvatar from "../components/AvatarName";
import { useSelector } from "react-redux";
import ImageIcon from "../components/ImageIcon";

interface MenuSidebarProps {
  workspace: WorkspaceType;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({ workspace }) => {
  const dispatch = useAppDispatch();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const sidebarSelected = useSelector((state: RootState) => state.menuSlide).sidebarSelected;
  const workspaceUpdated = useSelector((state: RootState) => state.workspaceSlide).workspaceUpdated;
  const [workspaceData, setWorkspaceData] = useState(workspace);
  const t = useTranslations();
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  const closeSidebar = () => {
    const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>;
    body[0].classList.remove('sb-sidenav-toggled');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth <= 768 && boxRef.current && !boxRef.current.contains(event.target as Node)) {
      closeSidebar();
    }
  };

  const handleClickItem = (event: any) => {
    event.preventDefault();
    router.push(event.target.href);
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
  }

  useEffect(() => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    dispatch(setWorkspaceSelected(workspace));
  }, [workspace]);

  useEffect(() => {
    if (workspaceUpdated) {
      setWorkspaceData(workspaceUpdated);
    }
  }, [workspaceUpdated]);

  return (
    <div id="layoutSidenav_nav" ref={boxRef}>
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav" style={{ marginBottom: 10 }}>
            <div className="d-flex align-items-center sidebar-wp">
              {
                workspaceData.logo ?
                <img src={workspaceData.logo} width={30} height={30} />: 
                <UserAvatar name={workspaceData.name} />
              }
              <div style={{ marginLeft: 7 }}>
                <h5 className="mb-1">
                  <Link href={`/workspace/${workspaceData.id}/project`}>{workspaceData.name}</Link>
                </h5>
              </div>
            </div>
          </div>
          <div className={`nav mt-2`}>
            <Link className="nav-link" href={`/workspace/`} onClick={handleClickItem}>
              <ImageIcon name="laptop" width={35} height={40} /> {t('sidebar.workspace')}
            </Link>
          </div>
          <div className={`nav mt-2 ${sidebarSelected === 'project' ? 'menu-item-active' : ''}`}>
            <Link className="nav-link" href={`/workspace/${workspaceData.id}/project`} onClick={handleClickItem}>
              <ImageIcon name="project" width={35} height={35} /> {t('sidebar.project')}
            </Link>
          </div>
          <div className={`nav mt-2 ${sidebarSelected === 'document' ? 'menu-item-active' : ''}`}>
            <Link className="nav-link" href={`/workspace/${workspaceData.id}/document`} onClick={handleClickItem}>
              <ImageIcon name="document" width={35} height={35} /> {t('sidebar.document')}
            </Link>
          </div>
          <div className={`nav mt-2 ${sidebarSelected === 'recent' ? 'menu-item-active' : ''}`}>
            <Link className="nav-link" href={`/workspace/${workspaceData.id}/recent`} onClick={handleClickItem}>
              <ImageIcon name="recently" width={35} height={35} /> {t('sidebar.recent')}
            </Link>
          </div>
          <div className={`nav mt-2 ${sidebarSelected === 'time-tracking' ? 'menu-item-active' : ''}`}>
            <Link className="nav-link" href={`/workspace/${workspaceData.id}/time-tracking`} onClick={handleClickItem}>
              <ImageIcon name="time-tracking" width={35} height={35} /> {t('time_tracking.page_title')}
            </Link>
          </div>
          {
            userLogged?.id === workspaceData.user_id &&
            <div className={`nav mt-2 ${sidebarSelected === 'time-tracking-manage' ? 'menu-item-active' : ''}`}>
              <Link className="nav-link" href={`/workspace/${workspaceData.id}/time-tracking/manage`} onClick={handleClickItem}>
                <ImageIcon name="time-tracking-2" width={35} height={35} />{t('time_tracking.page_title_manage')}
              </Link>
            </div>
          }
          {
            workspaceData.user_id === userLogged?.id &&
            <div className={`nav mt-2 ${sidebarSelected === 'workspace_setting' ? 'menu-item-active' : ''}`}>
              <Link className="nav-link" href={`/workspace/${workspaceData.id}/setting`} onClick={handleClickItem}>
                <ImageIcon name="setting" width={35} height={35} />{t('workspaces_page.setting.setting_title')}
              </Link>
            </div>
          }
        </div>
      </nav>
    </div>
  );
};

export default MenuSidebar;