import CreateWorkspaceView from "@/views/workspace/create/CreateWorkspaceView";
import '../../css/pages/auth.css';
import '../../css/pages/workspace.css';
import WrapApp from "@/common/layouts/WrapApp";

const CreateWorkspacePage = () => {
  return (
    <WrapApp>
      <CreateWorkspaceView />
    </WrapApp>
  )
}
export default CreateWorkspacePage;