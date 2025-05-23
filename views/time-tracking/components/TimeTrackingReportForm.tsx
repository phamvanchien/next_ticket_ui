import { deleteReport, getReportList } from "@/api/time-tracking.api";
import LoadingGif from "@/common/components/LoadingGif";
import { API_CODE } from "@/enums/api.enum";
import { TimeTrackingReportFormType, TimeTrackingType } from "@/types/time-tracking.type";
import { dateToString, displayMessage } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import React, { useEffect, useState } from "react";
import Button from "@/common/components/Button";
import { DeleteOutlined } from '@ant-design/icons';
import Modal from "@/common/components/Modal";
import Loading from "@/common/components/Loading";
import { BaseResponseType } from "@/types/base.type";
import NoData from "@/common/components/NoData";

interface TimeTrackingReportFormProps {
  timeTracking: TimeTrackingType
}

const TimeTrackingReportForm: React.FC<TimeTrackingReportFormProps> = ({ timeTracking }) => {
  const t = useTranslations();
  const reportType: {id: number, value: string}[] = [
  {
    id: 1,
    value: t('time_tracking.not_check_in')
  },
  {
    id: 2,
    value: t('time_tracking.check_in_late')
  },
  {
    id: 3,
    value: t('time_tracking.not_check_out')
  },
  {
    id: 4,
    value: t('time_tracking.check_out_soon')
  }
];
  const [reportData, setReportData] = useState<TimeTrackingReportFormType[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const loadReportList = async () => {
    try {
      const response = await getReportList(timeTracking.workspace_id, timeTracking.id);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setReportData(response.data);
        return;
      }
      setReportData([]);
    } catch (error) {
      setLoading(false);
      setReportData([]);
    }
  }
  const openConfirmDelete = (id: number) => {
    setConfirmDelete(true);
    setDeleteId(id);
  }
  const handleDeleteComment = async () => {
    try {
      if (!deleteId) {
        return;
      }
      setLoadingDelete(true);
      const response = await deleteReport(timeTracking.workspace_id, timeTracking.id, deleteId);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        loadReportList();
        setConfirmDelete(false);
        setDeleteId(undefined);
      }
    } catch (error) {
      setLoadingDelete(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadReportList();
  }, []);
  return (
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-report table-hover align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th className="ps-4">{t('time_tracking.date_label')}</th>
              <th className="text-center">{t('time_tracking.title_label')}</th>
              <th className="text-center">{t('time_tracking.content_label')}</th>
              <th className="text-center">{t('time_tracking.status_label')}</th>
              <th className="text-center">{t('time_tracking.send_at_label')}</th>
              <th className="pe-4 text-center">#</th>
            </tr>
          </thead>
          <tbody>
            {
              (!loading) ? <>
                {
                  reportData.length > 0 ? 
                    reportData.map((item, index) => (
                    <tr className="record-row" key={index}>
                      <td className="ps-4">
                        <small className="text-muted">{dateToString(new Date(item.date))}</small>
                      </td>
                      <td className="text-center">
                        {reportType.find(_v => _v.id === item.type)?.value}
                      </td>
                      <td className="text-center">
                        <span className="badge bg-light text-dark border" title={item.content}>{item.content.substring(0, 50)}</span>
                      </td>
                      <td className="text-center">
                        {
                          item.approve_at ? 
                          <span className={`badge rounded-pill bg-success bg-opacity-10 text-success`}>{t('time_tracking.approved_label')}</span> : 
                          <span className={`badge rounded-pill bg-warning bg-opacity-10 text-warning`}>{t('time_tracking.waiting_approve_label')}</span>
                        }
                      </td>
                      <td className="text-center">
                        <small className="text-muted">{dateToString(new Date(item.created_at))}</small>
                      </td>
                      <td className="pe-4 text-center">
                        {
                          !item.approve_at &&
                          <Button color="danger" outline onClick={() => openConfirmDelete (item.id)}>
                            <DeleteOutlined />
                          </Button>
                        }
                      </td>
                    </tr>
                  )) : <tr>
                    <td colSpan={6}>
                      <NoData message={t('time_tracking.no_data_report')}></NoData>
                    </td>
                  </tr>
                }
              </> : 
              <tr>
                <td colSpan={6} className="text-center">
                  <LoadingGif width={70} height={70} />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
      <Modal 
        open={confirmDelete} 
        title={t('time_tracking.confirm_delete_report')}
        footerBtn={[
          <Button color='default' key={1} onClick={() => setConfirmDelete (false)} className='mr-2' disabled={loadingDelete}>
            {t('common.btn_cancel')}
          </Button>,
          <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" onClick={handleDeleteComment} disabled={loadingDelete}>
            {loadingDelete ? <Loading color="light" /> : t('common.btn_delete')}
          </Button>
        ]
        }
        setOpen={setConfirmDelete} 
      >
        <div className="row"></div>
      </Modal>
    </div>
  )
}
export default TimeTrackingReportForm;