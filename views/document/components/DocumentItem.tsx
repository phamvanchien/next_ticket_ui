import ImageIcon from "@/common/components/ImageIcon";
import { DocumentType } from "@/types/document.type";
import Link from "next/link";
import React from "react";

interface DocumentItemProps {
  document: DocumentType
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document }) => {
  return (
    <div className="col-6 col-lg-2">
      <div className="card pointer">
        <div className="card-body p-10">
          <center>
            <ImageIcon icon="document-o" />
          </center>
        </div>
        <div className="card-header p-5">
          <h6 className="text-secondary text-center">
            {document.title.length > 40 ? document.title.substring(0, 40) + '...' : document.title}
          </h6>
        </div>
      </div>
    </div>
  )
}
export default DocumentItem;