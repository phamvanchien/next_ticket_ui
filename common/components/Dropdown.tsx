import React, { Dispatch, SetStateAction } from 'react';
import type { MenuProps } from 'antd';
import { Dropdown as DropdownAnt } from 'antd';
import Button from "@/common/components/Button";

interface DropdownProps {
  children: React.ReactNode
  items: MenuProps['items']
  className?: string;
  classButton?: string;
  isDropdownOpen?: boolean
  setIsDropdownOpen?: Dispatch<SetStateAction<boolean>>
}

const Dropdown: React.FC<DropdownProps> = ({ children, items, className, classButton, isDropdownOpen, setIsDropdownOpen }) => {
  return (
    <DropdownAnt menu={{ items }} placement="bottomLeft" className={className} trigger={['click']} open={isDropdownOpen} onOpenChange={setIsDropdownOpen ? (open) => setIsDropdownOpen(open) : undefined}>
      <Button color='default' className={classButton}>
        {children}
      </Button>
    </DropdownAnt>
  );
}

export default Dropdown;
