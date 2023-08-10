import Success from "../../assets/icons/svgs/success.svg";
import "./styles/RefundConfirmation.css";

export default function RefundConfirmation() {
  return (
    <div className="refund-conf-page__container component">
      <img src={Success} alt="" />
      <p>Your Refund has been succesfull</p>
    </div>
  );
}
