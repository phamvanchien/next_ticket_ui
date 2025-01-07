import Link from "next/link";
import React from "react";

interface DropdownItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  link?: string;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ children, link, ...rest }) => {
  return (
    <li className="dropdown-item" {...rest}>
      {link ? <Link href={link}>{children}</Link> : children}
    </li>
  );
};

export default DropdownItem;