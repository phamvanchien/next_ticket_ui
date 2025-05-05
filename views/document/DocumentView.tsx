"use client"
import { documents } from "@/api/document.api";
import Button from "@/common/components/Button";
import { API_CODE } from "@/enums/api.enum";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { DocumentType } from "@/types/document.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { faBullseye, faFileText, faPlus, faSearch, faShare, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import DocumentItem from "./components/DocumentItem";
import { useRouter } from "next/navigation";
import DocumentOwner from "./components/DocumentOwner";
import DocumentMember from "./components/DocumentMember";
import DocumentProject from "./components/DocumentProject";
import useDelaySearch from "@/hooks/useDelaySearch";

interface DocumentViewProps {
  workspaceId: number
}
export const defaultPageSizeDocument = 6;
const DocumentView: React.FC<DocumentViewProps> = ({ workspaceId }) => {
  const [documentDataOwner, setDocumentDataOwner] = useState<ResponseWithPaginationType<DocumentType[]>>();
  const [documentDataMember, setDocumentDataMember] = useState<ResponseWithPaginationType<DocumentType[]>>();
  const [documentDataProject, setDocumentDataProject] = useState<ResponseWithPaginationType<DocumentType[]>>();
  const [loadingViewMoreOwner, setLoadingViewMoreOwner] = useState(false);
  const [pageSizeOwner, setPageSizeOwner] = useState(defaultPageSizeDocument);
  const [loadingViewMoreMember, setLoadingViewMoreMember] = useState(false);
  const [pageSizeMember, setPageSizeMember] = useState(defaultPageSizeDocument);
  const [loadingViewMoreProject, setLoadingViewMoreProject] = useState(false);
  const [pageSizeProject, setPageSizeProject] = useState(defaultPageSizeDocument);
  const [shareType, setShareType] = useState(1);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setSidebarSelected('document'));
  }, []);
  const loadDocumentsOwner = async () => {
    try {
      const response = await documents (workspaceId, {
        page: 1,
        size: pageSizeOwner,
        keyword: debouncedValue,
        share_type: 1
      });
      setLoadingViewMoreOwner(false);
      if (response && response.code === API_CODE.OK) {
        setDocumentDataOwner(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoadingViewMoreOwner(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadDocumentsMember = async () => {
    try {
      const response = await documents (workspaceId, {
        page: 1,
        size: 5,
        keyword: debouncedValue,
        share_type: 2
      });
      setLoadingViewMoreMember(false);
      if (response && response.code === API_CODE.OK) {
        setDocumentDataMember(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoadingViewMoreMember(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  const loadDocumentsProjects = async () => {
    try {
      const response = await documents (workspaceId, {
        page: 1,
        size: 5,
        keyword: debouncedValue,
        share_type: 3
      });
      if (response && response.code === API_CODE.OK) {
        setDocumentDataProject(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    if (pageSizeOwner > defaultPageSizeDocument) {
      setLoadingViewMoreOwner(true);
    }
    loadDocumentsOwner();
  }, [pageSizeOwner, debouncedValue]);
  useEffect(() => {
    if (pageSizeMember > defaultPageSizeDocument) {
      setLoadingViewMoreMember(true);
    }
    loadDocumentsMember();
  }, [pageSizeMember, debouncedValue]);
  useEffect(() => {
    if (pageSizeProject > defaultPageSizeDocument) {
      setLoadingViewMoreProject(true);
    }
    loadDocumentsProjects();
  }, [pageSizeProject, debouncedValue]);
  return (
  <div className="container-fluid px-3 py-3">
    <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
      <h3 className="mb-0">
        <FontAwesomeIcon icon={faFileText} className="text-primary me-2" />
        {t('sidebar.document')}
      </h3>
      <div className="d-flex gap-3">
        <div className="position-relative">
          <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
          <input
            type="text"
            className="form-control ps-5 rounded search-input"
            placeholder={t('documents.placeholder_search_document') + '...'}
            value={keyword}
            onChange={handleChange}
          />
        </div>
        
        <Button color="primary" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => router.push(`/workspace/${workspaceId}/document/new`)}>
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> {t('common.btn_new')}
        </Button>
      </div>
    </div>
    <div className="row">
      <div className="col-12 col-lg-12 mt-2">
        <ul className="board-menu">
          <li className={`board-menu-item ${shareType === 1 ? 'active' : ''}`} onClick={() => setShareType (1)}>
            <FontAwesomeIcon icon={faUser} style={{ marginRight: 5 }} /> {t('documents.is_owner')}
          </li>
          <li className={`board-menu-item ${shareType === 2 ? 'active' : ''}`} onClick={() => setShareType (2)}>
            <FontAwesomeIcon icon={faShare} style={{ marginRight: 5 }} /> {t('documents.with_member')}
          </li>
          <li className={`board-menu-item ${shareType === 3 ? 'active' : ''}`} onClick={() => setShareType (3)}>
            <FontAwesomeIcon icon={faBullseye} style={{ marginRight: 5 }} /> {t('documents.in_project')}
          </li>
        </ul>
      </div>
    </div>
    {shareType === 1 && <DocumentOwner documentData={documentDataOwner} pageSize={pageSizeOwner} loadingViewMore={loadingViewMoreOwner} setPageSize={setPageSizeOwner} />}
    {shareType === 2 && <DocumentMember documentData={documentDataMember} pageSize={pageSizeMember} loadingViewMore={loadingViewMoreMember} setPageSize={setPageSizeMember} />}
    {shareType === 3 && <DocumentProject documentData={documentDataProject} pageSize={pageSizeProject} loadingViewMore={loadingViewMoreProject} setPageSize={setPageSizeProject} />}
  </div>
  );
}
export default DocumentView;