import { APP_CONFIG } from "@/configs/app.config";
import { API_CODE, API_METHOD_ENUM } from "@/enums/api.enum";
import { APP_AUTH } from "@/enums/app.enum";
import { catchError, responseError } from "@/services/error.service";
import { BaseResponseType } from "@/types/base.type";
import { WorkspaceType } from "@/types/workspace.type";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { use } from "react";

export const metadata: Metadata = {
  title: "Next Tech | Workspace",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Workspace",
  icons: {
    icon: '/logo.png'
  },
};

interface WorkspacePageProps {
  params: {
    id: number;
  };
  // workspace: WorkspaceType;
}

const WorkspaceDetail: React.FC<WorkspacePageProps> = ({ params }) => {
  return (
    <div>
      <h2>Workspace ID: {params.id}</h2>
      {/* Display additional workspace data here */}
      {/* <p>{workspace.name}</p> */}
    </div>
  );
}

export default WorkspaceDetail;