import "./styles/ConfirmationPage.css";
import { BiSolidCheckCircle } from "react-icons/bi";
import { SectionTitle } from "../../components/BasicComponents";

const ConfirmationPage = () => {
  return (
    <div className="confirmation_page-container">
      {/* <img className="success-icon" src={Success} alt="" /> */}
      <BiSolidCheckCircle className="success-icon" />

      <div className="confirmation-heading">
        <SectionTitle weight="600" size="32px" lineheight="48px">
          Thanks for signing up for Qwikcilver Gift Card Program
        </SectionTitle>
      </div>

      <p className="confirmaiton-desc">
        Your account will be activated within 2 hours.
      </p>
    </div>
  );
};

export default ConfirmationPage;
