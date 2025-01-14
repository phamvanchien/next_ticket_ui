"use client"
import { faPager } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DocumentCreate from "./components/DocumentCreate";

const DocumentView = () => {
  return <>
    <div className="row mb-4">
      <div className="col-12">
        <h3><FontAwesomeIcon icon={faPager} className="text-primary" /> Documents</h3>
      </div>
    </div>
    <DocumentCreate />
  </>
}
export default DocumentView;