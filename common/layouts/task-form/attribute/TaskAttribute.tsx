import { ProjectAttributeType } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import TaskAttributeCreate from "./TaskAttributeCreate";
import TaskAttributeItem from "./TaskAttributeItem";
import { TaskAttributeType } from "@/types/task.type";

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
  const [attributeCreated, setAttributeCreated] = useState<ProjectAttributeType>();
  const [attributesList, setAttributesList] = useState<ProjectAttributeType[]>(attributes);
  useEffect(() => {
    if (attributeCreated) {
      setAttributesList([...attributesList, attributeCreated]);
    }
  }, [attributeCreated]);
  return <>
    {
      attributesList.map((attribute, index) => (
        <TaskAttributeItem 
          attribute={attribute} 
          projectId={projectId}
          workspaceId={workspaceId}
          key={index} 
          className="mt-2" 
          taskId={taskId}
          attributesSelected={attributesSelected}
          setAttributesSelected={setAttributesSelected}
        />
      ))
    }
    <div className={className}>
      <TaskAttributeCreate 
        workspaceId={workspaceId} 
        projectId={projectId} 
        setAttributeCreated={setAttributeCreated}
      />
    </div>
  </>
};

export default TaskAttribute;