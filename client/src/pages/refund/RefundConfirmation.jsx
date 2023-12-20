import Success from "../../assets/icons/svgs/success.svg";
import { BsFillCheckCircleFill } from "react-icons/bs";
import "./styles/RefundConfirmation.css";

export default function RefundConfirmation() {
  return (
    <div className="refund-conf-page__container component">
      {/* <img src={Success} alt="" /> */}
      <BsFillCheckCircleFill className="refund-conf-page__icon" />
      <p className="refund-conf-page__msg">
        Your refund is processed successfully
      </p>
    </div>
  );
}
