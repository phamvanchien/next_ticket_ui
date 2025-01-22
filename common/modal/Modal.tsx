import React, { useEffect, useRef } from "react";

interface ModalProps {
  children: React.ReactNode
  isOpen?: boolean
  className?: string
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, className }) => {
  const modalDivRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const body = document.getElementsByTagName('body') as HTMLCollectionOf<HTMLBodyElement>;
    if (isOpen) {
      body[0].classList.add('modal-open');
    } else {
      body[0].classList.remove('modal-open');
    }
  }, [isOpen]);

  return <>
    <div className={`modal fade ${isOpen ? 'show modal-display' : ''}`} id="modal" ref={modalDivRef}>
      <div className="modal-dialog">
        <div className={`modal-content ${className ? className : ''}`}>
          {children}
        </div>
      </div>
    </div>
    <div className={isOpen ? 'modal-backdrop fade show' : ''} id="modalBackdrop"></div>
  </>
}
export default Modal;