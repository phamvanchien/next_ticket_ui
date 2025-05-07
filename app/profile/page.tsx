import ProfileView from "@/views/profile/ProfileView";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next Tech | Profile",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Profile",
  icons: {
    icon: '/logo.png'
  },
};

const ProfilePage = () => {
  return <ProfileView />
}
export default ProfilePage;