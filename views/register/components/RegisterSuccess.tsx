import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RegisterSuccess = () => {
  return <>
    <center>
      <FontAwesomeIcon icon={faCheckCircle} className="text-success mb-2" style={{ fontSize: 50 }} />
      <p className="text-dark">Account created</p>
      <p className="text-primary">Please check your email <br />to verify your account</p>
    </center>
  </>
}
export default RegisterSuccess;