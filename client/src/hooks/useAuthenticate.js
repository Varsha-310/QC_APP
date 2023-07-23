import { useSelector, useDispatch } from "react-redux";
import { setToken, setStatus } from "../redux/auth/authSlice";
const useAuthenticate = () => {
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

  return {
    setUserToken,
    getUserToken,
    setUserStatus,
    getUserStatus,
    isUserAuthenticated,
  };
};

export default useAuthenticate;
