import WorkspaceView from "@/views/workspace/WorkspaceView"
import { Metadata } from "next";
import '../css/pages/workspace.css';
import NotificationView from "@/views/notification/NotificationView";

export const metadata: Metadata = {
  title: "Next Tech | Notification",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Notification",
  icons: {
    icon: '/logo.png'
  },
};

const NotificationPage = () => {
  return <NotificationView />
}
export default NotificationPage;