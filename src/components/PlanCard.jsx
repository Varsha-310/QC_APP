import React from "react";
import "./styles/PlanCard.css";
import RoundedTick from "../assets/icons/svgs/cicletick.svg";
import { CustomBtn } from "./Components";

const PlanCard = ({ title, price, active ,popular}) => {
  return (
    <div className={`plan-card ${active ? "card-shadow" : ""}`}>
     { popular && <div className="popular-banner">
        <div className="text">Most Popular</div>
      </div>}

      <div className="plan-card-title">{title}</div>
      <div className="plan-card-price">
        ₹ {price}
        <span>/Month</span>
      </div>

      <div className="bar"></div>

      <div className="plan-card-subtitle">Monthly Subscription Limits</div>
      <div className="plan-card-value">
        <img src={RoundedTick} />
        Plan Issuance Value - Rs 5,000,000
      </div>

      <div className="bar"></div>

      <div className="plan-card-subtitle-2">
        Monthly Usage Fees (Charge beyond limits)
      </div>
      <div className="plan-card-value">
        <img src={RoundedTick} />
        As of (%) value of Issuance - 1.70%
      </div>

      <div className="plan-card-btn">
        <CustomBtn active={active}>{active ? "Selected" : "Select"}</CustomBtn>
      </div>
    </div>
  );
};

export default PlanCard;
