import dynamic from "next/dynamic";
import React from "react";

const NoSSRAvatarGroup = dynamic(() => import("antd").then((mod) => mod.Avatar.Group), { ssr: false });

interface UserGroupProps {
  children: React.ReactNode;
  className?: string;
}

const UserGroup: React.FC<UserGroupProps> = ({ children, className }) => {
  return (
    <NoSSRAvatarGroup
      className={className}
      max={{
        count: 3,
        style: { color: "#f56a00", backgroundColor: "#fde3cf" },
      }}
    >
      {children}
      {/* <Tooltip title="Ant User" placement="top">
        <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
      </Tooltip> */}
    </NoSSRAvatarGroup>
  );
};

export default UserGroup;