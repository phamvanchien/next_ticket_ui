import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SendLinkSuccess = () => {
  return <>
    <center>
      <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-2" style={{ fontSize: 50 }} />
      <p className="text-dark">Sent link for you</p>
      <p className="text-primary">Please check your email <br />to reset password</p>
    </center>
  </>
}
export default SendLinkSuccess;