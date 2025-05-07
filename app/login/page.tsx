import AuthLayout from "@/common/layouts/AuthLayout";
import LoginView from "@/views/login/LoginView";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Next Tech | Login",
  description: "Boost your team's performance with Next Tech – a free AI-powered project and task management platform built for modern workspaces. - Login",
  icons: {
    icon: '/logo.png'
  },
};

const LoginPage = () => {
  return <Suspense>
    <LoginView />
  </Suspense>
};
LoginPage.getLayout = (page: React.ReactNode) => <AuthLayout>{page}</AuthLayout>;
export default LoginPage;
