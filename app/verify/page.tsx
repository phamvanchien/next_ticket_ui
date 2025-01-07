import VerifyView from "@/views/verify/VerifyView";
import '../css/pages/auth.css';
import { Suspense } from "react";

const VerifyPage = () => {
  return <Suspense>
    <VerifyView />
  </Suspense>
}
export default VerifyPage;