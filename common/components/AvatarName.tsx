import { Avatar } from 'antd';
import React from 'react';

interface AvatarNameProps {
  name: string
  avatar?: string
  className?: string
  square?: boolean
  style?: React.CSSProperties;
}

const UserAvatar: React.FC<AvatarNameProps> = ({ name, avatar, className, square, style, ...rest }) => {
  if (!avatar) {
    return (
      <Avatar {...rest} className={className} shape={square ? 'square' : undefined} style={{ backgroundColor: '#fde3cf', color: '#f56a00', fontWeight: 500 }}>
        {name.substring(0, 1)}
      </Avatar>
    )
  }
  return <Avatar {...rest} className={className} shape={square ? 'square' : undefined} src={avatar} />
}
export default UserAvatar;