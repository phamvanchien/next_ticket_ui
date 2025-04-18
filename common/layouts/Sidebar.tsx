import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';

const { Option } = Select;

interface SidebarProps {
  open: boolean
  headerElement?: JSX.Element;
  headerTitle?: string
  children: React.ReactNode;
  width?: number | string
  setOpen: (open: boolean) => void
}

const Sidebar: React.FC<SidebarProps> = ({ open, headerElement, headerTitle, children, width, setOpen }) => {
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Drawer
        title={headerTitle}
        width={width ?? 750}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={headerElement}
      >
        {children}
      </Drawer>
    </>
  );
}
export default Sidebar;