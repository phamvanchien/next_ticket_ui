import SkeletonLoading from "@/common/components/SkeletonLoading";
import { useTranslations } from "next-intl";

const NotificationLoading = () => {
  const t = useTranslations();
  return (
    <div className="container-fluid mt-4 wp-container">
      <h3 className="fw-semibold mb-4">{t('notification.page_title')}</h3>
      <div className="d-flex flex-column gap-3">
        <SkeletonLoading heigth={50} />
        <SkeletonLoading heigth={50} />
        <SkeletonLoading heigth={50} />
        <SkeletonLoading heigth={50} />
        <SkeletonLoading heigth={50} />
        <SkeletonLoading heigth={50} />
      </div>
    </div>
  );
}
export default NotificationLoading;