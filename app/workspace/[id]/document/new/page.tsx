import DocumentCreateView from "@/views/document/DocumentCreateView";
import { Metadata } from "next";
import '../../../../css/pages/document.css';
import React from "react";

export const metadata: Metadata = {
  title: "Next Tech | Documents",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Documents",
  icons: {
    icon: '/logo.png'
  },
};

interface CreateDocumentPageProps {
  params: { id: number };
}

const CreateDocumentPage: React.FC<CreateDocumentPageProps> = ({ params }) => {
  return <DocumentCreateView workspaceId={params.id} />
}
export default CreateDocumentPage;