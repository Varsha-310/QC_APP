import "./styles/KycProgress.css";
import { SectionHeading1 } from "../../components/BasicComponents";
import useUserAuthentication from "../../hooks/useUserAuthentication";
import { useEffect, useState } from "react";
import { getUserToken } from "../../utils/userAuthenticate";
import instance from "../../axios";

const KycProgress = () => {
  const [kycData, setKycData] = useState(null);
  const [isError, setIsError] = useState(false);

  useUserAuthentication();

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
        // console.log(resData);
        setKycData(resData.data);
      }
    } catch (error) {
      // console.log(error);
      setIsError(error.message);
    }
  };

  useEffect(() => {
    getKycStatus();
  }, []);

  return (
    <div className="kyc-progress-container">
      <div className="progress-status">
        {kycData?.dashboard_activated === true ? (
          <>
            <div className="status-heading">
              <SectionHeading1 weight="500" size="20px" lineheight="20px">
                Your Qwikcilver dashboard active.
              </SectionHeading1>
            </div>
            <p className="box-text">
              Easily and securely manage all you store credits and gift cards.
            </p>
          </>
        ) : (
          <>
            <div className="status-heading">
              <SectionHeading1 weight="500" size="20px" lineheight="20px">
                Registration status - Progress
              </SectionHeading1>
              <img
                className="kyc-status__progress"
                src={require("../../assets/icons/pngs/work-in-progress.png")}
                alt="progress"
              />
            </div>
            <p className="box-text">
              Your account will be activated within 2 hours.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default KycProgress;
