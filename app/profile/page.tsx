import ProfilePersonalView from "@/views/profile/personal/ProfilePersonalView";
import '../css/pages/profile.css';
import WrapApp from "@/common/layouts/WrapApp";

const ProfilePage = () => {
  return (
    <WrapApp>
      <ProfilePersonalView />
    </WrapApp>
  )
}
export default ProfilePage;