"use client"
import LanguageDropdown from "../components/LanguageDropdown";
import Logo from "../components/Logo";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container">
      {children}
    </div>
  );
};

export default HomeLayout;  