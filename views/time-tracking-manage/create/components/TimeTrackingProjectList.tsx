import { projects } from "@/api/project.api";
import { checkMember } from "@/api/time-tracking.api";
import UserAvatar from "@/common/components/AvatarName";
import LoadingGif from "@/common/components/LoadingGif";
import { API_CODE } from "@/enums/api.enum";
import useDelaySearch from "@/hooks/useDelaySearch";
import { ResponseWithPaginationType } from "@/types/base.type";
import { MemberShareType } from "@/types/document.type";
import { ProjectType } from "@/types/project.type";
import { UserType } from "@/types/user.type";
import { faBullseye, faCheckCircle, faMinus, faSearch, faSquareCheck, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Switch } from "antd";
import { useTranslations } from "next-intl";
import React, { SetStateAction, useEffect, useState } from "react";

interface TimeTrackingProjectListProps {
  workspaceId: number
  projectShare: ProjectType[]
  projectMemberSelected: MemberShareType[]
  allowSearch?: boolean
  setProjectShare: (projectShare: ProjectType[]) => void
  setProjectMemberSelected: React.Dispatch<SetStateAction<MemberShareType[]>>
}

const TimeTrackingProjectList: React.FC<TimeTrackingProjectListProps> = ({ workspaceId, projectShare, projectMemberSelected, allowSearch = true, setProjectShare, setProjectMemberSelected }) => {
  const [projectsData, setProjectsData] = useState<ResponseWithPaginationType<ProjectType[]>>();
  const [projectsSelected, setProjectsSelected] = useState<ProjectType[]>(projectShare);
  const [memberNotSelected, setMemberNotSelected] = useState<UserType[]>([]);
  const [loadingCheckMember, setLoadingCheckMember] = useState(false);
  const { value: keyword, debouncedValue, handleChange } = useDelaySearch("", 500);
  const t = useTranslations();
  const handleSelectProject = (project: ProjectType) => {
    setProjectsSelected([project]);
    setProjectsData(undefined);
    checkMemberInTrackingTime(project);
  };
  const checkMemberInTrackingTime = async (project: ProjectType) => {
    try {
      setLoadingCheckMember(true);
      const response = await checkMember(workspaceId, {
        members: project.members.map(_v => _v.id)
      });
      setLoadingCheckMember(false);
      if (response && response.code === API_CODE.OK) {
        setMemberNotSelected(response.data);
        setProjectMemberSelected(
          project.members
            .filter(_v => !response.data.map(item => item.id).includes(_v.id))
            .map(_v => ({
              member_id: _v.id,
              permission: null,
              user: _v,
            }))
        );
      }
    } catch (error) {
      setLoadingCheckMember(false);
    }
  }
  const loadProjects = async () => {
    try {
      if (!debouncedValue) {
        setProjectsData(undefined);
        return;
      };
      const response = await projects(workspaceId, {
        page: 1,
        size: 5,
        keyword: debouncedValue
      });
      if (response?.code === API_CODE.OK) {
        setProjectsData(response.data);
      } else {
        setProjectsData(undefined);
      }
    } catch (error) {
      setProjectsData(undefined);
    }
  };
  const handleTogglePermission = (memberId: number) => {
    setProjectMemberSelected(prev =>
      prev.map(m =>
        m.user.id === memberId
          ? { ...m, permission: m.permission === 1 ? 0 : 1 }
          : m
      )
    );
  };
  useEffect(() => {
    loadProjects();
  }, [debouncedValue]);
  useEffect(() => {
    setProjectShare(projectsSelected);
  }, [projectsSelected]);
  return (
    <>
      <div className="col-12 col-lg-6">
        <div className="mt-2">
          {
            allowSearch &&
            <div className="d-flex justify-content-between align-items-center mb-3 px-2">
              <div className="position-relative w-100">
                <FontAwesomeIcon icon={faSearch} className="position-absolute ms-3 wp-search-icon" />
                <input
                  type="text"
                  className="form-control ps-5 rounded search-input float-right"
                  value={keyword}
                  onChange={handleChange}
                  placeholder={t("projects_page.placeholder_input_search")}
                />
              </div>
            </div>
          }
          {
            debouncedValue && projectsData && projectsData?.items.filter((project) => !projectsSelected.some((u) => u.id === project.id)).length > 0 &&
            <div className="table-responsive mb-2">
              <table className="table align-middle mb-0">
                <tbody>
                  {projectsData?.items.filter((project) => !projectsSelected.some((u) => u.id === project.id)).map((project, index) => (
                    <tr key={index} className="border-bottom pointer" onClick={() => handleSelectProject(project)}>
                      <td>
                        <FontAwesomeIcon icon={faBullseye} /> {project.name}
                      </td>
                      {/* <td className="fw-semibold text-dark">{user.first_name} {user.last_name}</td>
                      <td className="text-muted">{user.email}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          }
        </div>
        {
          projectsSelected.length > 0 &&
          <div className="table-responsive mb-2 mt-2">
            <table className="table align-middle mb-0">
              <tbody>
                {
                  projectsSelected.map((item, index) => (
                    <tr key={index} className="border-bottom">
                      <td className="text-muted">
                        <p className="m-unset"><FontAwesomeIcon icon={faSquareCheck} className="text-success" style={{ fontSize: 18 }} /> {item.name}</p>
                      </td>
                      <td className="text-end">
                        <UserAvatar name={item.user.last_name} avatar={item.user.avatar} />
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        }
        {
          loadingCheckMember ? 
          <center>
            <LoadingGif width={70} height={60} />
          </center> : <>
            {
              projectMemberSelected.length > 0 &&
              <div className="table-responsive mb-2 mt-2">
                <table className="table align-middle mb-0">
                  <tbody>
                    {
                      projectMemberSelected.map((user, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="text-muted">
                            <p className="m-unset">{user.user.email}</p>
                            <Switch
                              style={{ marginRight: 7 }}
                              checked={user.permission === 1}
                              onChange={() => handleTogglePermission(user.user.id)}
                            />
                            {t('time_tracking.permission_label')}
                          </td>
                          <td className="text-end">
                            <UserAvatar name={user.user.last_name} avatar={user.user.avatar} />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            }
            {
              memberNotSelected.length > 0 &&
              <div className="table-responsive mb-2 mt-2">
                <table className="table align-middle mb-0">
                  <tbody>
                    {
                      memberNotSelected.map((user, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="text-muted">
                            <p className="m-unset">{user.email}</p>
                            <Switch
                              style={{ marginRight: 7 }}
                            />
                            {t('time_tracking.permission_label')}
                          </td>
                          <td className="text-end">
                            <UserAvatar name={user.last_name} avatar={user.avatar} />
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            }
          </>
        }
      </div>
    </>
  );
}
export default TimeTrackingProjectList;