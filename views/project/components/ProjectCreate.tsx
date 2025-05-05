import { create } from "@/api/project.api";
import Button from "@/common/components/Button";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import Textarea from "@/common/components/Textarea";
import { API_CODE } from "@/enums/api.enum";
import { isEmpty } from "@/services/validate.service";
import { BaseResponseType } from "@/types/base.type";
import { ProjectType } from "@/types/project.type";
import { UserType } from "@/types/user.type";
import { displayMessage } from "@/utils/helper.util";
import WorkspaceMember from "@/views/workspace/components/WorkspaceMember";
import { faCircle, faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import React, { ChangeEvent, useRef, useState } from "react";

interface ProjectCreateProps {
  workspaceId: number;
  open: boolean;
  workspaceMembers: UserType[]
  debouncedValue: string
  keyword: string
  setOpen: (open: boolean) => void;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  setProjectCreated: (projectCreated?: ProjectType) => void
}

const ProjectCreate: React.FC<ProjectCreateProps> = ({ workspaceId, workspaceMembers, debouncedValue, keyword, handleChange, setProjectCreated, open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const [isPublic, setIsPublic] = useState(true);
  const [userSelected, setUserSelected] = useState<UserType[]>([]);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslations();

  const handleCreateProject = async () => {
    try {
      if (isEmpty(name)) {
        setErrorMessage(t('projects_page.create.project_name_required'));
        return;
      }
      if (!name) {
        return;
      }

      setLoading(true);
      const response = await create(workspaceId, {
        name: name,
        description: descriptionRef.current?.value,
        is_public: isPublic,
        members: userSelected.length > 0 ? userSelected.map(u => u.id) : undefined
      });
      setLoading(false);
      if (response && response.code === API_CODE.CREATED) {
        setUserSelected([]);
        setIsPublic(true);
        setName('');
        if (descriptionRef.current) {
          descriptionRef.current.value = '';
        }
        setOpen(false);
        setProjectCreated(response.data);
        return;
      }
      displayMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  return (
    <Modal 
      open={open} 
      title={t('projects_page.create.create_title')}
      footerBtn={[
        <Button color='default' key={1} onClick={() => setOpen (false)} className='mr-2' disabled={loading}>
          {t('common.btn_cancel')}
        </Button>,
        <Button key={2} color={loading ? 'secondary' : 'primary'} type="submit" disabled={loading} onClick={handleCreateProject}>
          {loading ? <Loading color="light" /> : t('common.btn_save')}
        </Button>
      ]
      }
      setOpen={setOpen} 
    >
      <div className='row'>
        <div className="col-12 mt-2">
          <Input 
            type="text"
            minLength={3}
            maxLength={100}
            placeholder={t('projects_page.placeholder_input_status_name')} 
            onChange={(e) => setName (e.target.value)}
            errorMessage={errorMessage}
            value={name}
            validates={[
              {
                type: 'is_required',
                message: t('projects_page.create.project_name_required')
              }
            ]}
          />
        </div>
        {/* <div className="col-12 mt-2">
          <Textarea ref={descriptionRef} maxLength={300} rows={5} style={{height: 100}} placeholder={t('projects_page.create.placeholder_project_description')} />
        </div> */}
        <div className="col-12 mt-2">
          <p className="pointer m-unset mb-2" onClick={() => setIsPublic (true)}>
            <FontAwesomeIcon icon={isPublic ? faCircleCheck : faCircle} className={`text-${isPublic ? 'success' : 'secondary'}`} /> {t('common.public_check')}
          </p>
          <p className="pointer" onClick={() => setIsPublic (false)}>
            <FontAwesomeIcon icon={!isPublic ? faCircleCheck : faCircle} className={`text-${!isPublic ? 'success' : 'secondary'}`} /> {t('common.private_check')}
          </p>
        </div>
      </div>
      {
        !isPublic &&
        <WorkspaceMember
          workspaceMembers={workspaceMembers}
          userSelected={userSelected}
          debouncedValue={debouncedValue}
          keyword={keyword}
          handleChange={handleChange}
          setUserSelected={setUserSelected}
        />
      }
    </Modal>
  )
}
export default ProjectCreate;