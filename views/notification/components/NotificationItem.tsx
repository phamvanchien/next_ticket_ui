import RelativeTime from "@/common/components/RelativeTime";
import { useSocket } from "@/hooks/useSocket";
import { setNotifyViewed } from "@/reduxs/notification.redux";
import { useAppDispatch } from "@/reduxs/store.redux";
import { NotificationType } from "@/types/notification.type";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface NotificationItemProps {
  notify: NotificationType
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notify }) => {
  const socket = useSocket();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isViewed, setIsViewed] = useState(notify.viewed ? true : false);
  const handleClickNotify = () => {
    dispatch(setNotifyViewed(notify.id));
    setIsViewed(true);
    socket?.emit('viewed_notify', notify.id.toString());
    router.push(notify.link);
  }
  const handleViewNotify = () => {
    dispatch(setNotifyViewed(notify.id));
    setIsViewed(true);
    socket?.emit('viewed_notify', notify.id.toString());
  }

  return (
    <a className={`notification-item${!isViewed ? '-active' : ''}`}>
      <div className="float-left">
        <div className="fw-semibold pointer" onClick={handleClickNotify}>{notify.title}</div>
        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
          <RelativeTime time={notify.created_at} />
        </div>
      </div>
      {!isViewed && <FontAwesomeIcon icon={faEye} className="float-right mt-3" onClick={handleViewNotify} />}
    </a>
  )
}
export default NotificationItem;