"use client"
import { APP_LINK, APP_LOCALSTORAGE, APP_VALIDATE_TYPE } from "@/enums/app.enum";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/common/components/Input";
import Button from "@/common/components/Button";
import Textarea from "@/common/components/Textarea";
import { ChangeEvent, FormEvent, useState } from "react";
import { WORKSPACE_ENUM } from "@/enums/workspace.enum";
import { AppErrorType, BaseResponseType } from "@/types/base.type";
import { catchError, hasError, printError, validateInput } from "@/services/base.service";
import { create } from "@/api/workspace.api";
import { API_CODE } from "@/enums/api.enum";
import Loading from "@/common/components/Loading";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CreateWorkspaceView = () => {
  const router = useRouter();
  const [name, setName] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState<string>();
  const [error, setError] = useState<AppErrorType | null>(null);
  const [validateError, setValidateError] = useState<AppErrorType[] | []>([]);
  const handleValidateName = (value: string = name ?? '') => {
    const required = validateInput('name', value ?? '', WORKSPACE_ENUM.NAME_IS_EMPTY, APP_VALIDATE_TYPE.REQUIRED, validateError, setValidateError);
    if (!required) {
      return false;
    }
    return true;
  }
  const handleWorkspaceNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    handleValidateName(event.target.value);
  }
  const handleWorkspaceDescriotionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  }
  const handleSubmitCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!handleValidateName()) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await create({
        name: name ?? '',
        description: description
      });
      if (response && response.code === API_CODE.CREATED) {
        localStorage.setItem(APP_LOCALSTORAGE.WORKSPACE_STORAGE, response.data.id.toString());
        router.push (APP_LINK.WORKSPACE + '/' + response.data.id);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(catchError(response));
    } catch (error) {
      setLoading(false);
      setError(catchError(error as BaseResponseType));
    }
  }
  return (
    <div className="row">
      <div className="col-12 text-secondary">
        <h3><FontAwesomeIcon icon={faPlus} /> Create Workspaces</h3>
      </div>
      {
        (error) && 
        <div className="col-12">
          <div className="alert alert-light alert-error">
            <b className="text-danger mt-2">Error: </b> {error.message}
          </div>
        </div>
      }
      <form className="mt-4" onSubmit={handleSubmitCreate}>
        <div className="row">
          <div className="col-12">
            <Input 
              type="text" 
              minLength={3} 
              maxLength={100} 
              placeholder="Enter your workspace name" 
              onChange={handleWorkspaceNameChange} 
              invalid={hasError(validateError, 'name')}
              disabled={loading}
            />
            {
              hasError(validateError, 'name') &&
              <div className="invalid-feedback" style={{display: 'block'}}>
                {printError(validateError, 'name')}
              </div>
            }
          </div>
          <div className="col-12">
            <Textarea 
              className="mt-2" 
              placeholder="Workspace description" 
              onChange={handleWorkspaceDescriotionChange} 
              disabled={loading}></Textarea>
          </div>
          <div className="col-12">
            <Button type="button" color="secondary" outline className="float-right mt-2" onClick={() => router.push (APP_LINK.GO_TO_WORKSPACE)} disabled={loading}>
              Back
            </Button>
            <Button type="submit" color="primary" className="float-right mt-2 mr-2" disabled={loading}>
              {loading ? <Loading color="light" /> : 'Create'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
export default CreateWorkspaceView;