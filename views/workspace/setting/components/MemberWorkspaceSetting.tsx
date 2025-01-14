import { members, removeMember } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import { ResponseMemberWorkspaceDataType, WorkspaceType } from "@/types/workspace.type";
import { faAngleDoubleDown, faInfoCircle, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import MemberSettingItem from "./MemberSettingItem";
import { ResponseUserDataType } from "@/types/user.type";
import Input from "@/common/components/Input";
import Loading from "@/common/components/Loading";
import Modal from "@/common/modal/Modal";
import ModalBody from "@/common/modal/ModalBody";
import Button from "@/common/components/Button";
import { notify } from "@/utils/helper.util";
import { BaseResponseType } from "@/types/base.type";
import InviteMemberView from "@/views/invite-member/InviteMemberView";

interface MemberWorkspaceSettingProps {
  workspace: WorkspaceType
}

const MemberWorkspaceSetting: React.FC<MemberWorkspaceSettingProps> = ({ workspace }) => {
  const defaultPageSize = 10;
  const [keyword, setKeyword] = useState<string>("");
  const [debounceKeyword, setDebounceKeyword] = useState<string>("");
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [loadingViewMore, setLoadingViewMore] = useState(false);
  const [workspaceData, setWorkspaceData] = useState<ResponseMemberWorkspaceDataType>();
  const [memberDelete, setMemberDelete] = useState<ResponseUserDataType>();
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [openInvite, setOpenInvite] = useState(false);
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

  const handleDeleteMember = async () => {
    try {
      if (!memberDelete) {
        return;
      }
      setLoadingDelete(true);
      const response = await removeMember (workspace.id, memberDelete.id);
      setLoadingDelete(false);
      if (response && response.code === API_CODE.OK) {
        setMemberDelete(undefined);
        loadMembers();
        return;
      }
      notify(response.error?.message ?? '', 'error');
    } catch (error) {
      notify((error as BaseResponseType).message ?? '', 'error');
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

  const loadMembers = async () => {
    try {
      if (!workspace) {
        return;
      }
      const response = await members(workspace.id, 1, pageSize, keyword);
      setLoadingViewMore(false);
      if (response && response.code === API_CODE.OK) {
        setWorkspaceData(response.data);
        return;
      }
      setWorkspaceData(undefined);
    } catch (error) {
      setLoadingViewMore(false);
      setWorkspaceData(undefined);
    }
  };
  useEffect(() => {
    loadMembers();
  }, [workspace, pageSize, debounceKeyword]);

  return <>
    <div className="row">
      <div className="col-12 col-lg-4 col-sm-6 mt-4">
        <h5 className="text-muted">Members</h5>
        <i className="text-muted">
          <FontAwesomeIcon icon={faInfoCircle} /> You can add or remove members of the workspace here.
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
          Add new <FontAwesomeIcon icon={faPlus} />
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
        {workspaceData && workspaceData.items.map((item, index) => (
          <MemberSettingItem member={item} key={index} setMemberDelete={setMemberDelete} />
        ))}
      </div>
    </div>
    {
      (workspaceData && workspaceData.total > pageSize) &&
      <div className="row mt-2">
        <div className="col-12 col-lg-4 col-sm-6">
          <span className="link mt-4 mb-2 text-secondary" style={{cursor: 'pointer'}} onClick={!loadingViewMore ? handleViewMore : undefined}>
            View more {loadingViewMore ? <Loading color="secondary" /> : <FontAwesomeIcon icon={faAngleDoubleDown} />}
          </span>
        </div>
      </div>
    }
    <Modal className="clone-modal" isOpen={memberDelete ? true : false}>
      <ModalBody>
        <div className="row">
          <div className="col-12 mb-2">
            <h6 className="text-muted">
              You will remove {memberDelete?.first_name} {memberDelete?.last_name} from this workspace.
            </h6>
          </div>
          <div className="col-6">
            <Button color="danger" fullWidth onClick={handleDeleteMember} disabled={loadingDelete}>
              OK {loadingDelete && <Loading color="light" />}
            </Button>
          </div>
          <div className="col-6">
            <Button color="danger" fullWidth outline disabled={loadingDelete} onClick={() => setMemberDelete (undefined)}>
              Cancel
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
    <InviteMemberView openModal={openInvite} setOpenModal={setOpenInvite} />
  </>
}
export default MemberWorkspaceSetting;