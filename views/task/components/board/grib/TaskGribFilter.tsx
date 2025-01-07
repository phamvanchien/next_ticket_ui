import Dropdown from "@/common/dropdown/Dropdown";
import DropdownItem from "@/common/dropdown/DropdownItem";
import { priorityRange } from "@/utils/helper.util";
import { getIconPriority } from "./TaskItem";
import React, { Dispatch, SetStateAction } from "react";

interface TaskGribFilterProps {
  priorityFilter?: number
  setPriorityFilter: Dispatch<SetStateAction<number | undefined>>
}

const TaskGribFilter: React.FC<TaskGribFilterProps> = ({ priorityFilter, setPriorityFilter }) => {
  const priorities = priorityRange();
  const handleSelectPriority = (priorityId: number) => {
    setPriorityFilter(priorityId);
    // const selected = priorityFilter.find(p => p === priorityId);
    // if (!selected) {
    //   setPriorityFilter([...priorityFilter, priorityId]);
    // }
  }
  return (
    <div className="col-12">
      <Dropdown title="Priority">
        {
          priorities.map(priority => (
            <DropdownItem key={priority.id} style={{cursor: 'pointer'}} onClick={() => handleSelectPriority (priority.id)}>
              {getIconPriority(priority.id)} {priority.title}
            </DropdownItem>
          ))
        }
      </Dropdown>
    </div>
  )
}
export default TaskGribFilter;