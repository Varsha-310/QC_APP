import { SectionHeading1 } from "../../components/BasicComponents";
import SecureDoc from "../../assets/icons/pngs/secure document.png";
import "./styles/KycProgress.css";

const KycProgress = () => {
  return (
    <div className="kyc-progress-container">
      <div className="progress-status">
        <div className="status-heading">
          <SectionHeading1 weight="500" size="20px" lineheight="20px">
            KYC status - Progress
          </SectionHeading1>
          <img
            src={require("../../assets/icons/pngs/work-in-progress.png")}
            alt="progress"
          />
        </div>
        <p className="box-text">
          Your account will be activated within 2 hours.
        </p>
      </div>

      <img src={SecureDoc} alt="" className="footer-img" />
    </div>
  );
};

export default KycProgress;
