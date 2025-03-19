import { IMAGE_DEFAULT } from "@/enums/app.enum";
import { ResponseUserDataType } from "@/types/user.type";
import { Avatar, Tooltip } from "antd";
import React, { useState } from "react";

interface UserGroupProps {
  users: ResponseUserDataType[]
  className?: string
  plusIcon?: boolean
}

const UserGroup: React.FC<UserGroupProps> = ({ users, className, plusIcon }) => {
  return (
    <Avatar.Group
      className={className}
      max={{
        count: 3,
        style: { color: '#f56a00', backgroundColor: '#fde3cf' },
      }}
    >
      {
        users.map(user => (
          <Avatar src={user.avatar ?? IMAGE_DEFAULT.NO_USER} />
        ))
      }
      {plusIcon && <Avatar src={<img src={'/img/icon/user-plus.png'} width={50} height={50} alt="avatar" />} />}
    </Avatar.Group>
  )
}
export default UserGroup;