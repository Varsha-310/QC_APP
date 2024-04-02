import { useEffect, useState } from "react";
import useScrollTop from "../../hooks/useScrollTop";
import "./styles/Issues.css";
import instance from "../../axios";
import { getUserToken } from "../../utils/userAuthenticate";
const Issues = () => {
  useScrollTop();

  const [supportURL, setSupportUrl] = useState("");

  const getKycStatus = async () => {
    const url = "/kyc/status";
    const headers = {
      Authorization: getUserToken(),
    };

    try {
      const res = await instance.post(url, {}, { headers });

      if (res?.status === 200) {
        const resData = res.data;

        if (resData?.code === 401) {
          throw new Error(
            "Authentication Failed: Unable to authenticate. Please log in again."
          );
        }
        if (resData?.code === 403) {
          throw new Error(
            "Session Expired: Your Session has expired. Please log in again."
          );
        }

        // for any other error
        if (resData?.code !== 200) {
          throw new Error("There is some Error in the server.");
        }

        setSupportUrl(resData?.data?.support_url || "");
      }
    } catch (error) {
      console.log(error);
      // setIsError(error.message);
    }
  };
  useEffect(() => {
    getKycStatus();
  }, []);

  return (
    <div className="issues-container component">
      <div className="component-primary-heading">Have an Issue?</div>
      <div className="section-box-container">
        <p>
          Please use Qwikcilver’s Support Dashboard to raise any Issues you are
          facing.
        </p>
        <p>
          To Access the dashboard,{" "}
          <a href={supportURL} target="_blank" rel="noreferrer">
            Click Here.
          </a>
        </p>
      </div>
    </div>
  );
};

export default Issues;
