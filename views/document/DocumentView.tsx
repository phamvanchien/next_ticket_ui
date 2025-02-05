"use client"
import { faAngleDoubleDown, faFileText, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DocumentCreate from "./components/DocumentCreate";
import Button from "@/common/components/Button";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { documents } from "@/api/document.api";
import { API_CODE } from "@/enums/api.enum";
import { DocumentType } from "@/types/document.type";
import Loading from "@/common/components/Loading";
import DocumentItem from "./components/DocumentItem";
import Link from "next/link";
import DocumentUpdate from "./components/DocumentUpdate";
import Input from "@/common/components/Input";
import { ResponseWithPaginationType } from "@/types/base.type";
import { useTranslations } from "next-intl";

interface DocumentViewProps {
  workspaceId: number
}

const DocumentView: React.FC<DocumentViewProps> = ({ workspaceId }) => {
  const t = useTranslations();
  const defaultPageSize = 12;
  const [openCreate, setOpenCreate] = useState(false);
  const [documentData, setDocumentData] = useState<ResponseWithPaginationType<DocumentType[]>>();
  const [loading, setLoading] = useState(true);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [documentUpdate, setDocumentUpdate] = useState<DocumentType>();
  const [documentUpdated, setDocumentUpdated] = useState<DocumentType>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setLoading(true);
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const loadDocuments = async () => {
    const response = await documents(workspaceId, 1, pageSize, keyword);
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
  }, [pageSize, debounceKeyword]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  return <>
    <div className="row mb-4">
      <div className="col-12">
        <h3><FontAwesomeIcon icon={faFileText} className="text-primary" /> {t('documents.page_title')}</h3>
      </div>
      <div className="col-6 mt-2">
        <Button color="primary" onClick={() => setOpenCreate (true)}>
          {t('btn_new')} <FontAwesomeIcon icon={faPlus} />
        </Button>
      </div>
      <div className="col-6 mt-2">
        <Input type="search" className="input-search float-right" placeholder={t('documents.placeholder_search_document')} onChange={handleChangeKeyword} />
      </div>
    </div>
    <DocumentCreate 
      openCreate={openCreate} 
      setOpenCreate={setOpenCreate} 
      loadDocuments={loadDocuments}
    />
    <DocumentUpdate
      documentUpdate={documentUpdate}
      setDocumentUpdate={setDocumentUpdate}
      setDocumentUpdated={setDocumentUpdated}
    />
    <div className="container">
      <div className="row mt-4">
        {
          loading &&
          <div className="col-12">
            <center>
              <Loading color="primary" size={50} />
            </center>
          </div>
        }
      </div>
      <div className="row">
        {
          (!loading && documentData) && documentData.items.map(document => (
            <DocumentItem 
              document={document} 
              key={document.id} 
              setDocumentUpdate={setDocumentUpdate}
              documentUpdated={documentUpdated}
            />
          ))
        }
      </div>
      <div className="row">
        {
          (!loading && documentData && documentData.total > pageSize) &&
          <div className="col-12 mt-2 text-left">
            <Link href="#" className="text-secondary" onClick={!loadingViewMore ? handleViewMore : undefined}>
              {t('btn_view_more')} {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
            </Link>
          </div>
        }
      </div>
    </div>
  </>
}
export default DocumentView;