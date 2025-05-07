import DocumentView from "@/views/document/DocumentView";
import { Metadata } from "next";
import React from "react";
import '../../../../app/css/pages/document.css';

export const metadata: Metadata = {
  title: "Next Tech | Documents",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Documents",
  icons: {
    icon: '/logo.png'
  },
};

interface DocumentPageProps {
  params: { id: number };
}

const DocumentPage: React.FC<DocumentPageProps> = ({ params }) => {
  return <DocumentView workspaceId={params.id} />
}
export default DocumentPage;