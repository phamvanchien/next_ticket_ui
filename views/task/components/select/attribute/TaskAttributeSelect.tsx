import { ProjectAttributeType } from "@/types/project.type";
import React, { useEffect, useState } from "react";
import TaskAttributeItem from "./TaskAttributeItem";
import { TaskAttributeType } from "@/types/task.type";
import { useSelector } from "react-redux";
import { RootState } from "@/reduxs/store.redux";
import Button from "@/common/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faPlus } from "@fortawesome/free-solid-svg-icons";
import Modal from "@/common/modal/Modal";
import ModalHeader from "@/common/modal/ModalHeader";
import ModalBody from "@/common/modal/ModalBody";
import { useTranslations } from "next-intl";

interface TaskAttributeSelectProps {
  attributes: ProjectAttributeType[]
  taskAttributes: TaskAttributeType[]
  setTaskAttributes: (taskAttributes: TaskAttributeType[]) => void
}

const TaskAttributeSelect: React.FC<TaskAttributeSelectProps> = ({ 
  attributes,
  taskAttributes,
  setTaskAttributes
}) => {
  const attributesUpdated = useSelector((state: RootState) => state.attributeSlice).dataUpdated;
  const attributesDataset = useSelector((state: RootState) => state.attributeSlice).setAttribute;
  const [attributesData, setAttributeData] = useState<ProjectAttributeType[]>(() => {
    let initialAttributes: ProjectAttributeType[] = attributes ?? [];
    if (attributesDataset && attributesDataset.length > 0) {
      const insertedIds = new Set(attributesDataset.map(attr => attr.id));
      initialAttributes = [
        ...initialAttributes.filter(attr => !insertedIds.has(attr.id)),
        ...attributesDataset
      ];
    }
    if (attributesUpdated) {
      initialAttributes = initialAttributes.map(a =>
        a.id === attributesUpdated.id
          ? { ...a, name: attributesUpdated.name, value: attributesUpdated.value }
          : a
      );
    }
  
    return initialAttributes;
  });
  const [openAttributesList, setOpenAttributesList] = useState(false);
  const [attributeAdded, setAttributeAdded] = useState<ProjectAttributeType[]>([]);
  const [attributesWillAdd, setAttributesWillAdd] = useState<ProjectAttributeType[]>([]);
  const handleAddAttributesToTask = () => {
    setAttributeAdded([...attributeAdded, ...attributesWillAdd]);
    setAttributesWillAdd([]);
    setOpenAttributesList(false);
  }
  const t = useTranslations();
  useEffect(() => {
    const allAttributes = []
    for (let i = 0; i < taskAttributes.length; i++) {
      const taskAttribute = taskAttributes[i];
      const attrFind = attributesData.find(a => a.id === taskAttribute.id);
      if (attrFind && taskAttribute.value.length > 0) {
        allAttributes.push(attrFind);
      }
    }
    setAttributeAdded([...attributeAdded, ...allAttributes]);
  }, []);
  if (attributesData.length === 0) {
    return <></>
  }
  return (
    <div>
      <Modal isOpen={openAttributesList}>
        <ModalHeader setShow={setOpenAttributesList} title="Select attributes" />
        <ModalBody>
          <div className="row">
            {
              attributesData.filter(a => !attributeAdded.map(b => b.id).includes(a.id)).map(attribute => (
                <div className="col-12" key={attribute.id}>
                  <Button 
                    color="default" 
                    className="w-100 text-left mt-2" 
                    style={attributesWillAdd.find(a => a.id === attribute.id) ? {background: '#e4e6ea', border: 2, borderStyle: 'solid', borderColor: '#0062cc'} : { background: '#e4e6ea', border: 'none' }}
                    onClick={
                      attributesWillAdd.find(a => a.id === attribute.id) ?
                      () => setAttributesWillAdd (attributesWillAdd.filter(a => a.id !== attribute.id))
                      :
                      () => setAttributesWillAdd ([...attributesWillAdd, attribute])
                    }
                  >
                    <FontAwesomeIcon icon={faCircleDot} /> {attribute.name}
                  </Button>
                </div>
              ))
            }
            <div className="col-12 mt-4">
              <Button color="primary" className="float-right" onClick={handleAddAttributesToTask}>
                Add to task
              </Button>
              <Button color="default" className="float-right mr-2 btn-no-border" outline onClick={() => setOpenAttributesList (false)}>
                {t('btn_cancel')}
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {
        attributeAdded.map(attribute => (
          <TaskAttributeItem 
            attribute={attribute} 
            key={attribute.id}
            taskAttributes={taskAttributes}
            setTaskAttributes={setTaskAttributes}
          />
        ))
      }
      {
        attributesData.filter(a => !attributeAdded.map(b => b.id).includes(a.id)).length > 0 &&
        <div className={`row text-secondary mt-2`}>
          <div className="col-12">
            <Button color="default" className="border-radius-15" style={{ background: '#e4e6ea', border: 'none' }} onClick={() => setOpenAttributesList (true)}>
              <FontAwesomeIcon icon={faPlus} /> Add a attribute
            </Button>
          </div>
        </div>
      }
    </div>
  );
}
export default TaskAttributeSelect;