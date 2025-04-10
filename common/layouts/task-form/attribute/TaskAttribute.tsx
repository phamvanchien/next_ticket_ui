import { ProjectAttributeType } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import TaskAttributeCreate from "./TaskAttributeCreate";
import TaskAttributeItem from "./TaskAttributeItem";
import { TaskAttributeType } from "@/types/task.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";

interface TaskAttributeProps {
  className?: string;
  projectId: number
  workspaceId: number
  taskId: number
  attributes: ProjectAttributeType[]
  attributesSelected: TaskAttributeType[]
  setAttributesSelected: (attributesSelected: TaskAttributeType[]) => void
}

const TaskAttribute: React.FC<TaskAttributeProps> = ({ className, attributes, projectId, workspaceId, taskId, attributesSelected, setAttributesSelected }) => {
  const [attributesList, setAttributesList] = useState<ProjectAttributeType[]>(attributes);
  const isOwner = useSelector((state: RootState) => state.projectSlide).isOwner;
  useEffect(() => {
    setAttributesList(attributes);
  }, [attributes, taskId]);
  return <>
    {
      attributesList.map((attribute, index) => (
        <TaskAttributeItem 
          attribute={attribute} 
          projectId={projectId}
          workspaceId={workspaceId}
          key={index} 
          className="mt-3" 
          taskId={taskId}
          attributesSelected={attributesSelected}
          setAttributesSelected={setAttributesSelected}
        />
      ))
    }
    {
      isOwner &&
      <div className={className}>
        <TaskAttributeCreate 
          workspaceId={workspaceId} 
          projectId={projectId} 
        />
      </div>
    }
  </>
};

export default TaskAttribute;