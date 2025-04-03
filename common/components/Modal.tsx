import React, { useState } from 'react';
import { Modal as ModalAnt } from 'antd';
import Button from './Button';
import { useTranslations } from 'next-intl';

interface ModalProps {
  open: boolean
  title?: string
  children: React.ReactNode
  footerBtn: JSX.Element[]
  setOpen: (open: boolean) => void
}

const Modal: React.FC<ModalProps> = ({ open, title, children, footerBtn, setOpen }) => {
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