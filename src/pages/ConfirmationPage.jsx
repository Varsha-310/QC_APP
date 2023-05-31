import "./style/ConfirmationPage.css";
import Success from "../assets/icons/svgs/success.svg";
import { SectionTitle } from "../components/Components";

const ConfirmationPage = () => {
  return (
    <div className="confirmation_page-container">
      <img className="success-icon" src={Success} alt="" />

      <div className="confirmation-heading">
        <SectionTitle weight="600" size="32px" lineheight="48px">
          Thanks for signing up for Qwikcilver Gift Card Program
        </SectionTitle>
      </div>

      <p className="confirmaiton-desc">
        Your account will be activated within 2 hours. You will now be
        redirected to Qwikcilver Dashboard in 10 seconds.
      </p>
    </div>
  );
};

export default ConfirmationPage;
