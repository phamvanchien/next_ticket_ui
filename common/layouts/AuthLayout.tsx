"use client"
import { MenuProps } from "antd";
import Image from "next/image";
import LanguageDropdown from "../components/LanguageDropdown";
import Logo from "../components/Logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
          3rd menu item
        </a>
      ),
    },
  ];
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light position-relative">
      <div className="position-absolute language-auth-box">
        <LanguageDropdown />
      </div>
      <div className="position-absolute start-50 translate-middle-x logo-auth-box">
        <Logo withText width={100} height={90} />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;  