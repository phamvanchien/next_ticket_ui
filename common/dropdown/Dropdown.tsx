import React, { useEffect, useRef } from "react";
import Button from "../components/Button";

interface DropdownProps {
  title: string
  children: React.ReactNode
  className?: string
}

const Dropdown: React.FC<DropdownProps> = ({ title, children, className }) => {
  const dropdownButtonRef = useRef<HTMLDivElement>(null);
  const handleClickDropdown = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const dropdownMenu = event.currentTarget.parentElement?.querySelector(".dropdown-menu");
    if (dropdownMenu?.classList.contains('show')) {
      dropdownMenu.classList.remove('show');
      return;
    }
    dropdownMenu?.classList.add('show');
  }
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (dropdownButtonRef.current && !dropdownButtonRef.current.contains(event.target as Node)) {
        const dropdownMenu = document.getElementsByClassName('dropdown-menu') as HTMLCollectionOf<HTMLElement>;
        for (let i = 0; i < dropdownMenu.length; i++) {
          const dropdown = dropdownMenu[i];
          dropdown.classList.remove('show');
        }
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return <>
    <div className={`input-group-prepend show ${className ?? ''}`} style={{ width: 100 }} ref={dropdownButtonRef}>
      <Button color="secondary" className="dropdown-toggle" onClick={handleClickDropdown}>
        {title}
      </Button>
      <ul className="dropdown-menu" x-placement="bottom-start">
        {children}
      </ul>
    </div>
  </>
}
export default Dropdown;