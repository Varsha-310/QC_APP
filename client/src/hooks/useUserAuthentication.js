import { useEffect } from "react";
import { setUserToken } from "../utils/userAuthenticate";

const useUserAuthentication = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setUserToken(token);
      sessionStorage.setItem("qcUserStatus", true);
    }
  }, []);
};

export default useUserAuthentication;
