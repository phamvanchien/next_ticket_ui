import { updateStatus } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { BaseResponseType } from "@/types/base.type";
import { ProjectTagType, RequestCreateTagType, RequestUpdateTagType } from "@/types/project.type";
import { colorRange, notify } from "@/utils/helper.util";
import { faArrows, faCheckCircle, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface StatusSettingItemProps {
  position: number
  projectId: number
  status: ProjectTagType
  setDraggedIndex: (draggedIndex: number | null) => void
  setStatusDragged: (statusDragged?: ProjectTagType) => void
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void
  setDeleteId: (deleteId: number | undefined) => void
}

const StatusSettingItem: React.FC<StatusSettingItemProps> = ({
  position,
  projectId,
  status,
  setDraggedIndex, 
  setStatusDragged, 
  handleDragOver,
  setDeleteId
}) => {
  const [edit, setEdit] = useState(false);
  const [statusName, setStatusName] = useState(status.name);
  const [statusColor, setStatusColor] = useState<string>(status.color);
  const [colorSelect, setColorSelect] = useState(statusColor);
  const colors = colorRange().filter(c => c.level === 200);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const divStatusRef = useRef<HTMLDivElement>(null);
  const statusNameRef = useRef<HTMLInputElement>(null);
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    const status: ProjectTagType = JSON.parse(e.currentTarget.dataset.value as string);
    setStatusDragged(status);
    setDraggedIndex(index);
  };
  const handleDrop = () => {
    setDraggedIndex(null);
    setStatusDragged(undefined);
  };
  const updateStatusItem = async (payload: RequestUpdateTagType, callback?: () => void) => {
    try {
      if (!workspace) {
        return;
      }
      const response = await updateStatus(
        workspace.id,
        projectId,
        status.id,
        payload
      );
      if (response && response.code === API_CODE.OK) {
        if (callback) {
          callback();
        }
        return;
      }
      setEdit(false);
      setColorSelect(statusColor);
    } catch (error) {
      setEdit(false);
      setColorSelect(statusColor);
    }
  }

  useEffect(() => {
    setStatusName(status.name);
    setStatusColor(status.color);
    setColorSelect(status.color);
  }, [status.name]);

  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (divStatusRef.current && !divStatusRef.current.contains(event.target as Node)) {
        if ((statusNameRef.current?.value && statusNameRef.current.value !== statusName) || colorSelect !== statusColor) {
          updateStatusItem({
            name: statusNameRef.current?.value ?? undefined,
            color: colorSelect
          }, () => {
            notify('Status is updated', 'success');
            setStatusName(statusNameRef.current?.value ?? '');
            setEdit(false);
            setStatusColor(colorSelect);
          });
          return;
        }
        setEdit(false);
        setColorSelect(statusColor);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorSelect]);
  
  return <>
    <div className="mt-2"
      ref={divStatusRef}
      draggable
      onDragStart={(e) => handleDragStart(e, position)}
      onDragOver={(e) => handleDragOver(e, position)}
      onDrop={handleDrop}
      data-value={JSON.stringify(status)}
      style={{
        padding: edit ? 2 : 8,
        borderRadius: "5px",
        backgroundColor: colorSelect,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)",
        cursor: "grab",
      }}
    >
      {!edit && <FontAwesomeIcon icon={faArrows} className="w-10 float-left m-t-5" /> }
      {edit && <Input type="text" defaultValue={statusName} className="input-blur pl-2" ref={statusNameRef} />}
      {
        !edit &&
        <span className="w-80">
          {statusName} 
          <FontAwesomeIcon icon={faTrash} className="float-right text-danger w-10 m-t-5" style={{ cursor: 'pointer' }} onClick={() => setDeleteId (status.id)} />
          <FontAwesomeIcon icon={faPencil} className="float-right m-t-5" style={{ cursor: 'pointer' }} onClick={() => setEdit (true)} />
        </span>
      }
      {
        edit && colors.map(color => (
          <span 
            key={color.code} 
            className="badge badge-primary mr-2 mt-2"
            style={{ background: color.code, cursor: 'pointer' }} 
            onClick={() => setColorSelect (color.code)}
          >
            {color.color} {colorSelect === color.code && <FontAwesomeIcon icon={faCheckCircle} />}
          </span>
        ))
      }
    </div>
  </>
}
export default StatusSettingItem;