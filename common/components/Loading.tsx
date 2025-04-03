import { faCircleDot, faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LoadingProps {
  color: "light" | "primary" | "secondary" | "success" | "warning" | "info" | "dark" | "danger"
  size?: number
  className?: string
}

const Loading: React.FC<LoadingProps> = ({ color, size, className }) => {
  return <FontAwesomeIcon className={`text-${color} ${className ? className : ''}`} icon={faCircleNotch} spin style={{fontSize: size}} />
}
export default Loading;