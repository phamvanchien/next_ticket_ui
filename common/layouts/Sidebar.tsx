"use client"
import ImageIcon from "@/common/components/ImageIcon";
import { APP_AUTH, APP_LINK } from "@/enums/app.enum";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setUser } from "@/reduxs/user.redux";
import { setWorkspace } from "@/reduxs/workspace.redux";
import { WorkspaceType } from "@/types/workspace.type";
import { getCookie, removeCookie } from "@/utils/cookie.util";
import InviteMemberView from "@/views/invite-member/InviteMemberView";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface SidebarProps {
  workspace?: WorkspaceType
}

const Sidebar: React.FC<SidebarProps> = ({ workspace }) => {
  const router = useRouter();
  const iconSize = 30;
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const menuRedux = useSelector((state: RootState) => state.menuSlice);
  const boxRef = useRef<HTMLDivElement>(null);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;

  const [modalInvite, setModalInvite] = useState<boolean>(false);

  const closeSidebar = () => {
    const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>;
    body[0].classList.add('sidebar-collapse');
    body[0].classList.remove('sidebar-open');
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (window.innerWidth <= 768 && boxRef.current && !boxRef.current.contains(event.target as Node)) {
      closeSidebar();
    }
  };

  const handleClickSidebar = (link: string) => {
    if (window.innerWidth <= 768) {
      closeSidebar();
    }
    dispatch(setSidebarSelected(link));
  }

  const handleLogout = (event: any) => {
    event.preventDefault();
    removeCookie(APP_AUTH.COOKIE_AUTH_KEY);
    removeCookie(APP_AUTH.COOKIE_AUTH_USER);
    router.push(APP_LINK.LOGIN);
  }

  const handleOpenModal = (link: string) => {
    setModalInvite(true);
  }

  useEffect(() => {
    dispatch(setSidebarSelected(pathname));
  }, [pathname]);

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
    const userAuth = getCookie(APP_AUTH.COOKIE_AUTH_USER);
    if (userAuth) {
      const userParse = JSON.parse(userAuth);
      dispatch(setUser(userParse));
    }
    if (workspace) {
      dispatch(setWorkspace(workspace));
    }
  }, []);

  const sidebarData = [
    {
      title: 'Projects',
      icon: <ImageIcon icon="project" width={iconSize} height={iconSize} />,
      link: APP_LINK.WORKSPACE + '/' + workspace?.id + '/project',
      show: true
    },
    {
      title: 'Join another workspace',
      icon: <ImageIcon icon="circle-plus" width={iconSize} height={iconSize} />,
      link: APP_LINK.GO_TO_WORKSPACE,
      show: true
    },
    {
      title: 'Invite members',
      icon: <ImageIcon icon="add-member" width={iconSize} height={iconSize} />,
      link: null,
      show: workspace?.user_id === userLogged?.id
    },
    {
      title: 'Setting',
      icon: <ImageIcon icon="setting-project" width={iconSize} height={iconSize} />,
      link: APP_LINK.WORKSPACE + '/' + workspace?.id + '/setting',
      show: workspace?.user_id === userLogged?.id
    },
    {
      title: 'Logout',
      icon: <ImageIcon icon="logout" width={iconSize} height={iconSize} />,
      link: 'logout',
      show: true
    }
  ];

  return (
    <aside className="main-sidebar sidebar-dark-primary elevation-4" ref={boxRef}>
      <Link href={APP_LINK.WORKSPACE + '/' + workspace?.id} className="brand-link p-unset ml-4 mt-2 text-dark" title={workspace?.name}>
        <img 
          src={userLogged?.avatar} 
          alt="AdminLTE Logo" 
          width={35} 
          height={35} 
          className="img-circle mr-2" 
          onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} 
        /> 
        {workspace && (workspace?.name.length > 12 ? workspace?.name.substring(0, 12) + '...' : workspace?.name)}
      </Link>
      <div className="sidebar">
        <nav className="mt-2">
          <ul className="nav nav-pills nav-sidebar flex-column">
            {
              sidebarData.filter(s => s.show === true).map((sidebar, index) => (
                <li className="nav-item sidebar-item mt-2" key={index}>
                  <Link 
                    href={sidebar.link ?? ''} 
                    className={`nav-link ${menuRedux.sidebar === sidebar.link ? 'active' : ''}`} 
                    onClick={sidebar.link ? sidebar.link === 'logout' ? handleLogout : () => handleClickSidebar(sidebar.link ?? '') : () => handleOpenModal (sidebar.link ?? '')}
                  >
                    {sidebar.icon}
                    <p> {sidebar.title}</p>
                  </Link>
                </li>
              ))
            }
          </ul>
        </nav>
      </div>
      {workspace?.user_id === userLogged?.id && <InviteMemberView openModal={modalInvite} setOpenModal={setModalInvite} />}
    </aside>
  )
}
export default Sidebar;