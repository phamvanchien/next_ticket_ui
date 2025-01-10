"use client"
import { RootState } from "@/reduxs/store.redux";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useEffect, useState } from "react";
import { TaskType } from "@/types/task.type";
import { APP_LOCALSTORAGE } from "@/enums/app.enum";
import TaskItemRecently from "./components/TaskItemRecently";

const WorkspaceIndexView = () => {
  const [taskRecently, setTaskRecently] = useState<TaskType[]>();
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
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
  useEffect(() => {
    const tasksStorage = localStorage.getItem(APP_LOCALSTORAGE.TASK_RECENTLY);
    if (tasksStorage) {
      setTaskRecently(JSON.parse(tasksStorage));
    }
  }, []);
  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h3>Hi! {userLogged?.first_name} {userLogged?.last_name}</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <div className="card">
            <div className="card-body">
              <center>
                <img src="/img/banners/project.png" className="img-banner-wp" />
              </center>
            </div>
            <div className="card-footer text-center text-primary">
              <h6>Project manage</h6>
            </div>
          </div>
        </div>
        <div className="col-3">
          <div className="card">
            <div className="card-body">
              <center>
                <img src="/img/banners/setting.png" className="img-banner-wp" />
              </center>
            </div>
            <div className="card-footer text-center text-primary">
              <h6>Workspace setting</h6>
            </div>
          </div>
        </div>
      </div>
      {/* {
        (taskRecently && taskRecently.length > 3) && 
        <>
          <div className="row">
            <div className="col-12">
              <h4><FontAwesomeIcon icon={faCheckSquare} className="text-success" /> Task recently</h4>
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
      } */}
    </div>
  )
}
export default WorkspaceIndexView;