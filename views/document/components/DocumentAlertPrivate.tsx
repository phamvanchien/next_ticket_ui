import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const DocumentAlertPrivate = () => {
  return (
    <div className="col-12 mb-2">
      <span className="text-muted" style={{fontSize: 13}}>
        <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
        If you do not select any members, only you will be able to view this document
      </span>
    </div>
  )
}
export default DocumentAlertPrivate;