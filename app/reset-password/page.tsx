import ResetPasswordView from "@/views/reset-password/ResetPasswordView";
import { Suspense } from "react";
import '../css/pages/auth.css';

const ResetPasswordPage = () => {
  return <Suspense>
    <ResetPasswordView />
  </Suspense>
}
export default ResetPasswordPage;