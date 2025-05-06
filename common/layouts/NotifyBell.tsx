import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../components/Dropdown";
import Link from "next/link";
import { MenuProps } from "antd";
import React, { Dispatch, MouseEvent, SetStateAction } from "react";
import { useSocket } from "@/hooks/useSocket";
import { NotificationType } from "@/types/notification.type";
import RelativeTime from "../components/RelativeTime";
import { useTranslations } from "next-intl";

interface NotifyBellProps {
  notificationData: NotificationType[]
  notificationTotal: number
  setNotificationData: Dispatch<SetStateAction<NotificationType[]>>
  setNotificationTotal: Dispatch<SetStateAction<number>>
}
const NotifyBell: React.FC<NotifyBellProps> = ({ 
  notificationData,
  notificationTotal,
  setNotificationData,
  setNotificationTotal
}) => {
  const t = useTranslations();
  const socket = useSocket();
  const handleClickNotify = (event: MouseEvent<HTMLAnchorElement>) => {
    const id = Number(event.currentTarget.getAttribute("data-id"));
    if (!id) return;
  
    setNotificationData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, viewed: 1 } : item
      )
    );
    setNotificationTotal((prev) => Math.max(0, prev - 1));
    socket?.emit('viewed_notify', id.toString());
  }

  const items: MenuProps["items"] = notificationData.map((noti) => ({
    key: noti.id,
    label: (
      <Link href={noti.link} data-id={noti.id} className={`notification-item${!noti.viewed ? '-active' : ''}`} onClick={handleClickNotify}>
        <div className="fw-semibold">{noti.title}</div>
        <div className="text-muted" style={{ fontSize: "0.75rem" }}>
          <RelativeTime time={noti.created_at} />
        </div>
      </Link>
    ),
  }));

  if (notificationData.length > 9) {
    items.push({
      key: "all",
      label: (
        <Link href="/notifications" className="dropdown-footer text-center">
          {t('notification.view_all')}
        </Link>
      ),
      type: "group",
    });
  }

  return (
    <div className="position-relative me-3 pointer notification-bell-wrapper">
      <Dropdown items={items}>
        <FontAwesomeIcon icon={faBell} size="lg" />
        {
          notificationTotal > 0 &&
            <span className="position-absolute top-0 start-100 translate-middle badge notification-bell rounded-pill bg-danger">
            {notificationTotal}
          </span>
        }
      </Dropdown>
    </div>
  );
};

export default NotifyBell;