import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const SendLinkSuccess = () => {
  const t = useTranslations();
  return <>
    <center>
      <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-2" style={{ fontSize: 50 }} />
      <p className="text-dark">{t('send_link_reset_password.page_title_first')}</p>
      <p className="text-primary">{t('send_link_reset_password.page_title_second')} <br />{t('send_link_reset_password.page_title_third')}</p>
    </center>
  </>
}
export default SendLinkSuccess;