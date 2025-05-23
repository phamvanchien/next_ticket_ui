import UserAvatar from "@/common/components/AvatarName";
import UserGroup from "@/common/components/UserGroup";
import { TimeTrackingType } from "@/types/time-tracking.type";
import { dateToString } from "@/utils/helper.util";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TimeTrackingItemProps {
  timeTracking: TimeTrackingType
}

const TimeTrackingItem: React.FC<TimeTrackingItemProps> = ({ timeTracking }) => {
  const t = useTranslations();
  const router = useRouter();
  const [trackingArea, setTrackingArea] = useState(t('time_tracking.tracking_in_workspace'));
  useEffect(() => {
    if (timeTracking.tracking_type === 2) {
      setTrackingArea(t('time_tracking.tracking_in_project'));
    }
    if (timeTracking.tracking_type === 1) {
      setTrackingArea(t('time_tracking.tracking_in_group'));
    }
  }, [timeTracking]);
  return (
    <div className="project-card" onClick={() => router.push (`/workspace/${timeTracking.workspace_id}/time-tracking/${timeTracking.id}`)}>
      <div className="card-title">
        <div>
          <FontAwesomeIcon icon={faClock} className="text-muted me-2" />
          <Link href={`/workspace/${timeTracking.workspace_id}/time-tracking/${timeTracking.id}`} className={!timeTracking.active ? 'text-secondary' : ''}>
            {timeTracking.title}
          </Link>
        </div>
        {
          (timeTracking.members && timeTracking.members.length > 0) &&
          <div className="project-members">
            <UserGroup>
              {timeTracking.members.map(pm => (
                <UserAvatar key={pm.user.id} name={pm.user.first_name} avatar={pm.user.avatar} />
              ))}
            </UserGroup>
          </div>
        }

      </div>

      <div className="text-muted small">
        {t("time_tracking.area_tracking")}: {trackingArea}
      </div>

      <div className="text-muted small mt-1">
        {t("common.created_at_label")}: {dateToString(new Date(timeTracking.created_at))}
      </div>
    </div>
  );
}
export default TimeTrackingItem;