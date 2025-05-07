import ErrorPage from "@/common/layouts/ErrorPage";
import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import { BaseResponseType } from "@/types/base.type";
import { DocumentType } from "@/types/document.type";
import DocumentDetailView from "@/views/document/DocumentDetailView";
import { Metadata } from "next";
import { cookies } from "next/headers";
import '../../../../css/pages/document.css';

interface DocumentDetailProps {
  params: { 
    id: number
    document_id: number 
  };
}

export const metadata: Metadata = {
  title: "Next Tech | Documents",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Documents",
  icons: {
    icon: '/logo.png'
  },
};

const DocumentDetail: React.FC<DocumentDetailProps> = async ({ params }) => {
  const document = await fetchDocument(params.id, params.document_id);

  if (!document || document.code !== API_CODE.OK) {
    return <ErrorPage code={document.code} />;
  }
  return <DocumentDetailView _document={document.data} />
}

const fetchDocument = async (workspaceId: number, documentId: number): Promise<BaseResponseType<DocumentType>> => {
  try {
    const apiResponse = await fetch(APP_CONFIG.API.URL + APP_CONFIG.API.PREFIX.document.url + '/' + workspaceId.toString() + '/' + documentId.toString(), {
      method: API_METHOD_ENUM.GET,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cookies().get(APP_AUTH.COOKIE_AUTH_KEY)?.value}`
      }
    });
  
    return await apiResponse.json();
  } catch (error) {
    const errorRes = responseError(500);
    errorRes.error = catchError();
    return errorRes;
  }
};

export default DocumentDetail;