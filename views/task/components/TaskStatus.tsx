import Input from "@/common/components/Input";
import { faCircle, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useState } from "react";
import { statusList } from "@/api/project.api";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { API_CODE } from "@/enums/api.enum";
import CreateStatusModal from "../create/components/CreateStatusModal";
import { ProjectTagType } from "@/types/project.type";
import { ResponseWithPaginationType } from "@/types/base.type";

interface TaskStatusProps {
  projectId: number
  status?: ProjectTagType,
  setStatus: (status?: ProjectTagType) => void
}

const TaskStatus: React.FC<TaskStatusProps> = ({ projectId, status, setStatus }) => {
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [showList, setShowList] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [statusData, setStatusData] = useState<ResponseWithPaginationType<ProjectTagType[]>>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectStatus = (status: ProjectTagType) => {
    setStatus(status);
  }
  const loadStatus = async () => {
    try {
      if (!workspace || !showList) {
        return;
      }
      const response = await statusList(workspace.id, projectId, {
        page: 1,
        size: 5,
        keyword: keyword
      });
      if (response && response.code === API_CODE.OK) {
        setStatusData(response.data);
        return;
      }
      setStatusData(undefined);
    } catch (error) {
      setStatusData(undefined);
    }
  }
  useEffect(() => {
    loadStatus();
  }, [workspace, showList, debounceKeyword]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  return <>
    <div className="col-3 mt-2 text-secondary" style={{ paddingLeft: 20 }}>
      Status:
    </div>
    {
      status && 
      <div className="col-9 mt-2">
        <span className="badge badge-secondary mr-2 mt-2" style={{ background: status.color }} key={status.id}>
          <span>{status.name}</span>
        </span>
      </div>
    }
    {status && <div className="col-3 mt-2" style={!showList ? {display:'none'} : undefined}></div>}
    <div className={`col-9 ${status ? 'mt-2' : 'mt-4'}`} style={!showList ? {display:'none'} : undefined}>
      <ul className="list-group">
        <li className="list-group-item assignee-item" style={{padding: 0}}>
          <Input type="search" className="search-assignee" placeholder="Search tags" onChange={handleChangeKeyword} />
        </li>
        {
          statusData && statusData.items.filter(m => status?.id !== m.id).map(item => (
            <li className="list-group-item assignee-item" style={{ cursor: 'pointer' }} key={item.id} onClick={() => handleSelectStatus (item)}>
              <FontAwesomeIcon icon={faCircle} style={{color: item.color}} /> {item.name}
            </li>
          ))
        }
        <li className="list-group-item assignee-item text-primary" style={{ cursor: 'pointer' }}>
          <span onClick={() => setOpenCreate (true)}>Create new <FontAwesomeIcon icon={faPlus} /></span>
        </li>
      </ul>
    </div>
    <CreateStatusModal openCreate={openCreate} setOpenCreate={setOpenCreate} projectId={projectId} loadStatus={loadStatus} />
  </>
}
export default TaskStatus;