import React from "react";
import "./styles/PaymentFailed.css";
import { BiSolidErrorCircle } from "react-icons/bi";

const PaymentFailed = () => {
  return (
    <div className="payment-conf__container component">
      <BiSolidErrorCircle className="payment-conf__icon" />
      <p className="payment-conf__msg">
        Unfortunately, the trasaction has failed.
      </p>
    </div>
  );
};

export default PaymentFailed;
