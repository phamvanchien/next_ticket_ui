import RecentView from "@/views/recent/RecentView";
import { Metadata } from "next";
import React from "react";
import '../../../css/pages/recent.css';

export const metadata: Metadata = {
  title: "Next Tech | Workspace recent",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Workspace recent",
  icons: {
    icon: '/logo.png'
  },
};

interface RecentPageProps {
  params: { 
    id: number
  };
}

const RecentPage: React.FC<RecentPageProps> = ({ params }) => {
  return <RecentView workspaceId={params.id} />
}
export default RecentPage;