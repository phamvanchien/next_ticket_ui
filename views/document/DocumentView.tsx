"use client"
import { faAngleDoubleDown, faPager, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DocumentCreate from "./components/DocumentCreate";
import Button from "@/common/components/Button";
import React, { MouseEvent, useEffect, useState } from "react";
import { documents } from "@/api/document.api";
import { API_CODE } from "@/enums/api.enum";
import { DocumentsDataType } from "@/types/document.type";
import Loading from "@/common/components/Loading";
import DocumentItem from "./components/DocumentItem";
import Link from "next/link";

interface DocumentViewProps {
  workspaceId: number
}

const DocumentView: React.FC<DocumentViewProps> = ({ workspaceId }) => {
  const defaultPageSize = 6;
  const [openCreate, setOpenCreate] = useState(false);
  const [documentData, setDocumentData] = useState<DocumentsDataType>();
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const loadDocuments = async () => {
    const response = await documents(workspaceId, 1, pageSize);
    setLoading(false);
    setLoadingViewMore(false);
    if (response && response.code === API_CODE.OK) {
      setDocumentData(response.data);
    }
  }
  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }
  useEffect(() => {
    loadDocuments();
  }, [pageSize]);
  return <>
    <div className="row mb-4">
      <div className="col-12">
        <h3><FontAwesomeIcon icon={faPager} className="text-primary" /> Documents</h3>
      </div>
      <div className="col-12 mt-2">
        <Button color="primary" onClick={() => setOpenCreate (true)}>
          New <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
    </div>
    <DocumentCreate 
      openCreate={openCreate} 
      setOpenCreate={setOpenCreate} 
      loadDocuments={loadDocuments}
    />
    <div className="row mt-4">
      {
        loading &&
        <div className="col-12">
          <center>
            <Loading color="primary" size={50} />
          </center>
        </div>
      }
      {
        (!loading && documentData) && documentData.items.map(document => (
          <DocumentItem document={document} key={document.id} />
        ))
      }
      {
        (!loading && documentData && documentData.total > pageSize) &&
        <div className="col-12 mt-2 text-left">
          <Link href="#" className="text-secondary" onClick={!loadingViewMore ? handleViewMore : undefined}>
            View more {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
          </Link>
        </div>
      }
    </div>
  </>
}
export default DocumentView;