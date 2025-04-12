"use client";
import Button from "@/common/components/Button";
import { faEnvelope, faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { inviteList, workspaces } from "../../api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import { BaseResponseType, ResponseWithPaginationType } from "@/types/base.type";
import { InviteType, WorkspaceType } from "@/types/workspace.type";
import { displaySmallMessage } from "@/utils/helper.util";
import { useTranslations } from "next-intl";
import WorkspaceItem from "./components/WorkspaceItem";
import useDelaySearch from "@/hooks/useDelaySearch";
import LoadingGif from "@/common/components/LoadingGif";
import NoData from "@/common/components/NoData";
import WorkspaceCreate from "./components/WorkspaceCreate";
import WorkspaceAddMember from "./components/WorkspaceAddMember";
import WorkspaceInvite from "./components/invite/WorkspaceInvite";
import { usePathname, useSearchParams } from "next/navigation";

const WorkspaceView = () => {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const openInviteParam = searchParams.get("openInvite");
  const [workspacesData, setWorkspacesData] = useState<WorkspaceType[]>();
  const [workspaceTotal, setWorkspaceTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);
  const [openAddMember, setOpenAddMember] = useState<number>();
  const [openInvite, setOpenInvite] = useState(false);
  const [invitesData, setInvitesData] = useState<ResponseWithPaginationType<InviteType[]>>();
  const [inviteDecline, setInviteDecline] = useState(0);
  const [workspaceJoined, setWorkspaceJoined] = useState<WorkspaceType>();
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);

  const loadWorkspaces = async () => {
    try {
      const response = await workspaces(1, 10, debouncedValue);
      setLoading(false);
      if (response && response.code === API_CODE.OK) {
        setWorkspacesData(response.data.items);
        setWorkspaceTotal(response.data.total);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      setLoading(false);
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }

  const loadInvites = async () => {
    try {
      const response = await inviteList(1, 10);
      if (response && response.code === API_CODE.OK) {
        setInvitesData(response.data);
        return;
      }
      displaySmallMessage('error', response.error?.message);
    } catch (error) {
      displaySmallMessage('error', (error as BaseResponseType).error?.message);
    }
  }

  useEffect(() => {
    loadWorkspaces();
  }, [debouncedValue]);

  useEffect(() => {
    loadInvites();
  }, [inviteDecline, workspaceJoined]);

  useEffect(() => {
    if (workspaceJoined) {
      setOpenInvite(false);
      setWorkspaceTotal(workspaceTotal + 1);
      setWorkspacesData((prevWorkspaces) => {
        const filteredWorkspaces = prevWorkspaces?.filter(ws => ws.id !== workspaceJoined.id) || [];
        return [workspaceJoined, ...filteredWorkspaces];
      });
    }
  }, [workspaceJoined]);

  useEffect(() => {
    if (openInviteParam && Number(openInviteParam) === 1 && invitesData) {
      setOpenInvite(true);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("openInvite");
      const newUrl = `${pathname}${params.toString() ? "?" + params.toString() : ""}`;
      window.history.replaceState(null, "", newUrl);
    }
  }, [openInviteParam, invitesData]);

  if (loading) {
    return (
      <div className="container-fluid mt-4 wp-container">
        <div className="justify-content-between align-items-center mb-4 mt-4">
          <center>
            <LoadingGif />
          </center>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-4 wp-container">
      {
        (workspacesData && workspaceTotal === 0) ? (
          <NoData message={t("workspaces.no_data")} description={t("workspaces.no_data_description")}>
            <Button color="primary" className="mt-3 rounded" onClick={() => setOpenCreate (true)} style={{ marginRight: 10 }}>
              <FontAwesomeIcon icon={faPlus} /> {t("btn_new")}
            </Button>
            <Button color="light" className="mt-3 rounded" onClick={() => setOpenInvite (true)}>
              <FontAwesomeIcon icon={faEnvelope} className="mr-2" style={{marginRight: 5}} /> {t('top_menu.invitation')}
            </Button>
          </NoData>
        ) : <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-semibold">{t('workspaces.page_title')}</h3>
            <div className="d-flex gap-3">
              <div className="position-relative">
                <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
                <input
                  type="text"
                  className="form-control ps-5 rounded search-input"
                  placeholder={t('workspaces.placeholder_input_search') + '...'}
                  value={keyword}
                  onChange={handleChange}
                />
              </div>
              
              <Button color="primary" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => setOpenCreate (true)}>
                <FontAwesomeIcon icon={faPlus} style={{marginRight: 5}} /> {t('btn_new')}
              </Button>

              <Button color="default" className="d-flex align-items-center rounded d-none d-md-flex" onClick={() => setOpenInvite (true)}>
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" style={{marginRight: 5}} /> {t('top_menu.invitation')}
              </Button>
            </div>
          </div>

          <div className="d-flex flex-column gap-3">
            {workspacesData && workspacesData.map((workspace, index) => (
              <WorkspaceItem 
                key={index} 
                workspace={workspace} 
                workspaceJoined={workspaceJoined}
                setOpenAddMember={setOpenAddMember} 
              />
            ))}
          </div>
          <WorkspaceAddMember 
            workspaceId={openAddMember} 
            setOpenModal={setOpenAddMember} 
          />
        </>
      }
      <div className="mb-5"></div>
      <Button color="primary" className="rounded-circle position-fixed d-md-none btn-add-wp-mobile" onClick={() => setOpenCreate (true)}>
        <FontAwesomeIcon icon={faPlus} size="lg" />
      </Button>

      <Button color="secondary" className="rounded-circle position-fixed d-md-none btn-add-member-mobile" onClick={() => setOpenInvite (true)}>
        <FontAwesomeIcon icon={faEnvelope} size="lg" />
      </Button>
      <WorkspaceCreate open={openCreate} setOpen={setOpenCreate} />
      <WorkspaceInvite 
        open={openInvite} 
        invitesData={invitesData}
        setOpen={setOpenInvite} 
        setInviteDecline={setInviteDecline}
        setWorkspaceJoined={setWorkspaceJoined}
      />
    </div>
  );
};

export default WorkspaceView;
