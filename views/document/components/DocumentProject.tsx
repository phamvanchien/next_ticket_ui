import { ResponseWithPaginationType } from "@/types/base.type";
import { DocumentType } from "@/types/document.type";
import React from "react";
import DocumentItem from "./DocumentItem";
import NoData from "@/common/components/NoData";
import { defaultPageSizeDocument } from "../DocumentView";
import Loading from "@/common/components/Loading";
import { useTranslations } from "next-intl";

interface DocumentProjectProps {
  documentData?: ResponseWithPaginationType<DocumentType[]>
  loadingViewMore: boolean
  pageSize: number
  setPageSize: (pageSize: number) => void
}

const DocumentProject: React.FC<DocumentProjectProps> = ({ documentData, loadingViewMore, pageSize, setPageSize }) => {
  const t = useTranslations();
  if (!documentData || documentData.total === 0) {
    return <NoData message={t('documents.no_data')}>

    </NoData>
  }
  return (
    <div className="row mt-2">
      {documentData && documentData.items.map((document, index) => (
        <DocumentItem key={index} document={document} />
      ))}
      {
        (documentData.total > defaultPageSizeDocument && pageSize < documentData.total) &&
        <div className="col-12 mt-2">
          <a className="text-secondary pointer" onClick={!loadingViewMore ? () => setPageSize(pageSize + defaultPageSizeDocument) : undefined}>
            {t('btn_view_more')} {loadingViewMore && <Loading color="secondary" />}
          </a>
        </div>
      }
    </div>
  )
}
export default DocumentProject;