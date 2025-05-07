import WorkspaceView from "@/views/workspace/WorkspaceView"
import { Metadata } from "next";
import '../css/pages/workspace.css';

export const metadata: Metadata = {
  title: "Next Tech | Workspaces",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Workspaces",
  icons: {
    icon: '/logo.png'
  },
};

const WorkspacePage = () => {
  return <WorkspaceView />
}
export default WorkspacePage;