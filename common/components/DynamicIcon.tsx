import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as Icons from "@fortawesome/free-solid-svg-icons";

interface DynamicIconProps {
  iconName: string;
  style?: React.CSSProperties;
  className?: string;
}

const DynamicIcon: React.FC<DynamicIconProps> = ({ iconName, ...rest }) => {
  const iconKey = `fa${iconName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")}`;

  const icon = (Icons as any)[iconKey];

  if (!icon) {
    return <span>Icon not found</span>;
  }

  return <FontAwesomeIcon icon={icon} {...rest} />;
};

export default DynamicIcon;