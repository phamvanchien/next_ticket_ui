import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const RegisterSuccess = () => {
  const t = useTranslations();
  return <>
    <center>
      <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-2" style={{ fontSize: 50 }} />
      <p className="text-dark">{t('register_success.created_account')}</p>
      <p className="text-primary">{t('register_success.alert_verify_first')} <br />{t('register_success.alert_verify_second')}</p>
    </center>
  </>
}
export default RegisterSuccess;