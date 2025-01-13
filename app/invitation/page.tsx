import InvitationView from "@/views/invitation/InvitationView";
import '../css/pages/auth.css';
import '../css/pages/invitation.css';
import WrapApp from "@/common/layouts/WrapApp";

const InvitationPage = () => {
  return (
    <WrapApp>
      <InvitationView />
    </WrapApp>
  );
}
export default InvitationPage;