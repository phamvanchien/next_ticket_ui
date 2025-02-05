import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";

const DocumentAlertPrivate = () => {
  const t = useTranslations();
  return (
    <div className="col-12 mb-2">
      <span className="text-muted" style={{fontSize: 13}}>
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
        {t('documents.share_member_message')}
      </span>
    </div>
  )
}
export default DocumentAlertPrivate;