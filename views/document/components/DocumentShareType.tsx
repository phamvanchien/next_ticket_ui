import Button from "@/common/components/Button";
import React from "react";

interface DocumentShareTypeProps {
  shareType?: number
  setShareType: (shareType: number) => void
}

const DocumentShareType: React.FC<DocumentShareTypeProps> = ({ shareType, setShareType }) => {
  return <>
    <div className="col-6 mt-2 mb-2">
      <Button color="secondary" outline={shareType === 2} fullWidth className="float-left btn-share-type" onClick={() => setShareType (1)}>
        Share in project
      </Button>
    </div>
    <div className="col-6 mt-2 mb-2">
      <Button color="secondary" outline={shareType === 1} fullWidth className="float-left btn-share-type" onClick={() => setShareType (2)}>
        Share with member <br/> or just you
      </Button>
    </div>
  </>
}
export default DocumentShareType;