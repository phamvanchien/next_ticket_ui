import { update } from "@/api/project.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Textarea from "@/common/components/Textarea";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { catchError } from "@/services/base.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType, RequestUpdateProjectType } from "@/types/project.type";
import { notify } from "@/utils/helper.util";
import { faArrowAltCircleRight, faCaretDown, faCaretRight, faCheckCircle, faCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import RemoveProjectModal from "./RemoveProjectModal";
import AddMemberModal from "./AddMemberModal";
import { useRouter } from "next/navigation";
import { APP_LINK } from "@/enums/app.enum";

interface ProjectTableItemProps {
  project: ProjectType
  loadProjects: () => void
}

const ProjectTableItem: React.FC<ProjectTableItemProps> = ({ project, loadProjects }) => {
  const router = useRouter();
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputNameRef = useRef<HTMLInputElement>(null);
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const [modalDelete, setModalDelete] = useState<boolean>(false);
  const [modalAddMember, setModalAddmember] = useState<boolean>(false);
  const [expand, setExpand] = useState(false);
  const [projectPublic, setProjectPublic] = useState(project.is_public);
  const updateProject = async (payload: RequestUpdateProjectType, callbackSuccess?: () => void) => {
    try {
      if (!workspace) {
        return;
      }

      const response = await update (workspace.id, project.id, payload);
      if (response && response.code !== API_CODE.OK) {
        notify(catchError(response)?.message ?? '', 'error');
        return;
      }
      if (callbackSuccess) {
        callbackSuccess();
      }
    } catch (error) {
      notify(catchError(error as BaseResponseType)?.message ?? '', 'error');
    }
  }
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (inputNameRef.current && !inputNameRef.current.contains(event.target as Node)) {
        if (!inputNameRef.current || inputNameRef.current.value === project.name) {
          return;
        }
        if (!inputNameRef.current.value || inputNameRef.current.value === '') {
          inputNameRef.current.value = project.name;
          return;
        }

        updateProject({ 
          name: inputNameRef.current.value, 
          is_public: projectPublic
        });
        return;
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {

      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        if (!textareaRef.current || textareaRef.current.value === project.description) {
          return;
        }

        updateProject({ 
          description: textareaRef.current.value, 
          is_public: projectPublic
        });
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return <>
    <tr>
      <th scope="row">
        <Button color="secondary" rounded title="Manage" onClick={() => router.push (APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + project.id)}>
          <FontAwesomeIcon icon={faArrowAltCircleRight} />
        </Button>
      </th>
      <th scope="row">
        {
          expand ?
          <FontAwesomeIcon icon={faCaretDown} size="1x" style={{cursor: 'pointer'}} onClick={() => setExpand (false)} />
          :
          <FontAwesomeIcon icon={faCaretRight} size="1x" style={{cursor: 'pointer'}} onClick={() => setExpand (true)} />
        }
        
      </th>
      <td>
        {
          project.user_id !== userLogged?.id ? project.name : 
          <Input 
            ref={inputNameRef}
            type="text" 
            defaultValue={project.name} 
            style={{padding: 0, border: 'unset'}} 
          />
        }
      </td>
      <td>
        <i>{project.user.first_name} {project.user.last_name}</i>
      </td>
      <td>
        {
          project.members && project.members.length > 0 ?
          <ul className="list-inline">
            {
              project.members.map(member => (
                <li className="list-inline-item" title={member.email}>
                  <img className="img-circle table-avatar" width={30} height={30} src={member.avatar ?? '/img/icon/user-loading.png'} onError={(e) => e.currentTarget.src = '/img/icon/user-loading.png'} />
                </li>
              ))
            }
          </ul> : 
          <h6 className="text-muted">None</h6>
        }
      </td>
      <td>
        {
          projectPublic ? 
          <span 
            className="text-success" 
            style={{cursor: 'pointer'}} 
            onClick={project.user_id === userLogged?.id ? () => updateProject ({ is_public: false }, () => {setProjectPublic(false)}) : undefined}
          >
            <FontAwesomeIcon icon={faCheckCircle} /> Public
          </span> : 
          <span 
            className="text-primary" 
            style={{cursor: 'pointer'}} 
            onClick={project.user_id === userLogged?.id ? () => updateProject ({ is_public: true }, () => {setProjectPublic(true)}) : undefined}
          >
            <FontAwesomeIcon icon={faCircle} /> Private
          </span>
        }
      </td>
    </tr>
    <tr className="text-muted" style={!expand ? { display:'none' } : undefined}>
      <th scope="row"></th>
      <th scope="row"></th>
      <td>
        <Textarea 
          placeholder="Write description about project here ..." 
          className="text-muted area-description" rows={4}
          ref={textareaRef}
          defaultValue={project.description}
        ></Textarea>
      </td>
      <td>
        Task: {project.total_tasks}<br/>
        <Link href={APP_LINK.WORKSPACE + '/' + workspace?.id + '/project/' + project.id + '?create=1'}>
          Create task <FontAwesomeIcon icon={faPlus} />
        </Link><br/><br/>
      </td>
      <td>
        {
          (!projectPublic && project.user_id === userLogged?.id) &&
          <>
            Member: {project.members_total}<br/>
            <Link href={''} onClick={() => setModalAddmember (true)}>Add member <FontAwesomeIcon icon={faPlus} /></Link>
          </>
        }
      </td>
      <td>
        {project.user_id === userLogged?.id && <Button color="danger" className="float-left" onClick={() => setModalDelete (true)}>
          <FontAwesomeIcon icon={faTrash} />
        </Button>}
      </td>
    </tr>
    {project.user_id === userLogged?.id && <RemoveProjectModal 
      openModal={modalDelete} 
      setOpenModal={setModalDelete} 
      projectId={project.id} 
      loadProjects={loadProjects}
    />}
    {project.user_id === userLogged?.id && <AddMemberModal 
      openModal={modalAddMember} 
      setOpenModal={setModalAddmember} 
      projectId={project.id}
    />}
  </>
}
export default ProjectTableItem;