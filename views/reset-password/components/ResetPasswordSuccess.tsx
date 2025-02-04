import { APP_LINK } from "@/enums/app.enum";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ResetPasswordSuccess = () => {
  const router = useRouter();
  const t = useTranslations();
  useEffect(() => {
    setTimeout(() => {
      router.push(APP_LINK.LOGIN);
    }, 2000);
  }, []);
  return <>
    <center>
      <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-2" style={{ fontSize: 50 }} />
      <p className="text-dark">{t('reset_password_success.success_message')}</p>
      <p className="text-primary">{t('reset_password_success.redirect_message')} ...</p>
    </center>
  </>
}
export default ResetPasswordSuccess;