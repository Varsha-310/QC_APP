import { useEffect } from "react";
import { setUserStatus, setUserToken } from "../utils/userAuthenticate";
import instance from "../axios";

const useUserAuthentication = () => {
  const getKycStatus = async (token) => {
    const url = "/kyc/status";
    const headers = {
      Authorization: token,
    };

    try {
      const res = await instance.post(url, {}, { headers });

      if (res?.status === 200) {
        const resData = res.data;

        return await resData.data;
      }
    } catch (error) {
      console.log(error.message);
    }
    return false;
  };

  const setUserCredentials = async (token) => {
    setUserToken(token);

    setUserStatus(true);
    // const active_status = await getKycStatus(token);

    // if (active_status?.dashboard_activated === true) {
    //   setUserStatus(true);
    // }
    // console.log("activestatus", active_status);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setUserCredentials(token);
      // sessionStorage.setItem("qcUserStatus", true);
    }
  }, []);
};

export default useUserAuthentication;
