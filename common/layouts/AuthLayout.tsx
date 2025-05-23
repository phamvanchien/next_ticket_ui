"use client"
import LanguageDropdown from "../components/LanguageDropdown";
import Logo from "../components/Logo";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light position-relative">
      <div className="position-absolute language-auth-box">
        <LanguageDropdown />
      </div>
      <div className="position-absolute start-50 translate-middle-x logo-auth-box">
        <Logo withText width={110} height={100} />
      </div>
      {children}
    </div>
  );
};

export default AuthLayout;  