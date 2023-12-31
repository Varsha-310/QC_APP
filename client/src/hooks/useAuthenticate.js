import { useSelector, useDispatch } from "react-redux";
import { setToken, setStatus } from "../redux/auth/authSlice";
import { useEffect } from "react";
const useAuthenticate = () => {
  console.log("useauthenticate");
  const user = useSelector((state) => state.auth);
  console.log(user);
  const dispatch = useDispatch();

  const setUserToken = (token) => {
    dispatch(setToken(token));
  };

  const getUserToken = () => {
    return user.userToken;
  };

  const setUserStatus = (status) => {
    dispatch(setStatus(status));
  };

  const getUserStatus = () => {
    return user.userStatus;
  };

  const isUserAuthenticated = () => {
    const token = user.userToken;
    const status = user.userStatus;

    if (token && status) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {}, []);

  return {
    setUserToken,
    getUserToken,
    setUserStatus,
    getUserStatus,
    isUserAuthenticated,
  };
};

export default useAuthenticate;
