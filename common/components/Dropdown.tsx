import React, { Dispatch, SetStateAction } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown as DropdownAnt } from 'antd';

interface DropdownProps {
  children: React.ReactNode
  items: MenuProps['items']
  className?: string;
  classButton?: string;
  isDropdownOpen?: boolean
  classDropdownRender?: string
  setIsDropdownOpen?: Dispatch<SetStateAction<boolean>>
}

const Dropdown: React.FC<DropdownProps> = ({ children, items, className, classButton, classDropdownRender, isDropdownOpen, setIsDropdownOpen }) => {
  return (
    <DropdownAnt 
      menu={{ items }} 
      placement="bottomLeft" 
      className={className} 
      trigger={['click']} 
      open={isDropdownOpen} 
      onOpenChange={setIsDropdownOpen ? (open) => setIsDropdownOpen(open) : undefined}
      dropdownRender={classDropdownRender ? (menu) => (
        <div className={classDropdownRender}>
          {menu}
        </div>
      ) : undefined}
    >
      <div>
        {children}
      </div>
    </DropdownAnt>
  );
}

export default Dropdown;
