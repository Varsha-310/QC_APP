import SecureDoc from "../../assets/icons/pngs/secure document.png";
import { useEffect } from "react";
import "./styles/KycProgress.css";
import { SectionHeading1 } from "../../components/BasicComponents";
import { setUserToken } from "../../utils/userAuthenticate";

const KycProgress = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      setUserToken(token);
      sessionStorage.setItem("qcUserStatus", true);
    }
    // getKycStatus();
  }, []);

  return (
    <div className="kyc-progress-container">
      <div className="progress-status">
        <div className="status-heading">
          <SectionHeading1 weight="500" size="20px" lineheight="20px">
            KYC status - Progress
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
      </div>
    </div>
  );
};

export default KycProgress;
