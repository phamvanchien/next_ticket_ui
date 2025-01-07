import Link from "next/link";
import React from "react";

interface NavItemProps {
  children: React.ReactNode
  href: string
  className?: string
}

const NavItem: React.FC<NavItemProps> = ({ children, href, className }) => {
  return (
    <li className="nav-item">
      <Link href={href} className={`nav-link ${className ?? ''}`}>
        {children}
      </Link>
    </li>
  )
}
export default NavItem;