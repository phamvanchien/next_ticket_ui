import GoToWorkspaceView from "@/views/go-to-workspace/GoToWorkspaceView";
import '../css/pages/workspace.css';
import '../css/pages/auth.css';
import WrapApp from "@/common/layouts/WrapApp";

const GoToWorkspacePage = () => {
  return (
    <WrapApp>
      <GoToWorkspaceView />
    </WrapApp>
  );
}
export default GoToWorkspacePage;