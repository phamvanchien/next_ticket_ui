"use client"
import Header from "@/common/layouts/Header";
import Sidebar from "@/common/layouts/Sidebar";
import { WorkspaceType } from "@/types/workspace.type";
import React from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface MainLayoutProps {
  children: React.ReactNode
  workspace?: WorkspaceType
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, workspace }) => {
  return (
    <div className="wrapper">
      <ToastContainer />
      <Header />
      <Sidebar workspace={workspace} />
      <div className="content-wrapper mt-3">
        <div className="content">
          <div className="container main-container" style={{maxWidth: '100%'}}>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
export default MainLayout;