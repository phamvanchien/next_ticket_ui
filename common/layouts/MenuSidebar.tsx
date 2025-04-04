"use client"
import { useAppDispatch } from "@/reduxs/store.redux";
import { setWorkspaceSelected } from "@/reduxs/workspace.redux";
import { WorkspaceType } from "@/types/workspace.type";
import { faGear } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

interface MenuSidebarProps {
  workspace: WorkspaceType;
}

const MenuSidebar: React.FC<MenuSidebarProps> = ({ workspace }) => {
  const t = useTranslations();
  const dispatch = useAppDispatch();
  const boxRef = useRef<HTMLDivElement>(null);
  const closeSidebar = () => {
    const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>;
    body[0].classList.remove('sb-sidenav-toggled');
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth <= 768 && boxRef.current && !boxRef.current.contains(event.target as Node)) {
      closeSidebar();
    }
  };

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
    if (workspace) {
      dispatch(setWorkspaceSelected(workspace));
    }
  }, [workspace]);

  return (
    <div id="layoutSidenav_nav" ref={boxRef}>
      <nav
        className="sb-sidenav accordion sb-sidenav-dark"
        id="sidenavAccordion"
      >
        <div className="sb-sidenav-menu">
          <div className="nav">
            <div className="sb-sidenav-menu-heading">{t('sidebar.project')}</div>
            <Link className="nav-link" href={`/workspace/${workspace.id}/project`}>
              <div className="sb-nav-link-icon">
                <i className="fas fa-tachometer-alt" />
              </div>
              {t('sidebar.project')}
            </Link>
          </div>
        </div>
        <div className="sb-sidenav-footer">
          <FontAwesomeIcon className="mt-2" icon={faGear} /> {t('workspace_setting.page_title')}
        </div>
      </nav>
    </div>
  );
};

export default MenuSidebar;