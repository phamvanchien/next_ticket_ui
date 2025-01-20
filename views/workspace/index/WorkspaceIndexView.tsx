"use client"
import { RootState } from "@/reduxs/store.redux";
import { faAngleRight, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import "react-multi-carousel/lib/styles.css";
import React, { useEffect, useState } from "react";
import { TaskType } from "@/types/task.type";
import { APP_LINK, APP_LOCALSTORAGE } from "@/enums/app.enum";
import { useRouter } from "next/navigation";
import { WorkspaceType } from "@/types/workspace.type";
import ImageIcon from "@/common/components/ImageIcon";
import TaskItemRecently from "./components/TaskItemRecently";
import Carousel from 'react-multi-carousel';
import { getTasksByIds } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";

interface WorkspaceIndexViewProps {
  workspace: WorkspaceType
}

const WorkspaceIndexView: React.FC<WorkspaceIndexViewProps> = ({ workspace }) => {
  const [taskRecently, setTaskRecently] = useState<TaskType[]>();
  const [timeText, setTimeText] = useState<string>('');
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const hour: number = new Date().getHours();
  const router = useRouter();
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };
  const loadTasksByIds = async (taskIds: string) => {
    try {
      const response = await getTasksByIds(workspace.id, taskIds);
      if (response && response.code === API_CODE.OK) {
        setTaskRecently(response.data.items);
        return;
      }
      setTaskRecently(undefined);
    } catch (error) {
      setTaskRecently(undefined);
    }
  }
  useEffect(() => {
    setTimeText('Hi')
    if (hour > 3 && hour < 13) {
      setTimeText('Good morning');
    }
    if (hour >= 13 || hour < 18) {
      setTimeText('Good afternoon');
    }
    if (hour >= 18 || hour <= 3) {
      setTimeText('Good evening');
    }
    const tasksStorage = localStorage.getItem(APP_LOCALSTORAGE.TASK_RECENTLY);
    if (tasksStorage) {
      const taskIds = JSON.parse(tasksStorage).map((t: any) => t.id);
      loadTasksByIds(taskIds.join(','));
    }
  }, []);
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h3>{timeText}! {userLogged?.last_name} 😎</h3>
        </div>
      </div>
      <hr/>
      <div className="row mt-4">
        <div className="col-12 col-lg-6 text-center">
          <ImageIcon icon="project" className="float-left img-wp-home" width={70} height={70} />
          <div className="card float-left card-wp-home">
            <div className="card-body p-10 card-body-wp-home">
              <h6>Manage your projects</h6>
              <p className="text-muted m-unset" style={{fontSize: 13}}>Create new or edit or create tickets, and manage project progress</p>
            </div>
            <div className="card-footer p-10 pointer text-primary" style={{fontSize: 15}} onClick={() => router.push(APP_LINK.WORKSPACE + '/' + workspace.id + '/project')}>
              <span className="float-left">Start now</span> <FontAwesomeIcon className="float-right mt-1" icon={faAngleRight} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 text-center">
          <ImageIcon icon="document" className="float-left img-wp-home" width={70} height={70} />
          <div className="card float-left card-wp-home">
            <div className="card-body p-10 card-body-wp-home">
              <h6>Manage your documents</h6>
              <p className="text-muted m-unset" style={{fontSize: 13}}>Create, store and manage your text documents here</p>
            </div>
            <div className="card-footer p-10 pointer text-primary" style={{fontSize: 15}} onClick={() => router.push(APP_LINK.WORKSPACE + '/' + workspace.id + '/document')}>
              <span className="float-left">Start now</span> <FontAwesomeIcon className="float-right mt-1" icon={faAngleRight} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 text-center">
          <ImageIcon icon="setting" className="float-left img-wp-home" width={70} height={70} />
          <div className="card float-left card-wp-home">
            <div className="card-body p-10 card-body-wp-home">
              <h6>Workspace settings</h6>
              <p className="text-muted m-unset" style={{fontSize: 13}}>Edit workspace information or add new members and other settings here</p>
            </div>
            <div className="card-footer p-10 pointer text-primary" style={{fontSize: 15}} onClick={() => router.push(APP_LINK.WORKSPACE + '/' + workspace.id + '/setting')}>
              <span className="float-left">Go now</span> <FontAwesomeIcon className="float-right mt-1" icon={faAngleRight} />
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6 text-center">
          <ImageIcon icon="invite" className="float-left img-wp-home" width={70} height={70} />
          <div className="card float-left card-wp-home">
            <div className="card-body p-10 card-body-wp-home">
              <h6>Invitation to join workspace</h6>
              <p className="text-muted m-unset" style={{fontSize: 13}}>You can view and accept invitations to join the new workspace here</p>
            </div>
            <div className="card-footer p-10 pointer text-primary" style={{fontSize: 15}} onClick={() => router.push(APP_LINK.WORKSPACE + '/' + workspace.id + '/setting')}>
              <span className="float-left">Go now</span> <FontAwesomeIcon className="float-right mt-1" icon={faAngleRight} />
            </div>
          </div>
        </div>
      </div>
      {
        (taskRecently) && 
        <>
          <hr/>
          <div className="row mt-4">
            <div className="col-12">
              <h4><FontAwesomeIcon icon={faCheckSquare} className="text-success" /> Tasks recently</h4>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-12">
              <Carousel responsive={responsive}>
              {
                taskRecently.map(task => (
                  <TaskItemRecently key={task.id} task={task} />
                ))
              }
              </Carousel>
            </div>
          </div>
        </>
      }
    </div>
  )
}
export default WorkspaceIndexView;