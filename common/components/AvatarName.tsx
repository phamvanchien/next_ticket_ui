import { Avatar } from 'antd';
import React from 'react';

interface AvatarNameProps {
  name: string
  avatar?: string
  className?: string
  square?: boolean
}

const UserAvatar: React.FC<AvatarNameProps> = ({ name, avatar, className, square }) => {
  if (!avatar) {
    return (
      <Avatar className={className} shape={square ? 'square' : undefined} style={{ backgroundColor: '#fde3cf', color: '#f56a00', fontWeight: 500 }}>
        {name.substring(0, 1)}
      </Avatar>
    )
  }
  return <Avatar className={className} shape={square ? 'square' : undefined} src={avatar} />
}
export default UserAvatar;