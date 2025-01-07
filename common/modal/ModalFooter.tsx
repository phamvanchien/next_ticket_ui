import React from "react";
import Button from "../components/Button";

interface ModalFooterProps {
  children?: React.ReactNode
  closeButton?: boolean
  closeButtonText?: string
  setShow?: (open: boolean) => void
}

const ModalFooter: React.FC<ModalFooterProps> = ({ children, closeButton, closeButtonText, setShow }) => {
  return (
    <div className="modal-footer justify-content-between">
      {
        closeButton && 
          <Button type="button" color="default" fullWidth data-dismiss="modal" rounded onClick={setShow ? () => setShow(false) : undefined}>
            {closeButtonText ?? 'Đóng'}
          </Button>
      }
      {children}
    </div>
  )
}
export default ModalFooter;