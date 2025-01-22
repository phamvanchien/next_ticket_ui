import { faAngleDoubleDown, faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { changePositionStatus, removeStatus, statusList } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { ProjectTagType, ProjectType} from "@/types/project.type";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import CreateStatusModal from "@/views/task/create/components/CreateStatusModal";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import Button from "@/common/components/Button";
import { notify } from "@/utils/helper.util";
import { catchError } from "@/services/base.service";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import StatusSettingItem from "./StatusSettingItem";

interface ProjectStatusSettingProps {
  project: ProjectType;
}

const ProjectStatusSetting: React.FC<ProjectStatusSettingProps> = ({ project }) => {
  const defaultPageSize = 10;
  const [statusData, setStatusData] = useState<ResponseWithPaginationType<ProjectTagType[]>>();
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [keyword, setKeyword] = useState<string>("");
  const [debounceKeyword, setDebounceKeyword] = useState<string>("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [statusDeleteId, setStatusDeleteId] = useState<number>();
  const [statusDragged, setStatusDragged] = useState<ProjectTagType>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const deleteStatusModal = "deleteProjectStatus";

  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword("");
    if (event.target.value && event.target.value !== "") {
      setKeyword(event.target.value);
    }
  };

  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);

  const loadStatus = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await statusList(workspace.id, project.id, {
        page: 1,
        size: pageSize,
        keyword: keyword,
        prioritySort: "ASC"
      });
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setStatusData(response.data);
        return;
      }
      setStatusData(undefined);
    } catch (error) {
      setLoadingViewMore(false);
      setStatusData(undefined);
    }
  };

  const handleDeleteStatus = async () => {
    try {
      if (!workspace || !statusDeleteId) {
        return;
      }
      setLoadingDelete(true);
      const response = await removeStatus(workspace.id, project.id, statusDeleteId);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        loadStatus();
        setStatusDeleteId(undefined);
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      setLoadingDelete(false);
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }

  useEffect(() => {
    loadStatus();
  }, [workspace, debounceKeyword, pageSize]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const status: ProjectTagType = JSON.parse(e.currentTarget.dataset.value as string);
    const updatedItems = [...(statusData?.items || [])];
    const [draggedItem] = updatedItems.splice(draggedIndex, 1);
    updatedItems.splice(index, 0, draggedItem);

    setDraggedIndex(index);
    setStatusData({
      total: statusData?.total ?? 0,
      totalPage: statusData?.totalPage ?? 0,
      items: updatedItems
    });

    handleChangePositionStatus(status.id);
  };

  const handleChangePositionStatus = async (statusTargetId: number) => {
    try {
      if (!workspace || !statusDragged) {
        return;
      }
      const response = await changePositionStatus(workspace.id, project.id, statusDragged.id, {
        statusTargetId: statusTargetId
      });
      if (response && response.code === API_CODE.OK) {
        setStatusDragged(undefined);
        return;
      }
      notify(catchError(response)?.message ?? '', 'error');
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }

  return (
    <>
      <CreateStatusModal 
        openCreate={openCreate} 
        setOpenCreate={setOpenCreate} 
        projectId={project.id} 
        loadStatus={loadStatus}
      />
      <div className="row">
        <div className="col-12 col-lg-4 col-sm-6 mt-4">
          <h5 className="text-muted">Status</h5>
          <i className="text-muted">
            <FontAwesomeIcon icon={faInfoCircle} /> You can change the position of the status by dragging and dropping or create a new status here.
          </i>
        </div>
      </div>
      <div className="row mt-2 mb-2">
        <div className="col-12 col-lg-4 col-sm-6">
          <div className="mt-2"
            style={{
              padding: "8px",
              borderRadius: "5px",
              backgroundColor: "#f8f9fa",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
              cursor: "pointer",
            }}
            onClick={() => setOpenCreate (true)}
          >
            Create new <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-sm-6">
          <Input type="search" placeholder="Enter status title" style={{
              padding: "8px",
              borderRadius: "5px"
            }}
            onChange={handleChangeKeyword} 
          />
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-lg-4 col-sm-6">
          {statusData && statusData.items.map((item, index) => (
            <StatusSettingItem
              status={item}
              projectId={project.id}
              position={index}
              key={index}
              setDraggedIndex={setDraggedIndex}
              setStatusDragged={setStatusDragged}
              handleDragOver={handleDragOver}
              setDeleteId={setStatusDeleteId}
            />
          ))}
        </div>
      </div>
      {
        (statusData && statusData.total > pageSize) &&
        <div className="row mt-2">
          <div className="col-12 col-lg-4 col-sm-6">
            <span className="link mt-4 mb-2 text-secondary" style={{cursor: 'pointer'}} onClick={!loadingViewMore ? handleViewMore : undefined}>
              View more {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
            </span>
          </div>
        </div>
      }
      <Modal className="delete-status-modal" isOpen={statusDeleteId ? true : false}>
        <ModalBody>
          <div className="row">
            <div className="col-12 mb-2">
              <h6 className="text-muted">
                You will delete this status including all related data.
              </h6>
            </div>
            <div className="col-6">
              <Button color="danger" fullWidth onClick={handleDeleteStatus} disabled={loadingDelete}>
                OK {loadingDelete && <Loading color="light" />}
              </Button>
            </div>
            <div className="col-6">
              <Button color="danger" fullWidth outline disabled={loadingDelete} onClick={() => setStatusDeleteId (undefined)}>
                Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  );
};

export default ProjectStatusSetting;