"use client"
import { notifications } from "@/api/notification.api";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import { API_CODE } from "@/enums/api.enum";
import { ResponseWithPaginationType } from "@/types/base.type";
import { NotificationType } from "@/types/notification.type";
import { faAngleDoubleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import NotificationLoading from "./components/NotificationLoading";
import NoData from "@/common/components/NoData";
import NotificationItem from "./components/NotificationItem";

const NotificationView = () => {
  const t = useTranslations();
  const defaultPageSize = 10;
  const [notificationData, setNotificationData] = useState<ResponseWithPaginationType<NotificationType[]>>();
  const [loading, setLoading] = useState(true);
  const [loadingLoadMore, setLoadingLoadMore] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const loadNotification = async () => {
    try {
      const response = await notifications({
        page: 1,
        size: pageSize
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setNotificationData(response.data);
      }
    } catch (error) {
      setLoading(false);
      setNotificationData(undefined);
    }
  }
  const handleLoadMore = () => {
    setLoadingLoadMore(true);
    setPageSize(pageSize + defaultPageSize);
  }
  useEffect(() => {
    loadNotification();
  }, [pageSize]);
  if (loading) {
    return <NotificationLoading />
  }
  if (!notificationData) {
    return <></>
  }
  if (notificationData && notificationData.total === 0) {
    return <NoData message={t('notification.no_data_message')}></NoData>
  }
  return (
    <div className="container-fluid mt-4 wp-container">
      <h3 className="fw-semibold mb-4">{t('notification.page_title')}</h3>
      <div className="d-flex flex-column gap-3">
        {
          notificationData.items.map((notify, key) => (
            <NotificationItem notify={notify} key={key} />
          ))
        }
      </div>
      {
        (pageSize < notificationData.total) &&
        <div className="col-12 mt-2">
          <Button color="default" onClick={loadingLoadMore ? undefined : handleLoadMore}>
            <FontAwesomeIcon icon={faAngleDoubleDown} /> {loadingLoadMore ? <Loading color="secondary" /> : t('common.btn_view_more')}
          </Button>
        </div>
      }
    </div>
  );
}
export default NotificationView;