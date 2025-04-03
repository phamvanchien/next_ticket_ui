"use client"
import { Provider } from "react-redux";
import Header from "./Header";
import store from "@/reduxs/store.redux";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <div className="main-layout" style={{ background: '#fff' }}>
        <Header />
        {children}
        {/* <Footer /> */}
      </div>
    </Provider>
  );
};
  
export default MainLayout;