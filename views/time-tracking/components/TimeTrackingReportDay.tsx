import { TimeTrackingReportDay as TimeTrackingReportDayI } from "@/types/time-tracking.type";
import { displayMessage, formatMinutesToHourMinute } from "@/utils/helper.util";
import React, { useEffect, useState } from "react";
import { FormOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useTranslations } from "next-intl";
import Modal from "@/common/components/Modal";
import Button from "@/common/components/Button";
import Textarea from "@/common/components/Textarea";
import Dropdown from "@/common/components/Dropdown";
import { MenuProps } from "antd";
import { BaseResponseType } from "@/types/base.type";
import { createReportForm } from "@/api/time-tracking.api";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

interface TimeTrackingReportDayProps {
  dayRecord: TimeTrackingReportDayI
  workspaceId: number
  timeTrackingId: number
}

const TimeTrackingReportDay: React.FC<TimeTrackingReportDayProps> = ({ dayRecord, workspaceId, timeTrackingId }) => {
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
  const [openReportForm, setOpenReportForm] = useState(false);
  const [content, setContent] = useState<string>('');
  const [type, setType] = useState<{id: number, value: string}>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const items: MenuProps["items"] = reportType.map(_v => {
    return {
      key: _v.id,
      label: <div className="text-center" onClick={() => setType(_v)}>
        {_v.value}
      </div>
    }
  });
  const handleSubmitReportForm = async () => {
    try {
      if (!type) {
        return;
      }
      setLoading(true);
      const response = await createReportForm(workspaceId, timeTrackingId, {
        content: content,
        report_type: type.id,
        date: dayRecord.date
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setOpenReportForm(false);
        return;
      }
      setError(response.error?.message);
    } catch (error) {
      setLoading(false);
      setError((error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    setContent('');
    setType(undefined);
    setError(undefined);
  }, [openReportForm]);

  /*
    1: quên check in
    2: check in trễ
    3: quên check out
    4: check out sớm
    5: check out trễ
  */

  return <>
    <tr className="date-row">
      <td className="ps-4 fw-bold" colSpan={1}>
        {dayRecord.date}
      </td>
      <td className="text-center" colSpan={2}>
        <span className="text-muted">{dayRecord.records.length} {t('time_tracking.record_label')}</span>
      </td>
      <td className="text-center fw-bold">
        {formatMinutesToHourMinute(dayRecord.records.reduce((sum, record) => sum + record.total_minute, 0))}
      </td>
      <td className="text-center">
        {
          dayRecord.day_off &&
          <span className={`badge rounded-pill bg-info bg-opacity-10 text-info`}>
            {t('time_tracking.day_off_label')}
          </span>
        }
      </td>
      <td className="pe-4 text-center">
        <button className="btn btn-sm btn-outline-primary" style={{ marginRight: 5 }} onClick={() => setOpenReportForm (true)}>
          <FormOutlined />
        </button>
        <button className="btn btn-sm btn-outline-primary">
          <UnorderedListOutlined />
        </button>
      </td>
    </tr>
    <Modal 
      open={openReportForm} 
      title={`${t('time_tracking.create_report_label')} "${dayRecord.date}"`}
      footerBtn={[
        <Button color='default' key={1} onClick={() => setOpenReportForm (false)} disabled={loading}>
          {t('common.btn_cancel')}
        </Button>,
        <Button key={2} color={loading ? 'secondary' : 'primary'} type="submit" disabled={loading || !type} onClick={handleSubmitReportForm}>
          {loading ? <Loading color="light" /> : t('common.btn_send')}
        </Button>
      ]
      }
      setOpen={setOpenReportForm} 
    >
      <div className="row">
        {
          error &&
          <div className="col-12">
            <div className={`alert alert-danger element-${error ? 'show' : 'hide'} alert-dismissible rounded-3 shadow-sm ${error ? 'mt-3' : ''}`}>
              <FontAwesomeIcon icon={faWarning} /> {error}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={() => setError(undefined)}
              ></button>
            </div>
          </div>
        }
        <div className="col-12">
          <Dropdown items={items} className="w-100 float-left">
            <Button color='secondary' outline className="w-100">
              {type ? type.value : t('time_tracking.select_report_type_label')}
            </Button>
          </Dropdown>
        </div>
        <div className="col-12 mt-2">
          <Textarea placeholder={t('time_tracking.note_label')} disabled={loading} onChange={(e) => setContent (e.target.value)}></Textarea>
        </div>
      </div>
    </Modal>
  </>
}
export default TimeTrackingReportDay;