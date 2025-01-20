import ImageIcon from "@/common/components/ImageIcon";
import { DocumentType } from "@/types/document.type";
import React, { useEffect, useState } from "react";

interface DocumentItemProps {
  document: DocumentType
  documentUpdated?: DocumentType
  setDocumentUpdate: (documentUpdate?: DocumentType) => void
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, documentUpdated, setDocumentUpdate }) => {
  const [documentData, setDocumentData] = useState<DocumentType>(document)
  useEffect(() => {
    if (documentUpdated && documentData.id === documentUpdated.id) {
      setDocumentData(documentUpdated);
    }
  }, [documentUpdated]);
  return (
    <div className="col-6 col-lg-3">
      <div className="card pointer" onClick={() => setDocumentUpdate (documentData)}>
        <div className="card-body p-10">
          <center>
            <ImageIcon icon="document-o" />
          </center>
        </div>
        <div className="card-header p-5">
          <h6 className="text-secondary text-center" title={documentData.title}>
            {(documentData.title && documentData.title !== '') ? (documentData.title.length > 20 ? documentData.title.substring(0, 13) + '...' : documentData.title) : 'No name'}
          </h6>
        </div>
      </div>
    </div>
  )
}
export default DocumentItem;