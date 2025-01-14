import Link from "next/link";
import React from "react";

interface DropdownItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  link?: string;
  className?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ children, className, link, ...rest }) => {
  return (
    <li className={`dropdown-item ${className ?? ''}`} {...rest}>
      {link ? <Link href={link}>{children}</Link> : children}
    </li>
  );
};

export default DropdownItem;