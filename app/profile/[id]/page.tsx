import ProfileUserView from "@/views/profile-user/ProfileUserView";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Next Tech | Profile",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Profile",
  icons: {
    icon: '/logo.png'
  },
};

interface ProfileUserPageProps {
  params: {
    id: number;
  };
}

const ProfileUserPage: React.FC<ProfileUserPageProps> = ({ params }) => {
  return <ProfileUserView userId={params.id} />
}
export default ProfileUserPage;