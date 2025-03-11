import Link from "next/link";
import React from "react";

interface LogoAuthPageProps {
  className?: string
}

const LogoAuthPage: React.FC<LogoAuthPageProps> = ({ className }) => {
  return (
    <div className={`login-logo ${className ?? ''}`}>
      <Link href="/">
        <img src="/img/logo-3.png" alt="AdminLTE Logo" width={200} height={50} />
      </Link>
    </div>
  )
}
export default LogoAuthPage;