import { membersList } from "@/api/project.api";
import { members } from "@/api/workspace.api";
import ImageIcon from "@/common/components/ImageIcon";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { AppErrorType, BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { ResponseUserDataType } from "@/types/user.type";
import { faPlus, faPlusCircle, faTimes, faTimesCircle, faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TaskAssigneeProps {
  project: ProjectType
  setAssignee: (assignee: ResponseUserDataType[]) => void
  assignee: ResponseUserDataType[]
}

const TaskAssignee: React.FC<TaskAssigneeProps> = ({ project, assignee, setAssignee }) => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const [error, setError] = useState<AppErrorType | null>(null);
  const [membersData, setMembersData] = useState<ResponseWithPaginationType<ResponseUserDataType[]>>();
  const [showList, setShowList] = useState(false);
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const listMemberRef = useRef<HTMLUListElement>(null);
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
  const loadMembers = async () => {
    try {
      if (!workspace || !showList) {
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
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceKeyword(keyword);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
  }, [keyword]);
  useEffect(() => {
    loadMembers();
  }, [workspace, debounceKeyword, showList]);
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (listMemberRef.current && !listMemberRef.current.contains(event.target as Node)) {
        setShowList(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return <>
    <div className="col-3 text-secondary" style={{ paddingLeft: 20 }}>
      Assignee:
    </div>
    <div className="col-9">
      {
        assignee.map(assign => (
          <div key={assign.id}>
            {assign.avatar ? <img src={assign.avatar} className="img-circle mr-2" width={22} height={22} style={{marginRight: 3, marginBottom: 8}} /> : 
            <ImageIcon icon="user-loading" width={22} height={22} className="mr-2" style={{marginRight: 3, marginBottom: 8}} />}
            <span className="mr-2">{assign.first_name} {assign.last_name}</span>
            <FontAwesomeIcon icon={faTimesCircle} className="mr-2 text-secondary" style={{ cursor: 'pointer' }} onClick={() => handleRemoveAssignee (assign)} />
          </div>
        ))
      } 
      {
        !showList && <><FontAwesomeIcon icon={faPlusCircle} className="mt-2 text-gray" style={{cursor: 'pointer', fontSize: 22}} onClick={() => setShowList (true)} /> Add assignee</>
      }
    </div>
    <div className="col-3 mt-2" style={!showList ? {display:'none'} : undefined}></div>
    <div className="col-9 mt-2" style={!showList ? {display:'none'} : undefined}>
      {
        (membersData && showList) &&
        <ul className="list-group" ref={listMemberRef}>
          <li className="list-group-item assignee-item" style={{padding: 0}}>
            <Input type="search" className="search-assignee" placeholder="Search member" onChange={handleChangeKeyword} />
          </li>
          {
            !assignee.find(a => a.id === project.user.id) &&
            <li className="list-group-item assignee-item" style={{ cursor: 'pointer' }} onClick={() => handleSelectAssignee (project.user)}>
              {project.user.avatar ? <img src={project.user.avatar} width={22} height={22} className="img-circle mr-2" /> : <FontAwesomeIcon icon={faUserCircle} className="mr-2" style={{fontSize: 22}} />} 
              {project.user.first_name} {project.user.last_name} (Project owner)
            </li>
          }
          {
            membersData.items.filter(m => !assignee.map(a => a.id).includes(m.id)).map(member => (
              <li className="list-group-item assignee-item" key={member.id} style={{ cursor: 'pointer' }} onClick={() => handleSelectAssignee (member)}>
                {member.avatar ? <img src={member.avatar} width={22} height={22} className="img-circle mr-2" /> : <ImageIcon icon="user-loading" width={22} height={22} className="mr-2" />} 
                {member.first_name} {member.last_name}
              </li>
            ))
          }
        </ul>
      }
    </div>
  </>
}
export default TaskAssignee;