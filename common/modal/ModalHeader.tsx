import React from "react";

interface ModalHeaderProps {
  title?: string
  setShow: (open: boolean) => void
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ title, setShow }) => {
  return (
    <div className="modal-header">
      <h6 className="modal-title">{title}</h6>
      {/* <Button color="default"
        type="button"
        className="close"
        data-dismiss="modal"
        aria-label="Close"
        onClick={() => setShow (false)}
      > */}
      <span aria-hidden="true" className="btn-close-modal" onClick={() => setShow (false)}>×</span>
      {/* </Button> */}
    </div>
  )
}
export default ModalHeader;