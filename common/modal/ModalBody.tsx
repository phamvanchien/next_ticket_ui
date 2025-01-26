import React from "react";

interface ModalBodyProps {
  children: React.ReactNode
}

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => {
  return (
    <div className="modal-body p-20">
      {children}
    </div>
  )
}
export default ModalBody;