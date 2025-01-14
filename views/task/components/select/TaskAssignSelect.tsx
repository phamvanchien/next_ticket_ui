import { membersList } from "@/api/project.api";
import { members } from "@/api/workspace.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import { ResponseMemberWorkspaceDataType } from "@/types/workspace.type";
import { faTimes, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskAssignSelectProps {
  assignee: ResponseUserDataType[]
  setAssignee: (assignee: ResponseUserDataType[]) => void
  project: ProjectType
  className?: string
}

const TaskAssignSelect: React.FC<TaskAssignSelectProps> = ({ assignee, project, className, setAssignee }) => {
  const [membersData, setMembersData] = useState<ResponseMemberWorkspaceDataType>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [openMemberList, setOpenMemberList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const listMembersRef = useRef<HTMLDivElement>(null);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const loadMembers = async () => {
    try {
      if (!workspace || !openMemberList) {
        return;
      }

      if (project.is_public) {
        const membersWorkspace = await members(workspace.id, 1, 3, keyword);
        if (membersWorkspace && membersWorkspace.code === API_CODE.OK) {
          setMembersData(membersWorkspace.data);
          return;
        }
        setError(catchError(membersWorkspace));
        return;
      }

      const membersProject = await membersList(workspace.id, project.id, 1, 3, keyword);
      if (membersProject && membersProject.code === API_CODE.OK) {
        setMembersData(membersProject.data);
        return;
      }

    } catch (error) {
      setError(catchError(error as BaseResponseType));
    }
  }
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const handleSelectAssignee = (member: ResponseUserDataType) => {
    const added = assignee.find(a => a.id === member.id);
    if (!added) {
      setAssignee([...assignee, member]);
    }
  }
  const handleRemoveAssignee = (member: ResponseUserDataType) => {
    setAssignee(assignee.filter(a => a.id !== member.id));
  }
  useEffect(() => {
    if (openMemberList) {
      loadMembers();
    }
  }, [workspace, debounceKeyword, openMemberList]);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (listMembersRef.current && !listMembersRef.current.contains(event.target as Node)) {
        setOpenMemberList(false);
        setKeyword('');
        setDebounceKeyword('');
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div className={`row text-secondary ${className ?? ''}`}>
      <div className="col-4 lh-40">
        Assignee:
      </div>
      <div className="col-8" onClick={() => setOpenMemberList (true)} ref={listMembersRef}>
        {
          assignee.length === 0 &&
          <span className="badge badge-light mr-2">
            <img className="img-circle" onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} src={'/img/icon/user-loading.png'} width={25} height={25} /> Unassigned 
          </span>
        }
        {
          assignee.map((member, index) => (
            <span className="badge badge-light mr-2" key={index}>
              <img className="img-circle" onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} src={member.avatar ?? '/img/icon/user-loading.png'} width={25} height={25} /> Chien 
              <FontAwesomeIcon icon={faTimes} className="mt-2 ml-2 text-secondary" onClick={() => handleRemoveAssignee (member)} />
            </span>
          ))
        }
        {
          openMemberList &&
          <>
            <ul className="list-group select-search-task">
              <li className="list-group-item border-unset p-unset">
                <Input type="search" className="w-100" onChange={handleChangeKeyword} />
              </li>
              {
                !assignee.find(a => a.id === project.user.id) &&
                <li className="list-group-item border-unset p-unset" onClick={() => handleSelectAssignee (project.user)}>
                  <span className="badge badge-default w-100 text-left">
                    <img className="img-circle" src={project.user.avatar ?? '/img/icon/user-loading.png'} onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} width={25} height={25} /> {project.user.first_name} {project.user.last_name} (Project owner)
                  </span>
                </li>
              }
              {
                membersData && membersData.items.filter(m => !assignee.map(a => a.id).includes(m.id)).map((member, index) => (
                  <li className="list-group-item border-unset p-unset" key={index} onClick={() => handleSelectAssignee (member)}>
                    <span className="badge badge-default w-100 text-left">
                      <img className="img-circle" src={member.avatar ?? '/img/icon/user-loading.png'} onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} width={25} height={25} /> {member.first_name} {member.last_name}
                    </span>
                  </li>
                ))
              }
            </ul>
          </>
        }
      </div>
    </div>
  )
}
export default TaskAssignSelect;