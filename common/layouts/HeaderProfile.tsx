"use client"
import { APP_AUTH, IMAGE_DEFAULT } from "@/enums/app.enum";
import { RootState, useAppDispatch } from "@/reduxs/store.redux";
import { setUser } from "@/reduxs/user.redux";
import { getCookie, setCookie } from "@/utils/cookie.util";
import { faSignIn } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HeaderProfile = () => {
  const userLogged = useSelector((state: RootState) => state.userSlice).data;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userAuth = getCookie(APP_AUTH.COOKIE_AUTH_USER);
    if (userAuth) {
      const userParse = JSON.parse(userAuth);
      dispatch(setUser(userParse));
      setLoading(false);
    }
  }, []);

  return (
    <li className="nav-item dropdown">
      {
        <Link href="/thong-tin-ca-nhan">
          <div className="widget-user-image user-avatar-header">
            <img 
              className="img-circle elevation-2" 
              src={loading ? IMAGE_DEFAULT.NO_USER : ((userLogged && userLogged.avatar) ? userLogged.avatar : '/img/unnamed.png')}
              width={40} height={40} 
              alt="User Avatar" 
            />
          </div>
        </Link>
      }
    </li>
  )
}
export default HeaderProfile;