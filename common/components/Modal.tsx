import React, { useState } from 'react';
import { Modal as ModalAnt } from 'antd';
import Button from './Button';
import { useTranslations } from 'next-intl';

interface ModalProps {
  open: boolean
  title?: string
  children: React.ReactNode
  footerBtn: JSX.Element[]
  width?: number
  closable?: boolean
  setOpen: (open: boolean) => void
}

const Modal: React.FC<ModalProps> = ({ open, title, children, footerBtn, width, closable, setOpen }) => {
  const t = useTranslations();
  const handleOk = () => {
    alert('Click OK')
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <>
      <ModalAnt
        width={width}
        closable={closable}
        open={open}
        title={title}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={footerBtn}
      >
        {children}
      </ModalAnt>
    </>
  );
};

export default Modal;