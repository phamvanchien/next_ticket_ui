import { APP_LINK } from "@/enums/app.enum";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ResetPasswordSuccess = () => {
  const router = useRouter();
  useEffect(() => {
    setTimeout(() => {
      router.push(APP_LINK.LOGIN);
    }, 2000);
  }, []);
  return <>
    <center>
      <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-2" style={{ fontSize: 50 }} />
      <p className="text-dark">Your password has been reset successfully.</p>
      <p className="text-primary">Redirecting to login page ...</p>
    </center>
  </>
}
export default ResetPasswordSuccess;