import { update } from "@/api/task.api";
import Input from "@/common/components/Input";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import ModalHeader from "@/common/modal/ModalHeader";
import { API_CODE } from "@/enums/api.enum";
import { APP_ERROR } from "@/enums/app.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ProjectTagType } from "@/types/project.type";
import { notify } from "@/utils/helper.util";
import { faCheck, faCheckCircle, faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface SelectStatusModalProps {
  statusList?: ResponseWithPaginationType<ProjectTagType[]>
  openModal: boolean
  taskStatus: ProjectTagType
  taskId: number
  projectId: number
  setTaskStatus: (taskStatus: ProjectTagType) => void
  setOpenModal: (openModal: boolean) => void
  setSearchStatus: (searchStatus: string) => void
}

const SelectStatusModal: React.FC<SelectStatusModalProps> = ({ 
  statusList, 
  openModal,  
  taskStatus, 
  taskId, 
  projectId, 
  setTaskStatus, 
  setOpenModal, 
  setSearchStatus 
}) => {
  const [keyword, setKeyword] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const updateStatusTask = async (status: ProjectTagType) => {
    try {
      if (!workspace || !status) {
        return;
      }
      if (status.id === taskStatus.id) {
        setOpenModal(false);
        setSearchStatus('');
        return;
      }
      setLoading(true);
      const response = await update(workspace.id, projectId, taskId, {
        status_id: status.id
      });
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setTaskStatus(status);
        setOpenModal(false);
        setSearchStatus('');
        return;
      }
      notify(catchError(response)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    } catch (error) {
      setLoading(false);
      notify(catchError(error as BaseResponseType)?.message ?? APP_ERROR.SERVER_MAINTAIN, 'error');
    }
  }
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchStatus(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  return (
    <Modal className="select-status-modal" isOpen={openModal ? true : false}>
      <ModalHeader
        setShow={setOpenModal}
      />
      <ModalBody>
        <div className="row mb-2">
          {
            (statusList && statusList.total > 5) &&
            <div className="col-12">
              <Input type="search" placeholder={t('tasks.placeholder_search_status')} className="input-search w-100" onChange={handleChangeKeyword} disabled={loading} />
            </div>
          }
          <div className="col-12 mt-2">
            {
              statusList && statusList.items.map(item => (
                <div className="card-header p-unset border-unset mb-2" key={item.id}>
                  <h6 
                    className="card-title status-label w-100" 
                    style={{ background: item.color, fontSize: 12, padding: 5, cursor: 'pointer' }}
                    onClick={() => updateStatusTask (item)}
                  >
                    <FontAwesomeIcon icon={faCircle} style={{ fontSize: 7, color: '#3333' }} className="mr-2" /> 
                    {item.name} {taskStatus.id === item.id && <FontAwesomeIcon icon={faCheck} className="float-right mr-2" />}
                  </h6>
                </div>
              ))
            }
          </div>
        </div>
      </ModalBody>
    </Modal>
  )
}
export default SelectStatusModal;