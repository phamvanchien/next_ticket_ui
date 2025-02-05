import { ProjectType } from "@/types/project.type";
import { faAngleDoubleDown, faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import { membersList, removeMember } from "@/api/project.api";
import { API_CODE } from "@/enums/api.enum";
import MemberSettingItem from "./MemberSettingItem";
import Input from "@/common/components/Input";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import { ResponseUserDataType } from "@/types/user.type";
import { notify } from "@/utils/helper.util";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import AddMemberModal from "../../components/AddMemberModal";
import { useTranslations } from "next-intl";

interface ProjectMemberSettingProps {
  project: ProjectType
}

const ProjectMemberSetting: React.FC<ProjectMemberSettingProps> = ({ project }) => {
  const defaultPageSize = 10;
  const [openInvite, setOpenInvite] = useState(false);
  const [membersData, setMembersData] = useState<ResponseWithPaginationType<ResponseUserDataType[]>>();
  const [keyword, setKeyword] = useState<string>('');
  const [debounceKeyword, setDebounceKeyword] = useState<string>('');
  const [memberDelete, setMemberDelete] = useState<ResponseUserDataType>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const t = useTranslations();
  const handleChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setKeyword('');
    if (event.target.value && event.target.value !== '') {
      setKeyword(event.target.value);
    }
  }
  const loadMembers = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await membersList(workspace.id, project.id, 1, 10, keyword);
      if (response && response.code === API_CODE.OK) {
        setMembersData(response.data);
        return;
      }
      setMembersData(undefined);
    } catch (error) {
      setMembersData(undefined);
    }
  }
  const handleViewMore = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }
  const handleDeleteMember = async () => {
    try {
      if (!workspace || !memberDelete) {
        return;
      }
      setLoadingDelete(true);
      const response = await removeMember(workspace.id, project.id, memberDelete.id);
      if (response && response.code === API_CODE.OK) {
        setMemberDelete(undefined);
        loadMembers();
        setLoadingDelete(false);
        return;
      }
      notify(response.error?.message ?? '', 'error');
    } catch (error) {
      notify((error as BaseResponseType).error?.message ?? '', 'error');
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
  }, [debounceKeyword, pageSize]);
  return <>
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <h5 className="text-muted">{t('projects.member_label')}</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> {t('project_setting.setting_member_title')}
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
          onClick={() => setOpenInvite (true)}
        >
          {t('add_member_project.page_title')} <FontAwesomeIcon icon={faPlus} />
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6">
        <Input type="search" placeholder={t('create_project.placeholder_input_search_member')} style={{
            padding: "8px",
            borderRadius: "5px"
          }}
          onChange={handleChangeKeyword} 
        />
      </div>
    </div>
    <div className="row mt-2 mb-2">
      <div className="col-12 col-lg-4 col-sm-6">
        {
          membersData && membersData.items.map(member => (
            <MemberSettingItem key={member.id} member={member} setMemberDelete={setMemberDelete} />
          ))
        }
      </div>
    </div>
    {
      (membersData && membersData.total > pageSize) &&
      <div className="row mt-2">
        <div className="col-12 col-lg-4 col-sm-6">
          <span className="link mt-4 mb-2 text-secondary" style={{cursor: 'pointer'}} onClick={!loadingViewMore ? handleViewMore : undefined}>
            {t('btn_view_more')} {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
          </span>
        </div>
      </div>
    }
    <AddMemberModal
      openModal={openInvite} 
      setOpenModal={setOpenInvite}
      projectId={project.id}
    />
    <Modal className="clone-modal" isOpen={memberDelete ? true : false}>
      <ModalBody>
        <div className="row">
          <div className="col-12 mb-2 mt-2">
            <h6 className="text-muted">
             {t('project_setting.message_delete_member_start')} {memberDelete?.first_name} {memberDelete?.last_name} {t('project_setting.message_delete_member_end')}
            </h6>
          </div>
          <div className="col-12 mb-2">
            <Button color="primary" className="float-right" onClick={handleDeleteMember} disabled={loadingDelete}>
              {t('btn_delete')} {loadingDelete && <Loading color="light" />}
            </Button>
            <Button color="secondary" className="btn-no-border float-right mr-2" outline disabled={loadingDelete} onClick={() => setMemberDelete (undefined)}>
              {t('btn_cancel')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  </>
}
export default ProjectMemberSetting;