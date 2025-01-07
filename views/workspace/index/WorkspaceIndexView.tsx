"use client"
import { RootState } from "@/reduxs/store.redux";
import { useSelector } from "react-redux";

const WorkspaceIndexView = () => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  return (
    <div className="container">
      <div className="row">
        <div className="col-12 text-center">
          <h3>Hi! {userLogged?.first_name} {userLogged?.last_name}</h3>
        </div>
      </div>
    </div>
  )
}
export default WorkspaceIndexView;