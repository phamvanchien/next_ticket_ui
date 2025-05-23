"use client";
import Button from "@/common/components/Button";
import NoData from "@/common/components/NoData";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType } from "@/types/base.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { faClock, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import { timeTracking } from "@/api/time-tracking.api";
import { TimeTrackingType } from "@/types/time-tracking.type";
import TimeTrackingItem from "./components/TimeTrackingItem";
import { WorkspaceType } from "@/types/workspace.type";
import TimeTrackingLoading from "./components/TimeTrackingLoading";
import { useRouter } from "next/navigation";
import { setSidebarSelected } from "@/reduxs/menu.redux";
import { useAppDispatch } from "@/reduxs/store.redux";

interface TimeTrackingManageViewProps {
  workspace: WorkspaceType
}

const TimeTrackingManageView: React.FC<TimeTrackingManageViewProps> = ({ workspace }) => {
  const t = useTranslations();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [timeTrackingData, setTimeTrackingData] = useState<TimeTrackingType[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTimeTracking = async () => {
    try {
      const response = await timeTracking(workspace.id, {
        page: 1,
        size: 10
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setTimeTrackingData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }

  useEffect(() => {
    loadTimeTracking();
  }, [workspace]);

  useEffect(() => {
    dispatch(setSidebarSelected('time-tracking-manage'));
  }, []);

  return <>
    <div className="container-fluid px-3 py-3">
      <div className="d-flex justify-content-between align-items-center mb-3 mt-4">
        <h3 className="mb-0">
          <FontAwesomeIcon icon={faClock} className="text-primary me-2" />
          {t("time_tracking.page_title")}
        </h3>

        <div className="d-flex gap-3">
          <Button color="primary" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => router.push(`/workspace/${workspace.id}/time-tracking/create`)}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: 5 }} /> {t('common.btn_new')}
          </Button>
        </div>
      </div>

      {
        !loading ? <>
          <div className="row">
            {
              (timeTrackingData.length > 0) &&
              timeTrackingData.map((item, index) => (
                <div key={item.id} className="col-lg-3 col-md-4 col-12 mb-4">
                  <TimeTrackingItem timeTracking={item} key={index} />
                </div>
              ))
            }
          </div>
          <div className="d-md-none">
            <div className="floating-buttons">
              <Button color="primary" className="rounded-circle shadow">
                <FontAwesomeIcon icon={faPlus} size="lg" />
              </Button>
            </div>
          </div>
        </> : <TimeTrackingLoading />
      }
    </div>
  </>
}
export default TimeTrackingManageView;