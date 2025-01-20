import { ProjectType } from "@/types/project.type";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface DocumentProjectSharedProps {
  setProjectShared: (projectShared: ProjectType[]) => void
  projectShared: ProjectType[]
}

const DocumentProjectShared: React.FC<DocumentProjectSharedProps> = ({ setProjectShared, projectShared }) => {
  const handleRemoveProject = (project: ProjectType) => {
    setProjectShared(
      projectShared.filter(p => p.id !== project.id)
    );
  }
  return (
    <div className="col-12 mt-2">
      {
        projectShared.map(project => (
          <span className="badge badge-light mr-2" key={project.id}>
            <FontAwesomeIcon icon={faMinusCircle} className="text-danger ml-2 pointer" onClick={() => handleRemoveProject (project)} /> {project.name}
          </span>
        ))
      }
    </div>
  )
}
export default DocumentProjectShared;