"use client"
import store from "@/reduxs/store.redux";
import React from "react";
import { Provider } from "react-redux";

interface BodyLayoutProps {
  children: React.ReactNode
}

const BodyLayout: React.FC<BodyLayoutProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  )
}
export default BodyLayout;