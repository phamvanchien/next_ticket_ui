import { updateTag } from "@/api/project.api";
import Input from "@/common/components/Input";
import { API_CODE } from "@/enums/api.enum";
import { RootState } from "@/reduxs/store.redux";
import { RequestUpdateTagType, ResponseTagType } from "@/types/project.type";
import { colorRange, notify } from "@/utils/helper.util";
import { faCheckCircle, faPencil, faTag, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

interface TagSettingItemProps {
  position: number
  projectId: number
  tag: ResponseTagType
  setTagDeleteId: (tagId?: number) => void
}

const TagSettingItem: React.FC<TagSettingItemProps> = ({ position, projectId, tag, setTagDeleteId }) => {
  const [tagName, setTagName] = useState(tag.name);
  const [edit, setEdit] = useState(false);
  const [tagColor, setTagColor] = useState<string>(tag.color);
  const [colorSelect, setColorSelect] = useState(tagColor);
  const colors = colorRange().filter(c => c.level === 200);
  const workspace = useSelector((state: RootState) => state.workspaceSlice).data;
  const tagNameRef = useRef<HTMLInputElement>(null);
  const divTagRef = useRef<HTMLDivElement>(null);
  const updateStatusItem = async (payload: RequestUpdateTagType, callback?: () => void) => {
    try {
      if (!workspace) {
        return;
      }
      const response = await updateTag(
        workspace.id,
        projectId,
        tag.id,
        payload
      );
      if (response && response.code === API_CODE.OK) {
        if (callback) {
          callback();
        }
        return;
      }
      setEdit(false);
      setColorSelect(tagColor);
    } catch (error) {
      setEdit(false);
      setColorSelect(tagColor);
    }
  }
  useEffect(() => {
    setTagName(tag.name);
    setTagColor(tag.color);
    setColorSelect(tag.color);
  }, [tag.name]);
  useEffect(() => {
    const handleClickOutside = async (event: MouseEvent) => {
      if (divTagRef.current && !divTagRef.current.contains(event.target as Node)) {
        if ((tagNameRef.current?.value && tagNameRef.current.value !== tagName) || colorSelect !== tagColor) {
          updateStatusItem({
            name: tagNameRef.current?.value ?? undefined,
            color: colorSelect
          }, () => {
            notify('Tag is updated', 'success');
            setTagName(tagNameRef.current?.value ?? '');
            setEdit(false);
            setTagColor(colorSelect);
          });
          return;
        }
        setEdit(false);
        setColorSelect(tagColor);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [colorSelect]);
  return (
    <div className="mt-2"
      ref={divTagRef}
      key={position}
      style={{
        padding: edit ? 2 : 8,
        borderRadius: "5px",
        backgroundColor: colorSelect,
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.2)"
      }}
    >
      {edit && <Input type="text" defaultValue={tagName} className="input-blur pl-2" ref={tagNameRef} />}
      {
        !edit && <>
          <FontAwesomeIcon icon={faTag} /> {tagName}
          <FontAwesomeIcon icon={faTrash} className="float-right text-danger w-10 m-t-5" style={{ cursor: 'pointer' }} onClick={() => setTagDeleteId (tag.id)} />
          <FontAwesomeIcon icon={faPencil} className="float-right m-t-5" style={{ cursor: 'pointer' }} onClick={() => setEdit (true)} />
        </>
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
  )
}
export default TagSettingItem;