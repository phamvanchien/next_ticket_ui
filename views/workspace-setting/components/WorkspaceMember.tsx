import { members, removeMember } from "@/api/workspace.api";
import UserAvatar from "@/common/components/AvatarName";
import Button from "@/common/components/Button";
import Loading from "@/common/components/Loading";
import Modal from "@/common/components/Modal";
import SkeletonLoading from "@/common/components/SkeletonLoading";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { UserType } from "@/types/user.type";
import { WorkspaceType } from "@/types/workspace.type";
import { displayMessage } from "@/utils/helper.util";
import { faMinus, faSearch, faUserGroup, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslations } from "next-intl";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import WorkspaceMemberLoading from "./WorkspaceMemberLoading";

interface WorkspaceMemberProps {
  workspace: WorkspaceType
  setOpenAddMember: (openAddMember: number) => void
}

const WorkspaceMember: React.FC<WorkspaceMemberProps> = ({ workspace, setOpenAddMember }) => {
  const t = useTranslations();
  const defaultPageSize = 5;
  const [memberData, setMemberData] = useState<ResponseWithPaginationType<UserType[]>>();
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const [openDeleteMember, setOpenDeleteMember] = useState(false);
  const [deleteId, setDeleteId] = useState<number>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loading, setLoading] = useState(true);
  const loadWorkspaceMembers = async () => {
    try {
      const response = await members(workspace.id, 1, pageSize, debouncedValue);
      setLoadingViewMore(false);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setMemberData(response.data);
        return;
      }
    } catch (error) {
      setLoadingViewMore(false);
      setMemberData(undefined);
    }
  }
  const handleViewMore = () => {
    setLoadingViewMore(true);
    setPageSize(pageSize + defaultPageSize);
  }
  const handleDeleteMember = async () => {
    try {
      setLoadingDelete(true);
      if (!openDeleteMember || !deleteId) {
        return;
      }
      const response = await removeMember(workspace.id, deleteId);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        loadWorkspaceMembers();
        setOpenDeleteMember(false);
        setDeleteId(undefined);
      }
    } catch (error) {
      setLoadingDelete(false);
      return displayMessage('error', (error as BaseResponseType).error?.message);
    }
  }
  useEffect(() => {
    loadWorkspaceMembers();
  }, [workspace, pageSize, debouncedValue]);
  useEffect(() => {
    if (!openDeleteMember) {
      setDeleteId(undefined);
    }
  }, [openDeleteMember]);

  return (
    <div className="row mt-4">
      <div className="col-12 col-lg-6">
        <div className="bg-white rounded-4 shadow-sm border p-3">
          {/* <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <h6 className="mb-0 text-secondary">
              <FontAwesomeIcon icon={faUserGroup} className="me-2" />
              {t('workspaces_page.member.member_title')}
            </h6>
            {
              !loading &&
              <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
                <input
                  type="text"
                  className="form-control ps-5 rounded search-input"
                  placeholder={t('workspaces_page.member.placeholder_input_search') + '...'}
                  value={keyword}
                  onChange={handleChange}
                />
              </div>
            }
          </div> */}
          <div className="d-flex justify-content-between align-items-center mb-3 px-2">
            <div className="position-relative">
              <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
              <input
                type="text"
                className="form-control ps-5 rounded search-input float-right"
                placeholder={t('workspaces_page.member.placeholder_input_search') + '...'}
                value={keyword}
                onChange={handleChange}
              />
            </div>
            <Button color="primary" className="float-right" onClick={() => setOpenAddMember (workspace.id)}>
              <FontAwesomeIcon icon={faUserPlus} />
            </Button>
          </div>
          {
            loading && <WorkspaceMemberLoading />
          }
          <div className="table-responsive mb-2">
            <table className="table align-middle mb-0">
              <tbody>
                {memberData && memberData.items.map((member, index) => (
                  <tr key={index} className="border-bottom">
                    <td>
                      <Link href={'/profile/' + member.id}><UserAvatar name={member.first_name} avatar={member.avatar} /></Link>
                    </td>
                    <td className="fw-semibold text-dark">{member.first_name} {member.last_name}</td>
                    <td className="text-muted">{member.email}</td>
                    <td className="text-end">
                      <Button size="sm" color="danger" className="px-3 rounded" onClick={() => {setOpenDeleteMember(true), setDeleteId(member.id)}}>
                        <FontAwesomeIcon icon={faMinus} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {
            (memberData && pageSize < memberData.total) &&
            <a className="text-secondary pointer mt-2" onClick={loadingViewMore ? undefined : handleViewMore}>
              {t('common.btn_view_more')} {loadingViewMore && <Loading color="secondary" />}
            </a>
          }
        </div>
      </div>
      <Modal 
        open={openDeleteMember} 
        closable={false}
        title={t('workspaces_page.member.delete_member_warning_message')}
        footerBtn={[
          <Button color='default' key={1} onClick={() => setOpenDeleteMember (false)} className='mr-2' disabled={loadingDelete}>
            {t('common.btn_cancel')}
          </Button>,
          <Button key={2} color={loadingDelete ? 'secondary' : 'primary'} type="submit" disabled={loadingDelete} onClick={handleDeleteMember}>
            {loadingDelete ? <Loading color="light" /> : t('common.btn_delete')}
          </Button>
        ]
        }
        setOpen={setOpenDeleteMember} 
      >
        <div className="row">
          
        </div>
      </Modal>
    </div>
  )
}
export default WorkspaceMember;