import { ProjectAttributeType, ProjectType } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import TaskAttributeItem from "./TaskAttributeItem";
import { TaskAttributeType } from "@/types/task.type";
import Button from "@/common/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { Dropdown, MenuProps, Select } from "antd";
import Modal from "@/common/modal/Modal";
import ModalHeader from "@/common/modal/ModalHeader";
import ModalBody from "@/common/modal/ModalBody";
import CreateAttribute from "./CreateAttribute";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";

interface TaskAttributeSelectProps {
  project: ProjectType
  attributes: ProjectAttributeType[]
  taskAttributes: TaskAttributeType[]
  taskAttributeResponse?: TaskAttributeType[]
  setTaskAttributes: React.Dispatch<React.SetStateAction<TaskAttributeType[]>>
}

const TaskAttributeSelect: React.FC<TaskAttributeSelectProps> = ({ 
  project,
  attributes,
  taskAttributes,
  taskAttributeResponse,
  setTaskAttributes
}) => {
  const t = useTranslations();
  const [projectAttributes, setProjectAttributes] = useState<MenuProps['items']>([]);
  const [attributeAdded, setAttributeAdded] = useState<TaskAttributeType[]>(taskAttributes);
  const [openCreate, setOpenCreate] = useState(false);
  const attrUpdated = useSelector((state: RootState) => state.attributeSlice).dataUpdated;

  const handleAddAttribute = (attribute: ProjectAttributeType) => {
    setAttributeAdded(prev => [...prev, {
      id: Date.now() + Math.floor(Math.random() * 10000),
      value: '',
      attribute: attribute
    }]);
  };

  useEffect(() => {
    const newAttributes = attributes.map(a => ({
      key: a.id,
      label: <div onClick={() => handleAddAttribute (a)}>{a.name}</div>,
    }));

    newAttributes.push({
      key: 0,
      label: (
        <div onClick={() => setOpenCreate (true)} style={{ borderTop: "1px solid #3333", paddingTop: "5px" }}>
          <FontAwesomeIcon icon={faPlus} /> {t('tasks.create_property_label')}
        </div>
      ),
    });

    setProjectAttributes(newAttributes);
  }, [attributes]);

  useEffect(() => {
    if (!attrUpdated || !attrUpdated.id) return;
  
    setProjectAttributes((prevAttributes) => {
      if (!Array.isArray(prevAttributes)) return prevAttributes;
      let updatedAttributes = prevAttributes.filter(attr => (attr && attr.key !== 0));
  
      const existingIndex = updatedAttributes.findIndex(attr => (attr && attr.key === attrUpdated.id));
  
      if (existingIndex !== -1) {
        updatedAttributes[existingIndex] = {
          key: attrUpdated.id,
          label: <div onClick={() => handleAddAttribute(attrUpdated)}>{attrUpdated.name}</div>
        };
      } else {
        updatedAttributes = [
          ...updatedAttributes,
          {
            key: attrUpdated.id,
            label: <div onClick={() => handleAddAttribute(attrUpdated)}>{attrUpdated.name}</div>
          }
        ];
      }

      updatedAttributes.push({
        key: 0,
        label: (
          <div onClick={() => setOpenCreate(true)} style={{ borderTop: "1px solid #3333", paddingTop: "5px" }}>
            <FontAwesomeIcon icon={faPlus} /> {t('tasks.create_property_label')}
          </div>
        ),
      });
  
      return updatedAttributes;
    });
  }, [attrUpdated]);
  

  useEffect(() => {
    if (taskAttributeResponse) {
      setAttributeAdded([]);
      setTaskAttributes([]);
      setTimeout(() => {
        setAttributeAdded(taskAttributeResponse.filter(attr => 
          taskAttributeResponse.some(res => res.id === attr.id)
        ));
        setTaskAttributes(taskAttributeResponse.filter(attr => 
          taskAttributeResponse.some(res => res.id === attr.id)
        ));
      }, 0);
    }
  }, [taskAttributeResponse]);

  return (
    <div>
      {
        attributeAdded.map(attribute => (
          <TaskAttributeItem 
            attribute={attribute.attribute} 
            id={attribute.id}
            value={attribute.value}
            key={attribute.id} 
            setTaskAttributes={setTaskAttributes}
          />
        ))
      }
      <div className={`row text-secondary mt-4`}>
        <div className="col-12">
          <Dropdown getPopupContainer={(trigger) => trigger.parentElement || document.body} menu={{ items: projectAttributes }} placement="bottomLeft" trigger={["click"]}>
            <Button color="default" className="btn-no-border">
              <FontAwesomeIcon icon={faPlus} /> {t('tasks.add_property_label')}
            </Button>
          </Dropdown>
        </div>
      </div>
      <CreateAttribute project={project} openCreate={openCreate} setOpenCreate={setOpenCreate} />
    </div>
  );
}
  /*
    1. text
    2. select_one
    3. select_multiple
    4. date_picker
    5. members_list
    6. tags_list
  */
export default TaskAttributeSelect;